"""Zoomed, finely gridded crops for hand-tracing the truck outline.

Run:  uv run --with pillow python tools/hero-video/trace_crops.py
"""
from PIL import Image, ImageDraw

from common import WORK, load_source

# name: (left, top, right, bottom, scale)
CROPS = {
    "trace_mudflap": (1430, 540, 1650, 760, 4.2),
    "trace_trailer_rear": (1690, 560, 1900, 760, 4.4),
    "trace_tank_left": (1270, 230, 1590, 430, 3.0),
    "trace_tank_right": (1560, 280, 1900, 480, 2.8),
}


def main() -> None:
    photo = load_source()
    for name, (left, top, right, bottom, scale) in CROPS.items():
        crop = photo.crop((left, top, right, bottom))
        crop = crop.resize((round(crop.width * scale), round(crop.height * scale)), Image.LANCZOS)
        draw = ImageDraw.Draw(crop)
        step = 10
        for x in range((left // step + 1) * step, right, step):
            major = x % 50 == 0
            draw.line([((x - left) * scale, 0), ((x - left) * scale, crop.height)], fill=(255, 255, 0) if major else (120, 120, 0), width=1)
            if major:
                draw.text(((x - left) * scale + 3, 3), str(x), fill=(255, 255, 0))
        for y in range((top // step + 1) * step, bottom, step):
            major = y % 50 == 0
            draw.line([(0, (y - top) * scale), (crop.width, (y - top) * scale)], fill=(0, 255, 255) if major else (0, 120, 120), width=1)
            if major:
                draw.text((3, (y - top) * scale + 3), str(y), fill=(0, 255, 255))
        crop.save(WORK / f"{name}.png")
        print("saved", name, crop.size)


if __name__ == "__main__":
    main()
