"""Draw the cutout's edge (red) and an optional hand-traced polygon (green) on the photo, zoomed and gridded.

Run:  uv run --with pillow --with numpy python tools/hero-video/mask_overlay.py
"""
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

from common import WORK, load_source

CUTOUT = WORK / "cutout_isnet-general-use.png"
REGIONS = {
    "ov_front": (0, 820, 1000, 1120),
    "ov_right": (1240, 520, 1920, 840),
}


def edge_of(alpha: Image.Image) -> np.ndarray:
    solid = alpha.point(lambda v: 255 if v > 128 else 0)
    inner = solid.filter(ImageFilter.MinFilter(3))
    return (np.asarray(solid, dtype=np.int16) - np.asarray(inner, dtype=np.int16)) > 0


def main() -> None:
    photo = load_source()
    edge = edge_of(Image.open(CUTOUT).getchannel("A"))
    pixels = np.asarray(photo).copy()
    pixels[edge] = (255, 0, 0)
    marked = Image.fromarray(pixels)
    for name, box in REGIONS.items():
        scale = 1.5 if name == "ov_front" else 1.8
        crop = marked.crop(box)
        crop = crop.resize((round(crop.width * scale), round(crop.height * scale)), Image.NEAREST)
        draw = ImageDraw.Draw(crop)
        step = 50
        for x in range((box[0] // step + 1) * step, box[2], step):
            draw.line([((x - box[0]) * scale, 0), ((x - box[0]) * scale, crop.height)], fill=(255, 255, 0))
            draw.text(((x - box[0]) * scale + 3, 3), str(x), fill=(255, 255, 0))
        for y in range((box[1] // step + 1) * step, box[3], step):
            draw.line([(0, (y - box[1]) * scale), (crop.width, (y - box[1]) * scale)], fill=(0, 255, 255))
            draw.text((3, (y - box[1]) * scale + 3), str(y), fill=(0, 255, 255))
        crop.save(WORK / f"{name}.png")
        print("saved", name)


if __name__ == "__main__":
    main()
