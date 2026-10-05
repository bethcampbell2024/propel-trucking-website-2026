"""The moving road: the photo's own asphalt grain, scrolled in true perspective, plus lane paint.

Light, colour and the truck's shadow come from the photo (low-pass) and stay put; only the fine
grain and the painted lines move. That keeps the road glued to the truck instead of sliding under it.
"""
import cv2
import numpy as np

from geometry import ground_coords, ground_to_pixel

PPM = 400.0  # texture resolution: texels per metre
TILE_A = 3.05  # metres along the road covered by one source patch
TILE_L = 1.0  # metres across (all that fits inside the clean, sunlit part of the photo; see find_patch.py)
PATCH_CENTRE_PIXEL = (1440.0, 1000.0)
PERIOD_A = 2 * TILE_A  # mirrored tiling: 6.1 m, exactly half of the 12.2 m dash period, so everything loops together
PERIOD_L = 2 * TILE_L
LEVELS = 9
PAD = 2
DASH_PERIOD = 12.2  # 40 ft
DASH_LENGTH = 3.05  # 10 ft
LINE_WIDTH = 0.15

# Where the truck sits, found by the calibration: its near wheels are at l = -3.55 m, so its centre line is
# about 1 m further from the camera. Lanes are 3.66 m (12 ft).
LANE = 3.66
TRUCK_CENTRE = -4.55
LINES = [
    # (lateral position, dashed?, colour)
    (TRUCK_CENTRE + LANE / 2, True, (1.0, 1.0, 0.97)),  # lane divider between the truck and the camera's lane
    (TRUCK_CENTRE - LANE / 2, False, (1.0, 1.0, 0.97)),  # right edge line, behind the truck
    (TRUCK_CENTRE + LANE * 1.5, False, (1.0, 0.82, 0.2)),  # yellow line on the camera's side
]
PAINT_BRIGHTNESS = 2.2  # paint is this many times brighter than the asphalt it sits on, in the same light


class Ground:
    def __init__(self, photo: np.ndarray, ground_alpha: np.ndarray, y0: int, y1: int):
        """photo: float32 RGB 0..1, full size. Rows y0..y1 are the part that ends up in the video."""
        self.height, self.width = y1 - y0, photo.shape[1]
        rows, cols = np.mgrid[y0:y1, 0 : self.width].astype(np.float32)
        a, l = ground_coords(cols + 0.5, rows + 0.5)
        self.a = np.nan_to_num(a, nan=0.0).astype(np.float32)
        self.l = np.nan_to_num(l, nan=0.0).astype(np.float32)

        gy_a, gx_a = np.gradient(self.a)
        gy_l, gx_l = np.gradient(self.l)
        self.foot_a = np.hypot(gy_a, gx_a)  # metres of road along the heading per pixel
        self.foot_l = np.hypot(gy_l, gx_l)
        level = np.log2(np.maximum(np.maximum(self.foot_a, self.foot_l) * PPM, 1.0))
        self.level = np.clip(np.rint(level), 0, LEVELS - 1).astype(np.int32)

        self._build_texture(photo)
        self._build_lighting(photo, ground_alpha, y0)

    # ------------------------------------------------------------------ texture

    def _build_texture(self, photo: np.ndarray) -> None:
        """Straighten a clean sunlit patch of asphalt into top-down grain, mirror-tile it, mip it."""
        centre_a, centre_l = (float(v) for v in ground_coords(np.array(PATCH_CENTRE_PIXEL[0]), np.array(PATCH_CENTRE_PIXEL[1])))
        n_a, n_l = round(TILE_A * PPM), round(TILE_L * PPM)
        grid_a = centre_a + (np.arange(n_a) + 0.5 - n_a / 2) / PPM
        grid_l = centre_l + (np.arange(n_l) + 0.5 - n_l / 2) / PPM
        aa, ll = np.meshgrid(grid_a, grid_l, indexing="ij")
        u, v = ground_to_pixel(aa, ll)
        grey = cv2.cvtColor(photo, cv2.COLOR_RGB2GRAY)
        patch = cv2.remap(grey, u.astype(np.float32), v.astype(np.float32), cv2.INTER_CUBIC, borderMode=cv2.BORDER_REFLECT)
        self.patch_corners = [(float(u[i, j]), float(v[i, j])) for i, j in [(0, 0), (0, -1), (-1, -1), (-1, 0)]]

        detail = np.clip(patch / (cv2.GaussianBlur(patch, (0, 0), 45) + 1e-3), 0.4, 1.8)
        tile = np.block([[detail, detail[:, ::-1]], [detail[::-1], detail[::-1, ::-1]]]).astype(np.float32)
        self.tile = tile

        levels = []
        for k in range(LEVELS):
            rows_k = max(8, round(tile.shape[0] / 2**k))
            cols_k = max(8, round(tile.shape[1] / 2**k))
            levels.append(tile if k == 0 else cv2.resize(tile, (cols_k, rows_k), interpolation=cv2.INTER_AREA))
        self.rows_k = np.array([lv.shape[0] for lv in levels], np.float32)
        self.cols_k = np.array([lv.shape[1] for lv in levels], np.float32)
        padded = [np.pad(lv, PAD, mode="wrap") for lv in levels]
        self.x_off = np.cumsum([0] + [p.shape[1] for p in padded[:-1]]).astype(np.float32)
        atlas = np.ones((max(p.shape[0] for p in padded), sum(p.shape[1] for p in padded)), np.float32)
        for offset, block in zip(self.x_off.astype(int), padded):
            atlas[: block.shape[0], offset : offset + block.shape[1]] = block
        self.atlas = atlas

        self.rows_pp = self.rows_k[self.level]
        # The across-the-road coordinate never changes, so its map is built once.
        self.map_x = (self.x_off[self.level] + PAD + ((self.l % PERIOD_L) / PERIOD_L) * self.cols_k[self.level] - 0.5).astype(np.float32)

    # ------------------------------------------------------------------ lighting

    def _build_lighting(self, photo: np.ndarray, ground_alpha: np.ndarray, y0: int) -> None:
        """Smooth colour and brightness (including the truck's shadow) taken from the photo's own ground.

        A median filter drops thin cracks, then a blur that only averages ground pixels (so the white truck
        never bleeds into the road) removes the grain, which the scrolling texture supplies instead.
        """
        mask = (ground_alpha > 0.5).astype(np.float32)
        smooth = cv2.medianBlur((np.clip(photo, 0, 1) * 255).astype(np.uint8), 9).astype(np.float32) / 255.0
        numerator = cv2.GaussianBlur(smooth * mask[..., None], (0, 0), 8)
        denominator = cv2.GaussianBlur(mask, (0, 0), 8)[..., None]
        low_pass = numerator / np.maximum(denominator, 1e-3)
        self.light = low_pass[y0 : y0 + self.height].astype(np.float32)
        self.luma = self.light @ np.array([0.299, 0.587, 0.114], np.float32)

        # Worn tyre tracks: slightly darker bands along each lane, which also helps the eye read the lanes.
        wear = np.zeros_like(self.l)
        for lane in range(-2, 3):
            for side in (-0.9, 0.9):
                wear += np.exp(-(((self.l - (TRUCK_CENTRE + lane * LANE + side)) / 0.3) ** 2))
        self.wear = (1.0 - 0.07 * np.clip(wear, 0, 1)).astype(np.float32)

    # ------------------------------------------------------------------ per frame

    def _grain(self, scroll: float) -> np.ndarray:
        rows = PAD + (((self.a - scroll) % PERIOD_A) / PERIOD_A) * self.rows_pp - 0.5
        return cv2.remap(self.atlas, self.map_x, rows.astype(np.float32), cv2.INTER_LINEAR)

    def _paint(self, scroll: float, grain: np.ndarray) -> list[tuple[np.ndarray, tuple[float, float, float]]]:
        layers = []
        wear = np.clip(0.8 + 0.5 * (grain - 1.0), 0.3, 1.0)
        for position, dashed, colour in LINES:
            cover = np.clip((LINE_WIDTH / 2 - np.abs(self.l - position)) / np.maximum(self.foot_l, 1e-4) + 0.5, 0, 1)
            if dashed:
                phase = ((self.a - scroll) + DASH_PERIOD / 2) % DASH_PERIOD - DASH_PERIOD / 2
                cover = cover * np.clip((DASH_LENGTH / 2 - np.abs(phase)) / np.maximum(self.foot_a, 1e-4) + 0.5, 0, 1)
            layers.append((cover * wear, colour))
        return layers

    def render(self, scroll: float) -> np.ndarray:
        grain = self._grain(scroll)
        rgb = self.light * (self.wear * (1.0 + 0.9 * (grain - 1.0)))[..., None]
        paint_light = np.clip(self.luma * PAINT_BRIGHTNESS, 0, 0.95)[..., None]
        for cover, colour in self._paint(scroll, grain):
            rgb = rgb * (1 - cover[..., None]) + paint_light * np.array(colour, np.float32) * cover[..., None]
        return rgb
