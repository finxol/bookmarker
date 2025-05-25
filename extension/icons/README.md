# Extension Icons

This directory contains the icons for the Bookmarker Firefox extension.

## Required Icons

The extension requires PNG icons in the following sizes:
- `icon-16.png` (16x16 pixels)
- `icon-32.png` (32x32 pixels) 
- `icon-48.png` (48x48 pixels)
- `icon-96.png` (96x96 pixels)

## Generating Icons from SVG

You can generate the required PNG icons from the provided `icon.svg` file using various tools:

### Using Inkscape (Command Line)
```bash
# Install Inkscape first, then run:
inkscape icon.svg --export-png=icon-16.png --export-width=16 --export-height=16
inkscape icon.svg --export-png=icon-32.png --export-width=32 --export-height=32
inkscape icon.svg --export-png=icon-48.png --export-width=48 --export-height=48
inkscape icon.svg --export-png=icon-96.png --export-width=96 --export-height=96
```

### Using ImageMagick
```bash
# Install ImageMagick first, then run:
convert icon.svg -resize 16x16 icon-16.png
convert icon.svg -resize 32x32 icon-32.png
convert icon.svg -resize 48x48 icon-48.png
convert icon.svg -resize 96x96 icon-96.png
```

### Using Online Tools
1. Upload `icon.svg` to an online SVG to PNG converter
2. Generate PNG files at the required sizes
3. Save them with the correct filenames

### Using Design Software
Open `icon.svg` in your preferred design software (Figma, Adobe Illustrator, etc.) and export at the required sizes.

## Icon Design

The current icon is a simple bookmark symbol with:
- Blue fill color (#0066cc)
- White text/content area
- Simple, recognizable bookmark shape

Feel free to modify `icon.svg` to match your brand or preferences before generating the PNG files.