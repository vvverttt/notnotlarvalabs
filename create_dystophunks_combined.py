from PIL import Image
import os
import random

def create_dystophunks_combined_background():
    # Create a new background image
    width = 1920
    height = 480
    background_color = (195, 255, 0)  # #c3ff00 lime green
    
    # Create the background
    background = Image.new('RGBA', (width, height), background_color + (255,))
    
    # Grid settings
    grid_cols = 50
    grid_rows = 6
    cell_width = width // grid_cols
    cell_height = height // grid_rows
    
    # Get all image files from both folders
    dystopunks_folder = '../mainscriberv2/dystopunks_images'
    transparent_folder = 'dysto_phunks_transparent'
    
    all_images = []
    
    # Add flipped dystopunks images
    if os.path.exists(dystopunks_folder):
        for filename in os.listdir(dystopunks_folder):
            if filename.lower().endswith(('.png', '.jpg', '.jpeg')):
                all_images.append(('flipped', os.path.join(dystopunks_folder, filename)))
    
    # Add transparent images
    if os.path.exists(transparent_folder):
        for filename in os.listdir(transparent_folder):
            if filename.lower().endswith(('.png', '.jpg', '.jpeg')):
                all_images.append(('transparent', os.path.join(transparent_folder, filename)))
    
    print(f"Found {len([img for img in all_images if img[0] == 'flipped'])} flipped images and {len([img for img in all_images if img[0] == 'transparent'])} transparent images")
    
    # Shuffle the images for variety
    random.shuffle(all_images)
    
    # Calculate total grid positions
    total_positions = grid_cols * grid_rows
    print(f"Total grid positions: {total_positions}")
    
    # Place images in grid - ensure every position is filled
    image_index = 0
    total_placed = 0
    
    for row in range(grid_rows):
        for col in range(grid_cols):
            # Always place an image - cycle through the available images
            img_type, img_path = all_images[image_index % len(all_images)]
            
            try:
                # Load and process image
                img = Image.open(img_path).convert('RGBA')
                
                # Resize image to fit cell (make it 75% of cell size)
                target_size = int(min(cell_width, cell_height) * 0.75)
                img = img.resize((target_size, target_size), Image.Resampling.LANCZOS)
                
                # Flip the image horizontally if it's from dystopunks_images
                if img_type == 'flipped':
                    img = img.transpose(Image.Transpose.FLIP_LEFT_RIGHT)
                
                # Calculate position
                x = col * cell_width + (cell_width - target_size) // 2
                y = row * cell_height + (cell_height - target_size) // 2
                
                # Paste the image onto the background
                background.paste(img, (x, y), img)
                
                total_placed += 1
                image_index += 1
                
            except Exception as e:
                print(f"Error processing {img_path}: {e}")
                image_index += 1
                continue
    
    # Save the combined background
    output_path = 'images/dystophunks-combined-new.png'
    background.save(output_path, 'PNG')
    print(f"Created {output_path} with {total_placed} combined phunks (flipped + transparent) - no gaps!")

if __name__ == "__main__":
    create_dystophunks_combined_background() 