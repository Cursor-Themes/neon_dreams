# GitHub Action Setup Guide

This guide will help you set up automatic publishing to the VS Code Marketplace using GitHub Actions.

## 🚀 Overview

The GitHub Action automatically:
- Detects version changes in `package.json`
- Infers bump type (patch/minor/major)
- Runs the appropriate npm script (`release:patch`, `release:minor`, or `release:major`)
- Publishes to VS Code Marketplace
- Creates a GitHub release with the VSIX file

## 📋 Prerequisites

### 1. VS Code Marketplace Publisher Account

1. Visit [Visual Studio Marketplace Publisher Management](https://marketplace.visualstudio.com/manage)
2. Sign in with your Microsoft/Azure account
3. Create a publisher if you don't have one

### 2. Personal Access Token (PAT)

1. Go to [Azure DevOps](https://dev.azure.com/)
2. Click on your profile → **Personal access tokens**
3. Click **+ New Token**
4. Configure:
   - **Name**: `VS Code Marketplace Publishing`
   - **Organization**: Select your organization
   - **Expiration**: Set desired expiration (recommend 1 year)
   - **Scopes**: Select **Custom defined**
   - Check **Marketplace** → **Manage**
5. Click **Create**
6. **⚠️ IMPORTANT**: Copy the token immediately (you won't see it again)

## 🔧 GitHub Repository Setup

### 1. Add Repository Secrets

Go to your GitHub repository → **Settings** → **Secrets and variables** → **Actions**

Add the following secrets:

| Secret Name | Value | Description |
|-------------|--------|-------------|
| `VSCE_PAT` | Your Azure DevOps PAT | Required for publishing to marketplace |

**Note**: `GITHUB_TOKEN` is automatically provided by GitHub Actions.

### 2. Update package.json Publisher

Ensure your `package.json` has the correct publisher name:

```json
{
  "publisher": "your-publisher-name"
}
```

## 🎯 How It Works

### Trigger Conditions
The action runs when:
- You push changes to `main` or `master` branch
- The `package.json` file is modified
- You manually trigger it via GitHub Actions UI

### Version Detection Logic
```bash
# Example version changes:
1.2.9 → 1.2.10  # PATCH bump → runs "release:patch"
1.2.10 → 1.3.0  # MINOR bump → runs "release:minor"  
1.3.0 → 2.0.0   # MAJOR bump → runs "release:major"
```

### Workflow Steps
1. **Version Detection**: Compares current vs previous package.json version
2. **Script Execution**: Runs the appropriate npm script based on bump type
3. **Marketplace Publishing**: Uses `vsce publish` to deploy
4. **GitHub Release**: Creates release with VSIX file attached

## 📝 Usage Examples

### Patch Release (Bug fixes)
```bash
# Update version in package.json
npm version patch

# Commit and push
git add package.json
git commit -m "Fix: theme color adjustments"
git push origin main
```

### Minor Release (New features)
```bash
# Update version in package.json  
npm version minor

# Commit and push
git add package.json
git commit -m "Feature: add new pastel variant"
git push origin main
```

### Major Release (Breaking changes)
```bash
# Update version in package.json
npm version major

# Commit and push
git add package.json  
git commit -m "Breaking: restructure theme architecture"
git push origin main
```

## 🔍 Monitoring

### Check Action Status
1. Go to your repository → **Actions** tab
2. Click on the latest "Publish to VS Code Marketplace" workflow
3. Monitor the progress and logs

### Verify Publication
1. **VS Code Marketplace**: Check your extension page
2. **GitHub Releases**: New release should be created automatically
3. **VSIX File**: Download link available in the release

## 🚨 Troubleshooting

### Common Issues

**❌ Authentication Failed**
- Verify `VSCE_PAT` secret is correctly set
- Ensure PAT has `Marketplace → Manage` permissions
- Check if PAT has expired

**❌ No Version Change Detected**
- Action only runs when version in `package.json` increases
- Ensure you're pushing to `main` or `master` branch
- Check that `package.json` was actually modified in the commit

**❌ VSCE Command Failed**
- Verify publisher name in `package.json` matches your marketplace publisher
- Ensure all required fields are present in `package.json`
- Check that theme files exist and are valid JSON

**❌ Release Creation Failed**
- Ensure VSIX file was created successfully in previous steps
- Check that no release with the same tag already exists

## 🎛️ Manual Trigger

You can manually trigger the action:
1. Go to **Actions** tab in your repository
2. Select "Publish to VS Code Marketplace"
3. Click **Run workflow**
4. Choose the branch and click **Run workflow**

## 📚 Additional Resources

- [VS Code Extension Publishing Guide](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)
- [VSCE Documentation](https://github.com/microsoft/vscode-vsce)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

---

**💡 Tip**: Test your workflow with a patch version bump first to ensure everything is configured correctly before doing major releases. 