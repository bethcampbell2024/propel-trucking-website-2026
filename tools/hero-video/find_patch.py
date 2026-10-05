"""Find where a (a x l) metre patch of clean ground fits entirely inside a safe pixel box.

Run:  uv run --with numpy python find_patch.py
"""
import numpy as np

from geometry import ground_coords, ground_to_pixel

# Clean, sunlit asphalt: right of the front wheel's shadow, below the truck, away from the right-hand cracks.
SAFE = (960, 880, 1700, 1420)  # left, top, right, bottom (pixels)


def fits(centre_pixel, size_a, size_l) -> tuple[bool, list]:
    a, l = (float(v) for v in ground_coords(np.array(float(centre_pixel[0])), np.array(float(centre_pixel[1]))))
    corners = []
    for da in (-size_a / 2, size_a / 2):
        for dl in (-size_l / 2, size_l / 2):
            u, v = ground_to_pixel(np.array(a + da), np.array(l + dl))
            corners.append((float(u), float(v)))
    ok = all(SAFE[0] <= u <= SAFE[2] and SAFE[1] <= v <= SAFE[3] for u, v in corners)
    return ok, corners


def main() -> None:
    for size_a, size_l in [(3.05, 1.0), (3.05, 0.8), (3.05, 0.6), (1.525, 1.0)]:
        best = None
        for cu in range(1000, 1700, 20):
            for cv in range(900, 1400, 20):
                ok, corners = fits((cu, cv), size_a, size_l)
                if ok:
                    best = (cu, cv, corners)  # keep the last (lowest / right-most) fit
        print(f"{size_a} x {size_l} m ->", "no fit" if best is None else f"centre {best[:2]}, corners {[(round(u), round(v)) for u, v in best[2]]}")


if __name__ == "__main__":
    main()
