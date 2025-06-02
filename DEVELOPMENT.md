# Neon Dreams Theme - Development Guide

This document contains development instructions and technical details for the Neon Dreams Theme VS Code extension.

## 🛠️ Development Setup

### Prerequisites
- Node.js (v14 or higher)
- npm
- VS Code Extension Manager (vsce)

### Installation
```bash
npm install -g vsce
```

## 📦 Building & Packaging

### Quick Package
To package the theme for distribution:
```bash
npm run package
```

### Version Management
For development builds with automatic version bumping:

```bash
npm run build:patch    # Patch version bump + build (1.0.0 -> 1.0.1)
npm run build:minor    # Minor version bump + build (1.0.0 -> 1.1.0)
npm run build:major    # Major version bump + build (1.0.0 -> 2.0.0)
```

### Release Workflow
For creating tagged releases:

```bash
npm run release:patch  # Patch version, build, commit, and tag
npm run release:minor  # Minor version, build, commit, and tag
npm run release:major  # Major version, build, commit, and tag
```

### Cleanup
```bash
npm run clean          # Remove .vsix files from dist/
npm run clean:all      # Remove entire dist/ directory
```

## 📁 Project Structure

```
neon_dreams/
├── themes/                          # Theme JSON files
│   ├── neon-dreams-color-theme.json
│   └── neon-dreams-pastel-color-theme.json
├── dist/                           # Build output
├── icon.png                        # Extension icon (128x128)
├── icon.svg                        # Source icon
├── package.json                    # Extension manifest
├── README.md                       # User-facing documentation
├── DEVELOPMENT.md                  # This file
├── BUILD.md                        # Additional build notes
└── LICENSE                         # MIT license
```

## 🎨 Theme Development

### Color Scheme Philosophy
- **Core Colors**: Pink/purple base with complementary blues and teals
- **Contrast**: Maintain WCAG AA compliance for readability
- **Consistency**: Use the same color for similar semantic elements across languages

### Theme Files
- `neon-dreams-color-theme.json`: Main dark theme with vibrant colors
- `neon-dreams-pastel-color-theme.json`: Softer variant with pastel colors

### Testing Themes
1. Open VS Code
2. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
3. Type "Developer: Reload Window" to reload the extension
4. Go to File > Preferences > Color Theme
5. Select your theme variant

## 🚀 Publishing to VS Code Marketplace

### Prerequisites
1. Create a [Visual Studio Marketplace publisher account](https://marketplace.visualstudio.com/manage)
2. Generate a Personal Access Token (PAT) from Azure DevOps
3. Login with vsce: `vsce login <publisher-name>`

### Publishing Steps
1. **Test the package locally:**
   ```bash
   npm run package
   code --install-extension dist/neon-dreams-theme-*.vsix
   ```

2. **Publish to marketplace:**
   ```bash
   vsce publish
   ```

3. **Or publish with version bump:**
   ```bash
   vsce publish patch  # or minor/major
   ```

### Pre-publish Checklist
- [ ] Test both theme variants
- [ ] Update version in package.json
- [ ] Update CHANGELOG if you have one
- [ ] Ensure icon.png exists and is 128x128
- [ ] Test installation from .vsix file
- [ ] Verify all theme files are included in package

## 🔧 Configuration

### Package.json Key Fields
- `icon`: Must point to a PNG file (128x128 recommended)
- `galleryBanner`: Marketplace banner configuration
- `categories`: Must include "Themes"
- `contributes.themes`: Theme definitions

### Icon Requirements
- Format: PNG
- Size: 128x128 pixels
- Background: Transparent or solid color
- Style: Should represent your theme's aesthetic

## 🐛 Debugging

### Common Issues
1. **Theme not loading**: Check JSON syntax in theme files
2. **Colors not applying**: Verify scope names match VS Code's token scopes
3. **Icon not showing**: Ensure icon.png exists and path is correct in package.json

### Testing Tools
- Use VS Code's Developer Tools (`Help > Toggle Developer Tools`)
- Inspect element to see applied token scopes
- Use the Command Palette: "Developer: Inspect Editor Tokens and Scopes"

## 📋 Maintenance

### Regular Tasks
- Test with new VS Code releases
- Update for new language support
- Monitor user feedback and issues
- Keep dependencies updated

### Version Strategy
- **Patch**: Bug fixes, minor color adjustments
- **Minor**: New language support, feature additions
- **Major**: Complete redesigns, breaking changes

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly with multiple languages
5. Submit a pull request

### Code Style
- Use consistent indentation in JSON files
- Group related colors together
- Comment complex color choices
- Follow semantic versioning

---

For user-facing documentation, see [README.md](README.md). 