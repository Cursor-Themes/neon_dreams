# Build Documentation

## Production Build Flow

This project uses an automated build system that handles version bumping and packaging.

## Available Commands

### Development Commands
```bash
# Build without version bump (outputs to dist/)
npm run build

# Clean build artifacts
npm run clean          # Remove *.vsix files from dist/
npm run clean:all      # Remove entire dist/ directory
```

### Release Commands
```bash
# Quick package with patch version bump (recommended for most changes)
npm run package        # Bumps patch version and builds

# Manual version control
npm run build:patch    # Bump patch version (1.2.1 → 1.2.2) and build
npm run build:minor    # Bump minor version (1.2.1 → 1.3.0) and build  
npm run build:major    # Bump major version (1.2.1 → 2.0.0) and build
```

### Git Release Commands (with commit and tag)
```bash
npm run release:patch  # Patch bump + git commit + git tag
npm run release:minor  # Minor bump + git commit + git tag
npm run release:major  # Major bump + git commit + git tag
```

## Build Output

All builds are output to the `dist/` directory:
- `dist/neon-dreams-theme-{version}.vsix` - VS Code extension package

## Version Bumping

The build system automatically:
1. Updates `package.json` version
2. Creates new VSIX package with updated version
3. Outputs to `dist/` directory
4. (Optional) Creates git commit and tag for releases

## Workflow Examples

### Regular Development
```bash
# Make changes to themes
npm run package  # Auto-bump patch version and build
```

### Feature Release
```bash
# Make significant changes
npm run build:minor  # Bump minor version and build
```

### Production Release with Git
```bash
# Ready for release
npm run release:minor  # Bump, build, commit, and tag
git push origin main --tags
``` 