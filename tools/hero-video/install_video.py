"""Copy the rendered video into the site and make its poster frame, after checking the loop is seamless.

Run (after render.py has written hero.mp4 and --still 0 180 has written two PNGs):
  uv run --with numpy --with pillow python install_video.py
"""
import pathlib
import shutil

import numpy as np
from PIL import Image

from common import WORK

SITE = pathlib.Path(__file__).resolve().parents[2] / "public"


def main() -> None:
    first = np.asarray(Image.open(WORK / "still_000.png"), dtype=np.float32)
    after_loop = np.asarray(Image.open(WORK / "still_180.png"), dtype=np.float32)
    print(f"frame 180 vs frame 0, mean difference: {np.abs(first - after_loop).mean():.4f} / 255 (0 = seamless loop)")

    (SITE / "video").mkdir(exist_ok=True)
    shutil.copyfile(WORK / "hero.mp4", SITE / "video" / "hero.mp4")
    Image.open(WORK / "still_000.png").save(SITE / "images" / "hero-poster.webp", "WEBP", quality=82)
    print("installed:", SITE / "video" / "hero.mp4", "and", SITE / "images" / "hero-poster.webp")


if __name__ == "__main__":
    main()
