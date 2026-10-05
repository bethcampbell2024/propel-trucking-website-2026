"""Swap the photo's sky (and the water tower standing in it) for a real mountain photo.

Done once, on the still photo, before anything is animated. Only sky-blue pixels are replaced, so the
building, trees, fence and truck keep their exact pixels and the mountains sit behind them.
"""
import cv2
import numpy as np
from PIL import Image, ImageOps

from common import MOUNTAIN_PHOTO
from geometry import HORIZON_Y
from masks import CUTOUT, TRAILER_POLY

SKY_BOTTOM = 556  # rows at or below this are the paved lot and roadside: nothing is replaced there
CAB_END_X = 1300  # right of this the cutout model is unreliable (mirror tank, ghost tower): only traced polygons count
TOWER_BOX = (1480, 0, 1760, 400)  # x0, y0, x1, y1: only the tower and sky live here, so everything not truck goes
SKY_SAMPLE = (slice(0, 470), slice(10, 100))  # clean sky at the left edge: the truck photo's own gradient to match

# Tank, catwalk and end cap, traced from zoomed grid crops (working-image pixels). The tank is mirror-polished
# and reflects the sky, so a colour key can't tell it from sky. The outline sits a few pixels outside the
# tank on purpose: a sliver of old blue sky is invisible, a bitten-off tank is not.
TANK_POLY = [
    (1284, 294), (1312, 299), (1400, 324), (1450, 342), (1500, 356), (1522, 361), (1560, 358), (1640, 351),
    (1667, 354), (1690, 356), (1696, 360), (1712, 381), (1668, 386), (1650, 386), (1650, 404), (1668, 406), (1703, 408), (1731, 414),
    (1760, 424), (1781, 433), (1803, 449), (1817, 468), (1824, 500), (1824, 560), (1290, 560),
]

# The mountain photo, scaled to MOUNTAIN_ZOOM x the working width, then cropped so that its top-left corner
# lands MOUNTAIN_ORIGIN px (x, y) in from the canvas corner. Slide y to raise or lower the range; zoom for bigger peaks.
MOUNTAIN_ZOOM = 1.35
MOUNTAIN_ORIGIN = (335, 420)
MOUNTAIN_SKY_ENDS = 0.40  # fraction of the photo's height below which it is all mountain, no sky
SKY_FLOOD_STEP = 0.015  # biggest colour step (0..1) between neighbouring pixels that still counts as the same sky
SKY_SCALES = (250, 60, 12)  # px, broad to local: the photo's own sky colour is learned at each scale, finest wherever sky is near
MOUNTAIN_SCALES = (40, 12, 4)  # same idea for the mountain colour hugging the ridgeline, which needs to be very local
MIN_CONTRAST = 0.004  # squared colour distance between sky and mountain below which a ridge is too faint to read a mix from


def _smoothstep(lo: float, hi: float, x: np.ndarray) -> np.ndarray:
    t = np.clip((x - lo) / (hi - lo), 0, 1)
    return t * t * (3 - 2 * t)


def _soft_blur(image: np.ndarray, sigma: float) -> np.ndarray:
    """Gaussian blur with a big sigma, done at quarter size because only the broad shape matters."""
    height, width = image.shape[:2]
    small = cv2.resize(image, (width // 4, height // 4), interpolation=cv2.INTER_AREA)
    small = cv2.GaussianBlur(small, (0, 0), sigma / 4)
    return cv2.resize(small, (width, height), interpolation=cv2.INTER_LINEAR)


def _truck_alpha(width: int, height: int) -> np.ndarray:
    """Soft 0..1 truck mask for protecting truck pixels (windshield, mirrors, chrome) from the sky key."""
    cutout = np.asarray(Image.open(CUTOUT).getchannel("A"), np.float32) / 255.0
    truck = _smoothstep(0.2, 0.7, cutout)
    truck[:, CAB_END_X:] = 0
    traced = np.zeros((height, width), np.float32)
    cv2.fillPoly(traced, [np.array(poly, np.int32) for poly in (TANK_POLY, TRAILER_POLY)], 1.0)
    return np.maximum(truck, cv2.GaussianBlur(traced, (0, 0), 1.2))


def sky_alpha(photo: np.ndarray) -> np.ndarray:
    """How much of each pixel of the truck photo is sky to be replaced, 0..1."""
    height, width = photo.shape[:2]
    red, blue = photo[..., 0], photo[..., 2]
    key = _smoothstep(0.15, 0.40, (blue - red) / np.maximum(blue, 1e-3))  # sky is strongly blue; trees, walls, cab are not
    x0, y0, x1, y1 = TOWER_BOX
    key[y0:y1, x0:x1] = 1.0  # the tower is white, so the key would keep it
    above_lot = np.clip((SKY_BOTTOM - np.arange(height, dtype=np.float32)) / 4, 0, 1)[:, None]
    return key * (1 - _truck_alpha(width, height)) * above_lot


def _sky_gradient(photo: np.ndarray) -> np.ndarray:
    """(height, 1, 3) sky colour per row: the truck photo's own gradient, paling toward the horizon."""
    height = photo.shape[0]
    strip = np.median(photo[SKY_SAMPLE], axis=1)  # one colour per sampled row
    sampled = np.arange(strip.shape[0])
    rows = np.arange(height, dtype=np.float32)
    fitted = np.stack([np.polyval(np.polyfit(sampled, strip[:, c], 2), np.minimum(rows, sampled[-1])) for c in range(3)], axis=-1)
    haze = _smoothstep(300, HORIZON_Y, rows)[:, None]
    return (fitted * (1 - 0.6 * haze) + np.float32([0.80, 0.88, 0.96]) * 0.6 * haze)[:, None, :]


def _learn_colour(image: np.ndarray, region: np.ndarray, scales: tuple[int, ...]) -> np.ndarray:
    """The colour of the pixels `region` marks, extended to every pixel. Learned at each scale from broad to local;
    the finest scale wins wherever there is enough of the region nearby, the broader ones fill in elsewhere."""
    region = region.astype(np.float32)
    weighted = image * region[..., None]
    estimate = np.zeros_like(image)
    for sigma in scales:
        learned, support = _soft_blur(weighted, sigma), _soft_blur(region, sigma)[..., None]
        trust = np.clip(support / 0.05, 0, 1)
        estimate = trust * learned / np.maximum(support, 1e-6) + (1 - trust) * estimate
    return estimate


def _separate_sky(full: np.ndarray) -> tuple[np.ndarray, np.ndarray]:
    """Splits the mountain photo into (matte, its own sky colour at every pixel). The matte is 1 on mountain, 0 on sky.

    Sky is whatever can be reached from the top edge by tiny colour steps: it fades smoothly (glare, haze), while
    a mountain ridge is a real edge that stops the fill. That survives the corner glare that a plain
    colour-distance key mistakes for mountain, and sunlit slopes can never be mistaken for sky."""
    sky_rows = int(MOUNTAIN_SKY_ENDS * full.shape[0])
    top = full[:sky_rows]
    filled = np.zeros((sky_rows + 2, full.shape[1] + 2), np.uint8)  # floodFill wants a 1px border
    flags = 4 | cv2.FLOODFILL_MASK_ONLY | (255 << 8)
    for seed_x in range(0, full.shape[1], 40):  # the open sky between peaks is separate patches along the top edge
        if not filled[1, seed_x + 1]:
            cv2.floodFill(top, filled, (seed_x, 0), (0, 0, 0), (SKY_FLOOD_STEP,) * 3, (SKY_FLOOD_STEP,) * 3, flags)
    sky = filled[1:-1, 1:-1] > 0

    # The two colours just clear of the ridgeline (the pixels on it are mixed). The sky is brightest hugging the
    # horizon, so the sky estimate has to be very local there too.
    kernel = np.ones((3, 3), np.uint8)
    mountain = ~sky
    sky_estimate = _learn_colour(top, cv2.erode(sky.astype(np.uint8), kernel), SKY_SCALES)
    mountain_estimate = _learn_colour(top, cv2.erode(mountain.astype(np.uint8), kernel), MOUNTAIN_SCALES)

    # On the ridgeline each pixel is a mix of the two, read off its colour: how far along the line from sky colour to
    # mountain colour it sits. (A plain 0/1 cut keeps a pale rim of sky on every peak.)
    contrast = mountain_estimate - sky_estimate
    strength = (contrast**2).sum(axis=2)
    mix = ((top - sky_estimate) * contrast).sum(axis=2) / np.maximum(strength, 1e-6)
    wide = np.ones((5, 5), np.uint8)
    on_ridge = (cv2.dilate(sky.astype(np.uint8), wide) & cv2.dilate(mountain.astype(np.uint8), wide)).astype(bool)
    cut = cv2.GaussianBlur(mountain.astype(np.float32), (0, 0), 0.8)  # fallback where the ridge is too faint to read
    matte = np.ones(full.shape[:2], np.float32)  # below the sky it is all mountain
    matte[:sky_rows] = np.where(on_ridge & (strength > MIN_CONTRAST), np.clip(mix, 0, 1), cut)

    padding = np.repeat(sky_estimate[-1:], full.shape[0] - sky_rows, axis=0)
    return matte, np.concatenate([sky_estimate, padding]).astype(np.float32)


def _mountain_layer(width: int, height: int) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
    """The mountain photo placed on the working canvas: (pixels, matte, its own sky colour at each pixel)."""
    image = ImageOps.exif_transpose(Image.open(MOUNTAIN_PHOTO)).convert("RGB")
    scale = MOUNTAIN_ZOOM * width / image.width
    image = image.resize((round(image.width * scale), round(image.height * scale)), Image.LANCZOS)
    full = np.asarray(image, np.float32) / 255.0
    matte, sky = _separate_sky(full)

    # Only the rows above the lot are ever shown, so only those must be covered; the rest is edge padding.
    x0, y0 = MOUNTAIN_ORIGIN
    if x0 + width > full.shape[1] or y0 + SKY_BOTTOM > full.shape[0]:
        raise ValueError("mountain photo is too small for this zoom/origin")
    window = (slice(y0, y0 + height), slice(x0, x0 + width))
    pixels, window_matte, window_sky = full[window], matte[window], sky[window]
    missing = ((0, height - pixels.shape[0]), (0, 0))
    return (
        np.pad(pixels, (*missing, (0, 0)), mode="edge"),
        np.pad(window_matte, missing, mode="edge"),
        np.pad(window_sky, (*missing, (0, 0)), mode="edge"),
    )


def _backdrop(photo: np.ndarray) -> np.ndarray:
    """Our sky with the mountains on it. Shifting each pixel by (our sky - their sky) swaps the sky exactly
    and lets the hazy peak edges blend, with no pale halo."""
    height, width = photo.shape[:2]
    sky = np.broadcast_to(_sky_gradient(photo), (height, width, 3))
    mountains, matte, their_sky = _mountain_layer(width, height)
    sky_weight = 1 - matte[..., None]
    # Where a pixel is pure sky, trust the pixel over the estimate: its own sky variation cancels and it becomes
    # exactly our sky. On mountains the weight is 0 and nothing changes.
    their_sky = their_sky + sky_weight**2 * (mountains - their_sky)
    return mountains + sky_weight * (sky - their_sky)


def replace_sky(photo: np.ndarray) -> np.ndarray:
    """photo: float32 RGB 0..1. Returns it with the sky and water tower swapped for mountains."""
    alpha = sky_alpha(photo)[..., None]
    return (photo * (1 - alpha) + _backdrop(photo) * alpha).astype(np.float32)  # float32: OpenCV downstream rejects float64
