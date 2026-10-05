"""Render the hero video: the real truck, wheels turning, on a road that streams past.

Needs: numpy, opencv-python-headless, pillow, imageio-ffmpeg (and cutout.py run once first).

  Still frame:  uv run --python 3.12 --with numpy --with opencv-python-headless --with pillow --with imageio-ffmpeg python render.py --still 20
  Full video:   uv run --python 3.12 --with numpy --with opencv-python-headless --with pillow --with imageio-ffmpeg python render.py
"""
import argparse
import time

import cv2
import numpy as np

from backdrop import replace_sky
from common import WORK, load_source
from ground import DASH_PERIOD, Ground
from masks import build_masks
from wheels import paste, wheel_patches

FPS = 30
LOOP_SECONDS = 6
FRAMES = FPS * LOOP_SECONDS
SPEED = DASH_PERIOD * 12 / LOOP_SECONDS  # 24.4 m/s (55 mph): a whole number of dash periods per loop, so it loops cleanly
SHUTTER = 0.5  # fraction of each frame the "camera" is exposed; sets how much the road streaks
GROUND_SAMPLES = 6
# Wheels: 78 degrees per frame is 39 whole turns per loop (seamless). It is 6 degrees past two hole pitches
# (36 deg each), which the eye reads as a steady forward spin instead of a flicker.
WHEEL_STEP = 78.0
WHEEL_BLUR = 18.0  # degrees the wheel turns while the shutter is open (about half a hole pitch)
WHEEL_SAMPLES = 9
Y0, OUT_H = 40, 1080  # which rows of the 1920x1440 photo make up the 1920x1080 video
GROUND_Y0 = 560  # no road exists above this row of the photo, so none is computed there


def camera_shake(frame: np.ndarray, index: int) -> np.ndarray:
    """A touch of car vibration. Whole numbers of cycles per loop, so the loop stays seamless."""
    t = index / FRAMES
    dx = 0.9 * np.sin(2 * np.pi * 5 * t) + 0.5 * np.sin(2 * np.pi * 13 * t + 1.0)
    dy = 1.1 * np.sin(2 * np.pi * 7 * t + 0.5) + 0.6 * np.sin(2 * np.pi * 31 * t)
    matrix = np.float32([[1, 0, dx], [0, 1, dy]])
    return cv2.warpAffine(frame, matrix, (frame.shape[1], frame.shape[0]), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT)


class Scene:
    def __init__(self) -> None:
        self.photo = replace_sky(np.asarray(load_source(), np.float32) / 255.0)
        height, width = self.photo.shape[:2]
        _, ground_alpha = build_masks(width, height)
        self.ground_alpha = ground_alpha[GROUND_Y0 : Y0 + OUT_H, :, None]
        self.ground = Ground(self.photo, ground_alpha, GROUND_Y0, Y0 + OUT_H)

    def frame(self, index: int) -> np.ndarray:
        """One finished frame as uint8 RGB."""
        base = self.photo[Y0 : Y0 + OUT_H].copy()
        spread = np.linspace(-WHEEL_BLUR / 2, WHEEL_BLUR / 2, WHEEL_SAMPLES)
        for patch, alpha, box in wheel_patches(self.photo, list(WHEEL_STEP * index + spread)):
            paste(base, patch, alpha, box, y_offset=Y0)

        scroll = SPEED * index / FPS
        streak = np.linspace(-0.5, 0.5, GROUND_SAMPLES) * SHUTTER * SPEED / FPS
        road = np.mean([self.ground.render(scroll + offset) for offset in streak], axis=0)

        top = GROUND_Y0 - Y0  # first video row that can contain road
        base[top:] = base[top:] * (1 - self.ground_alpha) + road * self.ground_alpha
        base = camera_shake(base, index)
        return (np.clip(base, 0, 1) * 255 + 0.5).astype(np.uint8)


def write_video(scene: Scene, path: str, crf: int) -> None:
    import imageio_ffmpeg

    writer = imageio_ffmpeg.write_frames(
        path,
        size=(scene.photo.shape[1], OUT_H),
        fps=FPS,
        codec="libx264",
        quality=None,
        output_params=["-crf", str(crf), "-preset", "slow", "-pix_fmt", "yuv420p", "-movflags", "+faststart"],
        macro_block_size=None,
    )
    writer.send(None)
    started = time.time()
    for index in range(FRAMES):
        writer.send(np.ascontiguousarray(scene.frame(index)).tobytes())
        if index % 15 == 0:
            print(f"frame {index}/{FRAMES}  ({time.time() - started:.0f}s)", flush=True)
    writer.close()


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--still", type=int, nargs="*", help="render these frame numbers as PNGs and stop")
    parser.add_argument("--out", default=str(WORK / "hero.mp4"))
    parser.add_argument("--crf", type=int, default=26)
    args = parser.parse_args()

    started = time.time()
    scene = Scene()
    print(f"scene ready in {time.time() - started:.1f}s; texture patch corners (px): {scene.ground.patch_corners}")
    if args.still is not None:
        cv2.imwrite(str(WORK / "texture_tile.png"), np.clip(scene.ground.tile * 127, 0, 255).astype(np.uint8))
        for index in args.still:
            tick = time.time()
            frame = scene.frame(index)
            cv2.imwrite(str(WORK / f"still_{index:03d}.png"), frame[..., ::-1])
            print(f"frame {index} rendered in {time.time() - tick:.1f}s")
        return
    write_video(scene, args.out, args.crf)
    print("wrote", args.out)


if __name__ == "__main__":
    main()
