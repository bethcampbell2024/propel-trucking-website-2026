"""Which pixels are truck, and which are ground we may replace with moving road."""
import cv2
import numpy as np
from PIL import Image

from common import WORK

CUTOUT = WORK / "cutout_isnet-general-use.png"

# The cutout model sees the mirror-polished tank as sky, so the trailer's lower part is traced by hand
# from the zoomed grid crops (working-image pixels). Only the lower silhouette matters: everywhere
# else the original photo pixels are kept as they are.
TRAILER_POLY = [
    (1500, 540), (1842, 540), (1842, 595), (1841, 662), (1824, 681), (1805, 689), (1797, 689),
    (1760, 690), (1738, 688), (1738, 684), (1583, 684), (1583, 720), (1518, 720), (1500, 722),
]

# The far edge of the paved lot: ground only exists below this line (x, y). Step changes are deliberate.
FAR_EDGE = [(0, 765), (130, 765), (131, 560), (1239, 560), (1240, 700), (1500, 700), (1501, 684), (1842, 684), (1843, 620), (1920, 620)]


def build_masks(width: int, height: int) -> tuple[np.ndarray, np.ndarray]:
    """Returns (truck, ground) as float32 0..1 arrays at working size. `ground` is feathered."""
    alpha = np.asarray(Image.open(CUTOUT).getchannel("A"), dtype=np.float32) / 255.0
    truck = (alpha > 0.6).astype(np.uint8)
    traced = np.zeros((height, width), np.uint8)
    cv2.fillPoly(traced, [np.array(TRAILER_POLY, np.int32)], 1)
    truck = np.maximum(truck, traced)
    truck = cv2.morphologyEx(truck, cv2.MORPH_CLOSE, np.ones((5, 5), np.uint8))

    xs = np.arange(width)
    far_y = np.interp(xs, [p[0] for p in FAR_EDGE], [p[1] for p in FAR_EDGE])
    rows = np.arange(height)[:, None]
    in_lot = rows >= far_y[None, :]
    ground = (in_lot & (truck == 0)).astype(np.float32)
    ground = cv2.GaussianBlur(ground, (0, 0), 1.0)
    return truck.astype(np.float32), ground
