"""Cut full-resolution crops out of a rendered still, to hunt for edge artefacts.

Run:  uv run --with pillow python crop_still.py 20
"""
import sys

from PIL import Image

from common import WORK

Y0 = 40  # the video starts at this row of the working image
CROPS = {  # name: (left, top, right, bottom) in working-image coordinates
    "front_wheel": (520, 760, 1000, 1110),
    "drive_wheels": (1300, 560, 1640, 840),
    "trailer_rear": (1560, 560, 1920, 800),
    "sky_tank": (1280, 150, 1920, 560),
    "sky_left": (0, 250, 700, 560),
}


def main() -> None:
    index = int(sys.argv[1]) if len(sys.argv) > 1 else 20
    frame = Image.open(WORK / f"still_{index:03d}.png")
    for name, (left, top, right, bottom) in CROPS.items():
        crop = frame.crop((left, top - Y0, right, bottom - Y0))
        crop = crop.resize((round(crop.width * 2), round(crop.height * 2)), Image.LANCZOS)
        crop.save(WORK / f"crop_{index:03d}_{name}.png")
        print("saved", name)


if __name__ == "__main__":
    main()
