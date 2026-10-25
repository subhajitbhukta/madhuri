import os
import cv2
import numpy as np

DIR = os.path.dirname(os.path.abspath(__file__))
cake_path = os.path.join(DIR, 'cake-24.jpg')
cake = cv2.imread(cake_path)
if cake is None:
    raise FileNotFoundError(f"Cannot load {cake_path}")

H, W, _ = cake.shape # 1024, 1024

# 1. Clean the background where balloon 4 is located (x: 660 to 1010, y: 140 to 650)
# Notice the background is a smooth pastel peach-pink wall and a soft table boundary around y=610.
# We can smoothly inpaint the wall using column/row gradient interpolation from the clean surrounding regions:
# Left clean margin: x in [620, 650] (between cake and balloon 4)
# Right clean margin: x in [995, 1023] (right of balloon 4)
# Top clean margin: y in [130, 150]
clean_bg = cake.copy()

# Background inpainting in region y: [130, 620], x: [650, 1015]
# Bilinear interpolation between left margin (x=645) and right margin (x=1015)
x_left = 645
x_right = 1015
y_top = 135
y_bot = 605

left_strip = cake[y_top:y_bot, x_left:x_left+1].astype(np.float32)
right_strip = cake[y_top:y_bot, x_right:x_right+1].astype(np.float32)
width = x_right - x_left

alpha_x = np.linspace(0, 1, width, endpoint=True).reshape(1, width, 1).astype(np.float32)
interp_wall = (1 - alpha_x) * left_strip + alpha_x * right_strip

# Subtle noise to match photographic film grain
np.random.seed(42)
noise = np.random.normal(0, 1.2, interp_wall.shape).astype(np.float32)
interp_wall = np.clip(interp_wall + noise, 0, 255).astype(np.uint8)

# Feather the edges so there is zero hard seam
clean_bg[y_top:y_bot, x_left:x_right] = interp_wall

# 2. Extract balloon 2 from cake (x: 50 to 380, y: 150 to 680)
b2_crop = cake[150:680, 50:380].copy()
b4_crop = cake[150:680, 660:990].copy()

# Balloon 2 mask via color segmentation in HSV
hsv2 = cv2.cvtColor(b2_crop, cv2.COLOR_BGR2HSV)
# Foil pink/rose gold: Hue 160-180 and 0-25, Sat > 25, Val > 80
mask1 = cv2.inRange(hsv2, np.array([0, 30, 80]), np.array([25, 255, 255]))
mask2 = cv2.inRange(hsv2, np.array([160, 30, 80]), np.array([180, 255, 255]))
b2_mask = cv2.bitwise_or(mask1, mask2)

# Morphological clean
kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
b2_mask = cv2.morphologyEx(b2_mask, cv2.MORPH_CLOSE, kernel)
b2_mask = cv2.morphologyEx(b2_mask, cv2.MORPH_OPEN, kernel)

# Balloon 4 vertical column tube:
# In b4_crop, right vertical column is around x: 195 to 275, y: 60 to 340
tube_src = b4_crop[60:340, 195:275].copy() # 280px tall, 80px wide
th, tw, _ = tube_src.shape

# 3. Construct Balloon 5
# A balloon 5 dimensions: roughly 320px wide, 450px tall (same as balloon 2: 330x530)
b5_canvas = np.zeros((530, 340, 3), dtype=np.uint8)
b5_alpha = np.zeros((530, 340), dtype=np.float32)

# Part A: Top horizontal bar of 5
# In b2_crop, bottom bar is at y: 280 to 380, x: 20 to 260
# When flipped vertically, the flat base becomes the top edge, and rounded tip is at top-right
top_bar_src = b2_crop[290:385, 20:255].copy()
top_bar = cv2.flip(top_bar_src, 0)
tb_h, tb_w, _ = top_bar.shape
# Resize slightly if needed
tb_w_target = 200
top_bar = cv2.resize(top_bar, (tb_w_target, tb_h), interpolation=cv2.INTER_CUBIC)

# Place top bar on b5_canvas at x: 45 to 45+tb_w_target, y: 25 to 25+tb_h
b5_canvas[25:25+tb_h, 45:45+tb_w_target] = top_bar
b5_alpha[25:25+tb_h, 45:45+tb_w_target] = 1.0

# Part B: Left vertical stem of 5
# Drops down from top bar (x: 45 to 115, y: 25+tb_h-15 to 210)
stem_h = 130
stem_w = 72
stem_src = tube_src[20:20+stem_h, 4:4+stem_w].copy()
stem_y_start = 25 + tb_h - 20
b5_canvas[stem_y_start:stem_y_start+stem_h, 45:45+stem_w] = stem_src
b5_alpha[stem_y_start:stem_y_start+stem_h, 45:45+stem_w] = 1.0

# Part C: The rounded belly of 5
# Bending tube along a smooth arc
# Center of arc:
arc_cx = 125
arc_cy = stem_y_start + stem_h + 30 # roughly y = 295
R_inner = 42
R_outer = R_inner + 76 # width 76
R_mid = (R_inner + R_outer) / 2

# Belly spans from theta = -135 deg (-3pi/4) up around right side (+0 deg) to bottom sweep (+135 deg, 3pi/4)
theta_start = -np.pi * 0.72
theta_end = np.pi * 0.78
total_theta = theta_end - theta_start

belly_patch = np.zeros((530, 340, 3), dtype=np.uint8)
belly_mask = np.zeros((530, 340), dtype=np.float32)

map_x = np.full((530, 340), -1.0, dtype=np.float32)
map_y = np.full((530, 340), -1.0, dtype=np.float32)

for y in range(530):
    for x in range(340):
        dx = x - arc_cx
        dy = y - arc_cy
        dist = np.sqrt(dx*dx + dy*dy)
        if R_inner <= dist <= R_outer:
            angle = np.arctan2(dy, dx)
            if theta_start <= angle <= theta_end:
                u = (dist - R_inner) / (R_outer - R_inner) * (tw - 1)
                v = (angle - theta_start) / total_theta * (th - 1)
                map_x[y, x] = u
                map_y[y, x] = v
                belly_mask[y, x] = 1.0

bent = cv2.remap(tube_src, map_x, map_y, cv2.INTER_LINEAR, borderMode=cv2.BORDER_CONSTANT, borderValue=(0,0,0))

# Blend belly into b5
for y in range(530):
    for x in range(340):
        if belly_mask[y, x] > 0:
            b5_canvas[y, x] = bent[y, x]
            b5_alpha[y, x] = 1.0

# Part D: Bottom terminal end cap
# Rounded tip from b2_crop (top left hook end, around x: 25 to 90, y: 40 to 110)
tip_src = b2_crop[40:110, 25:90].copy()
tip_h, tip_w, _ = tip_src.shape
# Rotate tip to match bottom left sweep
tip_rot = cv2.rotate(tip_src, cv2.ROTATE_180)
# Place at bottom left of belly (around x: 40, y: 350)
tip_x = 35
tip_y = arc_cy + int(R_mid * np.sin(theta_end)) - 30
b5_canvas[tip_y:tip_y+tip_h, tip_x:tip_x+tip_w] = np.maximum(b5_canvas[tip_y:tip_y+tip_h, tip_x:tip_x+tip_w], tip_rot)
b5_alpha[tip_y:tip_y+tip_h, tip_x:tip_x+tip_w] = 1.0

# Smooth alpha edges
b5_alpha_blur = cv2.GaussianBlur(b5_alpha, (5, 5), 1.2)
b5_alpha_3ch = np.dstack([b5_alpha_blur]*3)

# Extract curling ribbon and bottom tie from b4_crop (y: 370 to 530, x: 190 to 280)
ribbon = b4_crop[360:530, 180:290].copy()
clean_bg[150+360:150+530, 660+180:660+290] = ribbon

# Overlay balloon 5 onto clean_bg at x: 670 to 1010, y: 150 to 680
target_roi = clean_bg[150:680, 670:1010].astype(np.float32)
b5_f = b5_canvas.astype(np.float32)

composite = (b5_f * b5_alpha_3ch + target_roi * (1.0 - b5_alpha_3ch)).astype(np.uint8)
clean_bg[150:680, 670:1010] = composite

out_cake = os.path.join(DIR, 'cake-25.jpg')
cv2.imwrite(out_cake, clean_bg, [cv2.IMWRITE_JPEG_QUALITY, 96])
print(f"Successfully generated {out_cake}!")
