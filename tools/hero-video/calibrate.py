"""Sanity-check the recovered camera against things we know about a real truck.

Run:  uv run --with numpy python tools/hero-video/calibrate.py
Checks: (1) every same-side tyre should sit at the same lateral position (they're on one straight line),
(2) the steer-axle to drive-axle distance of a day-cab/sleeper tractor is roughly 5.5 - 6.5 m.
"""
import numpy as np

from geometry import ground_coords

# Where each tyre touches the ground, read off the zoomed grid crops (working-image pixels).
CONTACTS = {
    "front steer": (705, 1048),
    "drive A": (1400, 809),
    "drive B": (1477, 782),
    "trailer wheel A": (1797, 689),
    "trailer wheel B": (1822, 679),
}


def main() -> None:
    rows = {name: ground_coords(np.array(u, dtype=float), np.array(v, dtype=float)) for name, (u, v) in CONTACTS.items()}
    print(f"{'wheel':16s} {'along (m)':>10s} {'across (m)':>11s}")
    for name, (a, l) in rows.items():
        print(f"{name:16s} {float(a):10.2f} {float(l):11.2f}")
    a_front = float(rows["front steer"][0])
    a_drive = float(rows["drive A"][0])
    print(f"\nsteer-to-drive distance: {a_drive - a_front:.2f} m   (expect ~5.5 - 6.5)")
    lateral = np.array([float(l) for _, l in rows.values()])
    print(f"lateral spread of same-side tyres: {lateral.max() - lateral.min():.2f} m   (expect < ~0.4)")


if __name__ == "__main__":
    main()
