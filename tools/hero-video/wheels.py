"""Spinning the real wheels: rotate the photographed rim (and hub) inside its ellipse."""
import cv2
import numpy as np

from geometry import CX, CY, F, LATERAL

# Rim ellipses measured on the zoomed crops: centre (x, y), semi-axis across the axle (am), semi-axis
# up the wheel (aM). The front wheel also has a hub (lug nuts) that sits closer to the camera, so it
# gets its own centre; rotating both about one point would make the nuts wobble.
WHEELS = [
    {"name": "front", "rim": ((750.0, 892.0), 74.0, 95.0), "hub": ((770.0, 891.0), 46.0, 58.0)},
    {"name": "drive A", "rim": ((1411.0, 727.0), 21.0, 52.0)},
    {"name": "drive B", "rim": ((1488.0, 708.0), 15.0, 44.0)},
    {"name": "trailer A", "rim": ((1802.0, 648.0), 10.0, 38.5)},
    {"name": "trailer B", "rim": ((1825.0, 641.0), 10.0, 38.0)},
]

# The axle runs along the lateral direction, so the ellipse's short axis points at that vanishing point.
_VP_LATERAL = (CX + F * LATERAL[0] / LATERAL[2], CY + F * LATERAL[1] / LATERAL[2])


def _basis(center: tuple[float, float], am: float, aM: float) -> np.ndarray:
    """2x2 matrix taking the unit circle to the ellipse (columns: short axis, long axis)."""
    to_vp = np.array([_VP_LATERAL[0] - center[0], _VP_LATERAL[1] - center[1]])
    short = to_vp / np.linalg.norm(to_vp)
    long = np.array([-short[1], short[0]])
    return np.column_stack([short * am, long * aM])


def spin_ellipse(image: np.ndarray, center: tuple[float, float], am: float, aM: float, degrees: float, feather: float = 0.07) -> tuple[np.ndarray, np.ndarray, tuple[int, int, int, int]]:
    """Rotate the picture content inside an ellipse by `degrees` (about its own centre).

    Returns (patch, alpha, (x0, y0, x1, y1)): paste `patch` over the original with `alpha` inside the box.
    """
    basis = _basis(center, am, aM)
    angle = np.radians(degrees)
    rotation = np.array([[np.cos(angle), -np.sin(angle)], [np.sin(angle), np.cos(angle)]])
    linear = basis @ rotation @ np.linalg.inv(basis)  # destination offset -> source offset

    pad = int(max(am, aM)) + 4
    x0, y0 = int(center[0]) - pad, int(center[1]) - pad
    x1, y1 = int(center[0]) + pad + 1, int(center[1]) + pad + 1
    local_center = np.array([center[0] - x0, center[1] - y0])
    matrix = np.hstack([linear, (local_center - linear @ local_center)[:, None]]).astype(np.float32)
    roi = np.ascontiguousarray(image[y0:y1, x0:x1])
    patch = cv2.warpAffine(roi, matrix, (x1 - x0, y1 - y0), flags=cv2.INTER_CUBIC | cv2.WARP_INVERSE_MAP, borderMode=cv2.BORDER_REFLECT)

    yy, xx = np.mgrid[0 : y1 - y0, 0 : x1 - x0].astype(np.float32)
    offset = np.stack([xx - local_center[0], yy - local_center[1]], axis=-1)
    unit = offset @ np.linalg.inv(basis).T
    radius = np.hypot(unit[..., 0], unit[..., 1])
    alpha = np.clip((1.0 - radius) / feather, 0.0, 1.0).astype(np.float32)
    return patch, alpha, (x0, y0, x1, y1)


def paste(canvas: np.ndarray, patch: np.ndarray, alpha: np.ndarray, box: tuple[int, int, int, int], y_offset: int = 0) -> None:
    """Blend a wheel patch onto `canvas`, whose first row is row `y_offset` of the full photo."""
    x0, y0, x1, y1 = box[0], box[1] - y_offset, box[2], box[3] - y_offset
    region = canvas[y0:y1, x0:x1]
    canvas[y0:y1, x0:x1] = region * (1 - alpha[..., None]) + patch * alpha[..., None]


def wheel_patches(photo: np.ndarray, degrees_samples: list[float]) -> list[tuple[np.ndarray, np.ndarray, tuple[int, int, int, int]]]:
    """Every wheel (rim and hub) turned through each angle in `degrees_samples`, averaged: that average is
    the motion blur of a wheel spinning while the shutter is open."""
    patches = []
    for wheel in WHEELS:
        for ellipse in (wheel["rim"], wheel.get("hub")):
            if ellipse is None:
                continue
            center, am, aM = ellipse
            turned = [spin_ellipse(photo, center, am, aM, degrees) for degrees in degrees_samples]
            patches.append((np.mean([t[0] for t in turned], axis=0), turned[0][1], turned[0][2]))
    return patches
