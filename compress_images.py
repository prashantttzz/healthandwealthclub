import os
import sys
from PIL import Image
import io

def compress_image(file_path, target_size_mb=0.9):
    """
    Compresses an image to be under the target size (in MB).
    Modifies the file in place.
    """
    # Use 0.9MB as the hard limit for checking to ensure we stay under 1MB
    hard_limit_bytes = 0.9 * 1024 * 1024
    target_size_bytes = target_size_mb * 1024 * 1024
    file_size = os.path.getsize(file_path)

    if file_size <= hard_limit_bytes:
        return False, file_size

    print(f"Compressing: {file_path} ({file_size / (1024*1024):.2f} MB)", flush=True)

    ext = os.path.splitext(file_path)[1].lower()
    img = Image.open(file_path)
    
    # Standardize format for compression
    # PNGs often need to be converted to RGB/RGBA or even JPEG if they are huge photos
    # But we'll try to keep the original format first.
    
    img_format = img.format
    if img_format not in ['JPEG', 'PNG', 'WEBP']:
        # Fallback to JPEG if unknown
        img_format = 'JPEG'
        if img.mode in ("RGBA", "P"):
            img = img.convert("RGB")

    quality = 85
    step = 5
    
    # Try reducing quality first (for JPEG/WEBP)
    while file_size > target_size_bytes and quality > 10:
        if img_format == 'PNG':
            # PNG quality doesn't exist, we must resize or optimize
            break
            
        buffer = io.BytesIO()
        img.save(buffer, format=img_format, quality=quality, optimize=True)
        file_size = buffer.tell()
        quality -= step

    # If still too large, or if it's a PNG, resize it
    scale = 0.9
    while file_size > target_size_bytes:
        width, height = img.size
        new_size = (int(width * scale), int(height * scale))
        
        # Don't resize to zero
        if new_size[0] < 10 or new_size[1] < 10:
            break
            
        img = img.resize(new_size, Image.Resampling.LANCZOS)
        
        buffer = io.BytesIO()
        if img_format == 'PNG':
            img.save(buffer, format=img_format, optimize=True)
        else:
            img.save(buffer, format=img_format, quality=max(quality, 20), optimize=True)
            
        file_size = buffer.tell()
        scale *= 0.9 # Aggressive scaling if still too big

    # Save the final result using the quality we just calculated
    img.save(file_path, format=img_format, optimize=True, quality=quality if img_format != 'PNG' else None)
    
    final_size = os.path.getsize(file_path)
    print(f"  -> Compressed to: {final_size / (1024*1024):.2f} MB", flush=True)
    return True, final_size

def process_folder(folder_path, recursive=True):
    if not os.path.isdir(folder_path):
        print(f"Error: {folder_path} is not a valid directory.", flush=True)
        return

    supported_extensions = ('.jpg', '.jpeg', '.png', '.webp')
    count = 0
    compressed_count = 0

    for root, dirs, files in os.walk(folder_path):
        # Skip dependency and build folders for performance
        if any(ignored in root for ignored in ['node_modules', '.git', '.next']):
            continue

        for file in files:
            if file.lower().endswith(supported_extensions):
                file_path = os.path.join(root, file)
                count += 1
                was_compressed, _ = compress_image(file_path)
                if was_compressed:
                    compressed_count += 1
        if not recursive:
            break

    print(f"\nProcessing complete.", flush=True)
    print(f"Total images found: {count}", flush=True)
    print(f"Images compressed: {compressed_count}", flush=True)

if __name__ == "__main__":
    target_folder = "."
    if len(sys.argv) > 1:
        target_folder = sys.argv[1]
    
    print(f"Scanning folder: {os.path.abspath(target_folder)}", flush=True)
    process_folder(target_folder)
