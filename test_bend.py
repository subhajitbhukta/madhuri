import cv2
import numpy as np

# Load b4.png
b4 = cv2.imread('b4.png')

# Extract vertical cylinder from b4 (right column)
# In b4, the right column is roughly x=200 to 290, y=100 to 400
tube_sample = b4[120:380, 205:285] # 260px tall, 80px wide
cv2.imwrite('tube_sample.png', tube_sample)

# Now bend it along a circular arc for the belly of 5
# Output image 400x400
out_h, out_w = 400, 400
belly_canvas = np.zeros((out_h, out_w, 3), dtype=np.uint8)

# Center of belly circle
cx, cy = 190, 200
R_inner = 55
R_outer = R_inner + 80  # tube width = 80
R_mid = (R_inner + R_outer) / 2

# Angle range: from -140 degrees (top left of belly) to +130 degrees (bottom left of belly)
# Total angle span = 270 degrees = 1.5 * pi
theta_start = -np.pi * 0.75
theta_end = np.pi * 0.75
total_theta = theta_end - theta_start

map_x = np.full((out_h, out_w), -1.0, dtype=np.float32)
map_y = np.full((out_h, out_w), -1.0, dtype=np.float32)
mask = np.zeros((out_h, out_w), dtype=np.uint8)

for y in range(out_h):
    for x in range(out_w):
        dx = x - cx
        dy = y - cy
        dist = np.sqrt(dx*dx + dy*dy)
        if R_inner <= dist <= R_outer:
            angle = np.arctan2(dy, dx)
            # Normalize angle so that rightward is 0, upward is -pi/2, downward is +pi/2
            if theta_start <= angle <= theta_end:
                # Tube u (horizontal across tube): 0 is inner edge, 80 is outer edge
                u = (dist - R_inner) / (R_outer - R_inner) * (tube_sample.shape[1] - 1)
                # Tube v (along tube): length
                v_frac = (angle - theta_start) / total_theta
                v = v_frac * (tube_sample.shape[0] - 1)
                
                map_x[y, x] = u
                map_y[y, x] = v
                mask[y, x] = 255

bent_tube = cv2.remap(tube_sample, map_x, map_y, cv2.INTER_LINEAR, borderMode=cv2.BORDER_CONSTANT, borderValue=(0,0,0))
cv2.imwrite('bent_belly.png', bent_tube)
cv2.imwrite('bent_mask.png', mask)
print('Done bending tube!')
