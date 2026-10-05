"""Shared paths and the source photo for the hero-video pipeline."""
import pathlib

from PIL import Image, ImageOps

SOURCE_PHOTO = pathlib.Path(r"C:\Users\mdc\Downloads\IMG_9337.JPG")
# Mountain backdrop: photo by Caleb Jack on Unsplash (free to use).
MOUNTAIN_PHOTO = pathlib.Path(r"C:\Users\mdc\Downloads\caleb-jack-B4dl7NX7VP8-unsplash.jpg")
WORK = pathlib.Path(r"C:\Users\mdc\dev\tools\herovideo-work")  # intermediates, not committed
WIDTH = 1920  # working width; the photo is 4:3 so the height is 1440


def load_source() -> Image.Image:
    """The original photo, upright, resized to the working width."""
    image = ImageOps.exif_transpose(Image.open(SOURCE_PHOTO)).convert("RGB")
    height = round(image.height * WIDTH / image.width)
    return image.resize((WIDTH, height), Image.LANCZOS)
