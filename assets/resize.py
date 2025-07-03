from PIL import Image

size = 256

# Open the original image
img = Image.open("weekday_windfall.png")

# Resize the image to size x size pixels
img_resized = img.resize((size, size), Image.LANCZOS)

# Save the resized image with the size in the filename
img_resized.save(f"weekday_windfall{size}.png")
