# Bookmarker Firefox Extension

A Firefox extension for quickly bookmarking pages to your bookmarker.finxol.io account.

## Features

- Quick bookmark button in the browser toolbar
- Automatic authentication check
- One-click bookmarking of the current page
- Clean, intuitive interface
- Keyboard shortcuts support

## Installation

### From Source (Development)

1. Clone or download this repository
2. Open Firefox and navigate to `about:debugging`
3. Click "This Firefox" in the left sidebar
4. Click "Load Temporary Add-on..."
5. Navigate to the `extension` directory and select `manifest.json`

### Icons Required

The extension expects icon files in the `icons/` directory:
- `icon-16.png` (16x16 pixels)
- `icon-32.png` (32x32 pixels)
- `icon-48.png` (48x48 pixels)
- `icon-96.png` (96x96 pixels)

You can create these icons or use placeholder images for development.

## Usage

1. **First time setup**: Click the extension icon and login to your bookmarker account
2. **Bookmarking**: Click the extension icon on any page and click "Bookmark This Page"
3. **Keyboard shortcuts**: 
   - `Enter` to bookmark the current page (when authenticated) or login
   - `Escape` to close the popup

## Authentication

The extension checks for authentication by making a request to `https://bookmarker.finxol.io/auth/me`. If you're not logged in, it will redirect you to the authorization page.

## API Integration

The extension integrates with the following endpoints:
- `GET /auth/me` - Check authentication status
- `POST /bookmarks/new?url=<url>` - Create a new bookmark

## Development

### File Structure

```
extension/
├── manifest.json      # Extension configuration
├── popup.html         # Popup interface
├── popup.css          # Popup styling
├── popup.js           # Main extension logic
├── icons/             # Extension icons
└── README.md          # This file
```

### Permissions

The extension requires:
- `activeTab` - To get the current page URL
- `https://bookmarker.finxol.io/*` - To communicate with the API

## Troubleshooting

### Extension not working
- Check that you're logged into bookmarker.finxol.io in the same browser
- Verify the API endpoints are accessible
- Check the browser console for any errors

### Authentication issues
- Clear browser cookies for bookmarker.finxol.io
- Try logging in manually first
- Check that the `/auth/me` endpoint is working

## Browser Compatibility

This extension is designed for Firefox using Manifest V2. For Chrome compatibility, the manifest would need to be updated to Manifest V3.