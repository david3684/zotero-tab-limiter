# Zotero Tab Limiter

[![zotero target version](https://img.shields.io/badge/Zotero-7-green?style=flat-square&logo=zotero&logoColor=CC2936)](https://www.zotero.org)
[![Using Zotero Plugin Template](https://img.shields.io/badge/Using-Zotero%20Plugin%20Template-blue?style=flat-square&logo=github)](https://github.com/windingwind/zotero-plugin-template)

A Zotero plugin to limit the maximum number of tabs that can be open in Zotero. When the number of tabs exceeds the configured limit, the oldest tabs will be automatically closed.

[English](README.md) | [简体中文](doc/README-zhCN.md)

## Features

- Automatically close the oldest tabs when the maximum number of tabs is exceeded
- Configure the maximum number of tabs allowed via the preferences panel
- Automatically detect changes to tab count and preferences settings
- Works seamlessly in the background

## Installation

- Download the latest release (.xpi file) from the [Releases page](https://github.com/yourusername/zotero-tab-limiter/releases)
- In Zotero, go to Tools → Add-ons
- Click the gear icon and select "Install Add-on From File..."
- Select the downloaded .xpi file

## Usage

### Setting the Tab Limit

1. Go to Tools → Add-ons
2. Find "Zotero Tab Limiter" in the list and click "Preferences"
3. Enter your desired maximum number of tabs (minimum 1)
4. Click OK

### How It Works

Once installed and configured, the plugin works automatically in the background:

- When a new tab is opened and the total number of tabs exceeds your limit, the oldest tab(s) will be closed
- When you change the maximum tab setting, if the current number of tabs exceeds the new limit, the oldest tabs will be closed immediately
- The plugin uses the last accessed time to determine which tabs are the oldest

## Development

This plugin is built using the [Zotero Plugin Template](https://github.com/windingwind/zotero-plugin-template).

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or later)
- [Zotero 7](https://www.zotero.org/support/beta_builds) (beta)

### Setup for Development

1. Clone the repository
```bash
git clone https://github.com/yourusername/zotero-tab-limiter.git
cd zotero-tab-limiter
```

2. Install dependencies
```bash
npm install
```

3. Copy the environment variable file and configure it
```bash
cp .env.example .env
```
Update the `.env` file with your Zotero installation path and profile

4. Start the development server
```bash
npm start
```

### Building

```bash
npm run build
```

The built plugin will be in the `build` directory.

## Releasing

To create a new release:

```bash
npm run release
```

This will:
1. Prompt for a new version number
2. Update the version in package.json
3. Create a git tag
4. Push changes to GitHub
5. GitHub Actions will build the plugin and create a release

## License

This project is licensed under the [GNU Affero General Public License v3.0](LICENSE).

## Acknowledgements

- [Zotero Plugin Template](https://github.com/windingwind/zotero-plugin-template) by [windingwind](https://github.com/windingwind)
- [Zotero Plugin Toolkit](https://github.com/windingwind/zotero-plugin-toolkit)
