"""Camera geometry of the source photo, recovered from measurements.

Working-image pixels (1920 x 1440). The photo is an iPhone main-camera shot (26 mm equivalent).
Image y grows downward; camera frame is x right, y down, z forward.
"""
import numpy as np

F = 1920 * 26 / 36  # focal length in pixels
CX, CY = 960.0, 720.0  # principal point
HORIZON_Y = 544.0  # solved from tyre sizes at three distances (see calibrate.py)
VP_HEADING = (2179.0, 544.0)  # where lines parallel to the truck's travel direction converge
CAM_HEIGHT = 1.65  # metres, from the same tyre-size fit


def _unit(v: np.ndarray) -> np.ndarray:
    return v / np.linalg.norm(v)


def _ray(u, v):
    """Camera-frame direction through pixel(s) (u, v)."""
    return np.stack([(np.asarray(u) - CX) / F, (np.asarray(v) - CY) / F, np.ones_like(np.asarray(u, dtype=float))], axis=-1)


# Ground normal (pointing down at the ground) follows from the horizon line.
NORMAL = _unit(np.array([0.0, F, CY - HORIZON_Y]))
HEADING = _unit(_ray(*VP_HEADING))  # unit vector along the road, pointing away from the camera
LATERAL = _unit(np.cross(NORMAL, HEADING))
if LATERAL[0] < 0:  # make "lateral" increase toward the right of the image
    LATERAL = -LATERAL


def ground_coords(u, v):
    """Pixel(s) -> (a, l) metres on the ground: a along the heading, l across it. NaN above the horizon."""
    ray = _ray(u, v)
    denom = ray @ NORMAL
    with np.errstate(divide="ignore", invalid="ignore"):
        point = ray * (CAM_HEIGHT / denom)[..., None]
    a = point @ HEADING
    l = point @ LATERAL
    below = denom > 1e-6
    return np.where(below, a, np.nan), np.where(below, l, np.nan)


def ground_to_pixel(a, l):
    """(a, l) metres on the ground -> pixel (u, v). Inverse of ground_coords."""
    point = np.asarray(a)[..., None] * HEADING + np.asarray(l)[..., None] * LATERAL + CAM_HEIGHT * NORMAL
    return CX + F * point[..., 0] / point[..., 2], CY + F * point[..., 1] / point[..., 2]
