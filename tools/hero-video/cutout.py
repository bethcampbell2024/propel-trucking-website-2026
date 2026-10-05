"""Step 1: cut the truck out of the photo (transparent background).

Run:  uv run --python 3.12 --with "rembg[cpu]" --with pillow python tools/hero-video/cutout.py
The first run downloads a segmentation model (~170 MB) into your user folder.
"""
import sys

from PIL import Image

from common import SOURCE_PHOTO, WORK, load_source

MODEL = sys.argv[1] if len(sys.argv) > 1 else "isnet-general-use"


def main() -> None:
    from rembg import new_session, remove  # imported here so `common` stays light

    WORK.mkdir(parents=True, exist_ok=True)
    source = load_source()
    cutout = remove(source, session=new_session(MODEL))
    target = WORK / f"cutout_{MODEL}.png"
    cutout.save(target)
    alpha = cutout.getchannel("A")
    # quick preview: truck over a flat magenta so any missing/leaking edges are obvious
    preview = Image.new("RGB", cutout.size, (255, 0, 255))
    preview.paste(cutout, mask=alpha)
    preview.resize((cutout.width // 2, cutout.height // 2)).save(WORK / f"cutout_{MODEL}_preview.png")
    print("saved", target, "from", SOURCE_PHOTO.name)


if __name__ == "__main__":
    main()
