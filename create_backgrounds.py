from PIL import Image
import os
import random

def create_background_image(image_folder, output_filename, width=1920, height=480, grid_cols=50, grid_rows=6):
    """Create a background image by arranging phunk images in a grid"""
    
    # Get all PNG files from the folder
    image_files = [f for f in os.listdir(image_folder) if f.endswith('.png')]
    
    if not image_files:
        print(f"No PNG files found in {image_folder}")
        return
    
    # Create a new image with the specified dimensions
    background = Image.new('RGBA', (width, height), (195, 255, 0, 255))  # #c3ff00 lime green
    
    # Calculate cell dimensions
    cell_width = width // grid_cols
    cell_height = height // grid_rows
    
    # Shuffle the images for random placement
    random.shuffle(image_files)
    
    # Place images in grid
    image_index = 0
    total_cells = grid_cols * grid_rows
    
    for row in range(grid_rows):
        for col in range(grid_cols):
            # For collections with fewer images, repeat them to fill the grid
            if image_index >= len(image_files):
                image_index = 0  # Reset to start of list
                random.shuffle(image_files)  # Reshuffle for variety
            
            # Load the phunk image
            phunk_path = os.path.join(image_folder, image_files[image_index])
            try:
                phunk_img = Image.open(phunk_path).convert('RGBA')
                
                # Resize to fit cell (maintain aspect ratio)
                phunk_width, phunk_height = phunk_img.size
                scale = min(cell_width / phunk_width, cell_height / phunk_height) * 0.8  # 80% of cell size
                
                new_width = int(phunk_width * scale)
                new_height = int(phunk_height * scale)
                
                phunk_img = phunk_img.resize((new_width, new_height), Image.Resampling.LANCZOS)
                
                # Calculate position to center in cell
                x = col * cell_width + (cell_width - new_width) // 2
                y = row * cell_height + (cell_height - new_height) // 2
                
                # Paste the image
                background.paste(phunk_img, (x, y), phunk_img)
                
                image_index += 1
            except Exception as e:
                print(f"Error processing {phunk_path}: {e}")
                image_index += 1
    
    # Save the background image
    background.save(output_filename, 'PNG')
    print(f"Created {output_filename} with {total_cells} phunks (repeated from {len(image_files)} unique images)")

# Create backgrounds for both collections
if __name__ == "__main__":
    # Create Missing Phunks background
    create_background_image(
        'missing_phunks_transparent',
        'images/missing-phunks-new.png',
        width=1920,
        height=480,
        grid_cols=50,
        grid_rows=6
    )
    
    # Create DystoPhunks background
    create_background_image(
        'dysto_phunks_transparent',
        'images/dystophunks-new.png',
        width=1920,
        height=480,
        grid_cols=50,
        grid_rows=6
    )
    
    # Create Eths Rock background
    create_background_image(
        'ether_rocks_original',
        'images/eths-rock-100.png',
        width=1920,
        height=480,
        grid_cols=50,
        grid_rows=6
    ) 