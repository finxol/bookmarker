#!/bin/bash

# Generate PNG icons from SVG for Firefox extension
# Requires ImageMagick to be installed

cd "$(dirname "$0")/icons"

if [ ! -f "icon.svg" ]; then
    echo "Error: icon.svg not found in icons directory"
    exit 1
fi

# Check if convert command is available
if ! command -v convert &> /dev/null; then
    echo "Error: ImageMagick (convert command) is not installed"
    echo "Install with: brew install imagemagick (macOS) or apt-get install imagemagick (Ubuntu)"
    exit 1
fi

echo "Generating PNG icons from icon.svg..."

# Generate required icon sizes
convert icon.svg -resize 16x16 icon-16.png
convert icon.svg -resize 32x32 icon-32.png
convert icon.svg -resize 48x48 icon-48.png
convert icon.svg -resize 96x96 icon-96.png

echo "Generated icons:"
ls -la icon-*.png

echo "Icon generation complete!"