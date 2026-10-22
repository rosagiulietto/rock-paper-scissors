import glob
import os
from PIL import Image

# Find all folders matching the pattern "reward_*"
reward_folders = glob.glob("reward_*")

for folder in reward_folders:
    # Look for common image formats inside the reward folder
    image_files = []
    for ext in ("*.jpg", "*.jpeg", "*.png", "*.JPG", "*.PNG"):
        image_files.extend(glob.glob(os.path.join(folder, ext)))

    if not image_files:
        print(f"No images found in {folder}")
        continue

    # Process each image found in the folder
    for img_path in image_files:
        print(f"Processing image: {img_path}")
        img = Image.open(img_path)

        width, height = img.size
        piece_height = height // 5

        # Cut the image horizontally into 5 pieces
        for i in range(5):
            left = 0
            top = i * piece_height
            right = width
            bottom = height if i == 4 else (i + 1) * piece_height

            # Crop the piece
            piece = img.crop((left, top, right, bottom))

            # Save the piece inside the same reward folder as image_1.png, image_2.png, etc.
            filename = os.path.join(folder, f"image_{i + 1}.png")
            piece.save(filename)
            print(f"  -> Saved: {filename}")
