"""Make zoomed crops of the working image with a labelled pixel grid, for measuring by eye.

Run:  uv run --with pillow python tools/hero-video/inspect_photo.py
"""
from PIL import Image, ImageDraw

from common import WORK, load_source

# name: (left, top, right, bottom) in working-image pixels (1920 wide)
REGIONS = {
    "overview": (0, 0, 1920, 1440),
    "front_wheel": (560, 700, 960, 1100),
    "trailer_wheels": (1250, 600, 1650, 850),
    "horizon_left": (0, 400, 700, 800),
    "horizon_right": (1200, 450, 1920, 800),
}


def gridded(image: Image.Image, box: tuple[int, int, int, int], step: int, scale: float) -> Image.Image:
    crop = image.crop(box)
    crop = crop.resize((round(crop.width * scale), round(crop.height * scale)), Image.LANCZOS)
    draw = ImageDraw.Draw(crop)
    left, top, right, bottom = box
    for x in range((left // step + 1) * step, right, step):
        px = (x - left) * scale
        draw.line([(px, 0), (px, crop.height)], fill=(255, 255, 0), width=1)
        draw.text((px + 3, 3), str(x), fill=(255, 255, 0))
    for y in range((top // step + 1) * step, bottom, step):
        py = (y - top) * scale
        draw.line([(0, py), (crop.width, py)], fill=(0, 255, 255), width=1)
        draw.text((3, py + 3), str(y), fill=(0, 255, 255))
    return crop


def main() -> None:
    WORK.mkdir(parents=True, exist_ok=True)
    image = load_source()
    for name, box in REGIONS.items():
        big = name == "overview"
        gridded(image, box, step=100 if big else 25, scale=0.5 if big else 2.2).save(WORK / f"inspect_{name}.png")
        print("saved", name)


if __name__ == "__main__":
    main()
