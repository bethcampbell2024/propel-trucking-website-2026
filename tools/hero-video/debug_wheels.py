"""Draw the measured wheel ellipses on the photo so they can be checked by eye.

Run:  uv run --python 3.12 --with numpy --with opencv-python-headless --with pillow python debug_wheels.py
"""
import cv2
import numpy as np

from common import WORK, load_source
from wheels import WHEELS, _VP_LATERAL, _basis


def outline(canvas: np.ndarray, center, am, aM, color) -> None:
    basis = _basis(center, am, aM)
    t = np.linspace(0, 2 * np.pi, 120)
    points = (basis @ np.stack([np.cos(t), np.sin(t)]) + np.array(center)[:, None]).T
    cv2.polylines(canvas, [points.astype(np.int32)], True, color, 1, cv2.LINE_AA)
    cv2.circle(canvas, (int(center[0]), int(center[1])), 2, color, -1)


def main() -> None:
    print("lateral vanishing point:", _VP_LATERAL)
    canvas = np.asarray(load_source()).copy()
    for wheel in WHEELS:
        outline(canvas, *wheel["rim"], (0, 255, 0))
        if "hub" in wheel:
            outline(canvas, *wheel["hub"], (255, 255, 0))
    crops = {"dbg_front": (560, 700, 960, 1100, 2.2), "dbg_drive": (1330, 600, 1560, 830, 3.6), "dbg_trailer": (1740, 580, 1880, 710, 5.0)}
    for name, (x0, y0, x1, y1, scale) in crops.items():
        crop = canvas[y0:y1, x0:x1]
        crop = cv2.resize(crop, None, fx=scale, fy=scale, interpolation=cv2.INTER_CUBIC)
        cv2.imwrite(str(WORK / f"{name}.png"), crop[..., ::-1])
        print("saved", name)


if __name__ == "__main__":
    main()
