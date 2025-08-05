# Component Name Grabber

A Figma plugin that scans the entire document for all Components, Component Sets, and Component Instances (including those from shared libraries) and displays their information in a formatted text node.

## Features

- Scans for all components in the document (local and from shared libraries)
- Gathers component information:
  - Name
  - Key (for importComponentByKeyAsync)
  - ID (nodeId within the file)
  - Published status (whether it's part of a published library)
- Creates a formatted text node on the canvas with all results
- Handles errors gracefully for components without keys or library status
- Works in both design files and shared library files

## Installation

1. Clone or download this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the plugin:
   ```bash
   npm run build
   ```
4. In Figma, go to Plugins > Development > Import plugin from manifest
5. Select the `manifest.json` file from this directory

## Usage

1. Open a Figma file (design file or shared library file)
2. Run the "Component Name Grabber" plugin
3. The plugin will scan the document and create a text node with all component information
4. Each component will be listed on a separate line in the format:
   ```
   Component Name — Key: XYZ — ID: ABC — Published: true/false
   ```

## Development

To watch for changes during development:
```bash
npm run watch
```

## Output Format

The plugin creates a text node with each component on a new line:
- Component names are preserved as-is
- Keys are shown as "No Key" if unavailable
- IDs are the internal Figma node IDs
- Published status shows "true" for components from published libraries, "false" for local components

## Error Handling

The plugin includes error handling for:
- Components without keys
- Components with missing library information
- General processing errors

If any component fails to process, it will still be included in the output with fallback values. 