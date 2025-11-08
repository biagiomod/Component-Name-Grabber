var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Show the UI window
const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      padding: 20px;
      background: #EFEFEF;
      margin: 0;
      display: flex;
      flex-direction: column;
      height: 100%;
      min-height: 100%;
    }

    .container {
      display: flex;
      flex-direction: column;
      gap: 14px;
      flex: 1;
    }

    button {
      width: 100%;
      padding: 14px 18px;
      background: #EED1CF;
      color: #ED5B50;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      box-shadow: 0 2px 4px rgba(237, 91, 80, 0.2);
      position: relative;
    }

    button:hover:not(:disabled) {
      background: #E8C4C0;
      box-shadow: 0 4px 8px rgba(237, 91, 80, 0.3);
      transform: translateY(-1px);
    }

    button:active:not(:disabled) {
      background: #E2B7B1;
      transform: translateY(0);
      box-shadow: 0 2px 4px rgba(237, 91, 80, 0.2);
    }

    button:disabled {
      background: #e5e5e5;
      color: #999;
      cursor: not-allowed;
      box-shadow: none;
      transform: none;
    }

    .button-icon {
      width: 16px;
      height: 16px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .button-icon svg {
      width: 100%;
      height: 100%;
      fill: currentColor;
    }

    .status {
      font-size: 12px;
      color: #666;
      text-align: center;
      min-height: 16px;
      padding: 4px 0;
    }

    .status.loading {
      color: #ED5B50;
    }

    .status.success {
      color: #0a8f3e;
    }

    .status.error {
      color: #e63946;
    }

    .footer {
      font-size: 11px;
      color: #999;
      text-align: center;
      margin-top: auto;
      padding-top: 12px;
      border-top: 1px solid #ddd;
    }

    .footer a {
      color: #999;
      text-decoration: none;
      transition: color 0.2s ease;
    }

    .footer a:hover {
      color: #ED5B50;
      text-decoration: underline;
    }

    .title {
      font-size: 18px;
      font-weight: 600;
      color: #ED5B50;
      text-align: center;
      margin-bottom: 4px;
      letter-spacing: -0.3px;
    }

    .spinner {
      display: inline-block;
      width: 12px;
      height: 12px;
      border: 2px solid #e5e5e5;
      border-top-color: #ED5B50;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
      margin-right: 6px;
      vertical-align: middle;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="title">Get Published Component IDs</div>
    <button id="show-published">
      <span class="button-icon">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
        </svg>
      </span>
      <span>SHOW</span>
    </button>
    <button id="copy-published">
      <span class="button-icon">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
        </svg>
      </span>
      <span>COPY AS JSON</span>
    </button>
    <button id="download-json">
      <span class="button-icon">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
        </svg>
      </span>
      <span>DOWNLOAD JSON</span>
    </button>
    <div id="status" class="status"></div>
  </div>
  <div class="footer">
    <a href="mailto:biagioux@gmail.com">Contact Biagio for Help</a>
  </div>

  <script>
    const showPublishedBtn = document.getElementById('show-published');
    const copyPublishedBtn = document.getElementById('copy-published');
    const downloadJsonBtn = document.getElementById('download-json');
    const statusEl = document.getElementById('status');

    function setButtonsEnabled(enabled) {
      showPublishedBtn.disabled = !enabled;
      copyPublishedBtn.disabled = !enabled;
      downloadJsonBtn.disabled = !enabled;
    }

    function setStatus(message, className = '') {
      statusEl.textContent = message;
      statusEl.className = 'status ' + className;
      if (className === 'loading') {
        statusEl.innerHTML = '<span class="spinner"></span>' + message;
      }
    }

    showPublishedBtn.addEventListener('click', () => {
      setButtonsEnabled(false);
      setStatus('Scanning components...', 'loading');
      parent.postMessage({ pluginMessage: { type: 'show-published' } }, '*');
    });

    copyPublishedBtn.addEventListener('click', () => {
      setButtonsEnabled(false);
      setStatus('Scanning components...', 'loading');
      parent.postMessage({ pluginMessage: { type: 'copy-published' } }, '*');
    });

    downloadJsonBtn.addEventListener('click', () => {
      setButtonsEnabled(false);
      setStatus('Scanning components...', 'loading');
      parent.postMessage({ pluginMessage: { type: 'download-json' } }, '*');
    });

    // Listen for messages from the plugin code
    window.onmessage = (event) => {
      const { type, data, count, status } = event.data.pluginMessage || {};
      if (type === 'enable-buttons') {
        setButtonsEnabled(true);
        if (status) {
          setStatus(status.message, status.className || '');
        } else {
          setStatus('');
        }
      } else if (type === 'status-update') {
        setStatus(status.message, status.className || 'loading');
      } else if (type === 'copy-to-clipboard') {
        setStatus('Copying to clipboard...', 'loading');
        
        // Use a more reliable clipboard method with fallback
        const copyToClipboard = (text) => {
          // Try modern clipboard API first
          if (navigator.clipboard && navigator.clipboard.writeText) {
            return navigator.clipboard.writeText(text);
          }
          
          // Fallback to execCommand method
          return new Promise((resolve, reject) => {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.left = '-999999px';
            textarea.style.top = '-999999px';
            document.body.appendChild(textarea);
            textarea.focus();
            textarea.select();
            
            try {
              const successful = document.execCommand('copy');
              document.body.removeChild(textarea);
              if (successful) {
                resolve();
              } else {
                reject(new Error('execCommand copy failed'));
              }
            } catch (err) {
              document.body.removeChild(textarea);
              reject(err);
            }
          });
        };
        
        // Copy with timeout protection
        const timeout = setTimeout(() => {
          parent.postMessage({ pluginMessage: { type: 'copy-error' } }, '*');
        }, 3000);
        
        copyToClipboard(data).then(() => {
          clearTimeout(timeout);
          parent.postMessage({ pluginMessage: { type: 'copy-success', count: count } }, '*');
        }).catch((err) => {
          clearTimeout(timeout);
          console.error('Failed to copy:', err);
          parent.postMessage({ pluginMessage: { type: 'copy-error' } }, '*');
        });
      } else if (type === 'download-json') {
        setStatus('Preparing download...', 'loading');
        // Create a blob and download link
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'components.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        // Notify success
        setTimeout(() => {
          parent.postMessage({ pluginMessage: { type: 'download-success', count: count } }, '*');
        }, 100);
      }
    };
  </script>
</body>
</html>
`;
figma.showUI(html, { width: 260, height: 360 });
function getComponentInfo(node, componentSet) {
    return __awaiter(this, void 0, void 0, function* () {
        const key = node.key || null;
        // A component is considered published if it has a key
        // Components published to libraries have keys
        const published = key !== null;
        const info = {
            name: node.name,
            key: key,
            id: node.id,
            published: published,
            type: node.type
        };
        // If this is a variant component (part of a ComponentSet), add variant info
        if (node.type === 'COMPONENT' && componentSet) {
            info.componentSetId = componentSet.id;
            info.componentSetName = componentSet.name;
            // Get variant properties if available
            if (node.variantProperties) {
                info.variantProperties = node.variantProperties;
            }
        }
        return info;
    });
}
function getPublishedComponents() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Send status update
            figma.ui.postMessage({
                type: 'status-update',
                status: { message: 'Loading pages...', className: 'loading' }
            });
            // Load all pages first to ensure we have access to the entire document
            yield figma.loadAllPagesAsync();
            // Send status update
            figma.ui.postMessage({
                type: 'status-update',
                status: { message: 'Finding components...', className: 'loading' }
            });
            // Find only COMPONENT and COMPONENT_SET nodes (exclude INSTANCE)
            const allNodes = figma.root.findAll(node => node.type === "COMPONENT" ||
                node.type === "COMPONENT_SET");
            if (allNodes.length === 0) {
                figma.notify("No components found in this file.");
                figma.ui.postMessage({
                    type: 'enable-buttons',
                    status: { message: 'No components found', className: 'error' }
                });
                return [];
            }
            // Send status update
            figma.ui.postMessage({
                type: 'status-update',
                status: { message: `Processing ${allNodes.length} components...`, className: 'loading' }
            });
            // Gather information for each component
            const componentInfos = [];
            const processedComponentIds = new Set(); // Track processed component IDs to avoid duplicates
            let processedCount = 0;
            const totalNodes = allNodes.length;
            for (let i = 0; i < allNodes.length; i++) {
                const node = allNodes[i];
                try {
                    if (node.type === 'COMPONENT_SET') {
                        // For ComponentSets, also process all variant components
                        const componentSet = node;
                        const componentSetInfo = yield getComponentInfo(componentSet);
                        componentInfos.push(componentSetInfo);
                        processedComponentIds.add(componentSet.id);
                        processedCount++;
                        // Process all variant components within the ComponentSet
                        const variantComponents = componentSet.children.filter(child => child.type === 'COMPONENT');
                        for (const variant of variantComponents) {
                            // Skip if we've already processed this component
                            if (processedComponentIds.has(variant.id)) {
                                continue;
                            }
                            try {
                                const variantInfo = yield getComponentInfo(variant, componentSet);
                                componentInfos.push(variantInfo);
                                processedComponentIds.add(variant.id);
                                processedCount++;
                            }
                            catch (error) {
                                console.error(`Error processing variant ${variant.name}:`, error);
                                componentInfos.push({
                                    name: variant.name,
                                    key: null,
                                    id: variant.id,
                                    published: false,
                                    type: 'COMPONENT',
                                    componentSetId: componentSet.id,
                                    componentSetName: componentSet.name
                                });
                                processedComponentIds.add(variant.id);
                                processedCount++;
                            }
                        }
                    }
                    else {
                        // For standalone components, process normally
                        // But skip if it's already part of a ComponentSet we've processed
                        if (processedComponentIds.has(node.id)) {
                            continue;
                        }
                        const info = yield getComponentInfo(node);
                        componentInfos.push(info);
                        processedComponentIds.add(node.id);
                        processedCount++;
                    }
                    // Update progress every 10 items
                    if (processedCount % 10 === 0 || i === allNodes.length - 1) {
                        figma.ui.postMessage({
                            type: 'status-update',
                            status: { message: `Processing ${processedCount} items...`, className: 'loading' }
                        });
                    }
                }
                catch (error) {
                    console.error(`Error processing component ${node.name}:`, error);
                    // Add a fallback entry for components with errors
                    componentInfos.push({
                        name: node.name,
                        key: null,
                        id: node.id,
                        published: false,
                        type: node.type
                    });
                    processedCount++;
                }
            }
            // Filter to only published components
            const publishedComponents = componentInfos.filter(info => info.published);
            if (publishedComponents.length === 0) {
                figma.notify("No published components found in this file.");
                figma.ui.postMessage({
                    type: 'enable-buttons',
                    status: { message: 'No published components found', className: 'error' }
                });
                return [];
            }
            // Send status update
            figma.ui.postMessage({
                type: 'status-update',
                status: { message: `Found ${publishedComponents.length} published components`, className: 'success' }
            });
            return publishedComponents;
        }
        catch (error) {
            console.error('Plugin error:', error);
            figma.notify('An error occurred while scanning components.');
            figma.ui.postMessage({
                type: 'enable-buttons',
                status: { message: 'Error occurred', className: 'error' }
            });
            return [];
        }
    });
}
function createTextFieldOnStage(components) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Format component info as text
            const textContent = components
                .map(component => {
                const keyText = component.key || 'No Key';
                let line = `${component.name} — Key: ${keyText} — ID: ${component.id} — Type: ${component.type}`;
                // Add variant information if available
                if (component.componentSetName) {
                    line += ` — ComponentSet: ${component.componentSetName}`;
                    if (component.variantProperties) {
                        const variantProps = [];
                        for (const key in component.variantProperties) {
                            if (component.variantProperties.hasOwnProperty(key)) {
                                variantProps.push(`${key}=${component.variantProperties[key]}`);
                            }
                        }
                        if (variantProps.length > 0) {
                            line += ` — Variant: ${variantProps.join(', ')}`;
                        }
                    }
                }
                return line;
            })
                .join('\n');
            // Create text node on the current page
            const textNode = figma.createText();
            // Load fonts before setting text content
            yield figma.loadFontAsync({ family: "Inter", style: "Regular" });
            textNode.characters = textContent;
            // Position the text node in the center of the viewport
            const { x, y } = figma.viewport.center;
            textNode.x = x - (textNode.width / 2);
            textNode.y = y - (textNode.height / 2);
            // Select the created text node
            figma.currentPage.selection = [textNode];
            figma.viewport.scrollAndZoomIntoView([textNode]);
            figma.notify(`Created text field with ${components.length} published components.`);
        }
        catch (error) {
            console.error('Error creating text field:', error);
            figma.notify('Failed to create text field.');
            throw error;
        }
    });
}
// Listen for messages from the UI
figma.ui.onmessage = (msg) => __awaiter(this, void 0, void 0, function* () {
    if (msg.type === 'show-published') {
        const publishedComponents = yield getPublishedComponents();
        if (publishedComponents.length > 0) {
            try {
                yield createTextFieldOnStage(publishedComponents);
                figma.ui.postMessage({
                    type: 'enable-buttons',
                    status: { message: `Created text field with ${publishedComponents.length} components`, className: 'success' }
                });
            }
            catch (error) {
                figma.ui.postMessage({
                    type: 'enable-buttons',
                    status: { message: 'Failed to create text field', className: 'error' }
                });
            }
        }
    }
    else if (msg.type === 'copy-published') {
        const publishedComponents = yield getPublishedComponents();
        if (publishedComponents.length > 0) {
            // Create JSON with name, key, id, type, and variant information
            const jsonData = publishedComponents.map(component => {
                const baseData = {
                    name: component.name,
                    key: component.key,
                    id: component.id,
                    type: component.type
                };
                // Add variant information if this is a variant component
                if (component.componentSetId) {
                    baseData.componentSetId = component.componentSetId;
                    baseData.componentSetName = component.componentSetName;
                    if (component.variantProperties) {
                        baseData.variantProperties = component.variantProperties;
                    }
                }
                return baseData;
            });
            const jsonString = JSON.stringify(jsonData, null, 2);
            // Send JSON to UI to copy to clipboard
            figma.ui.postMessage({
                type: 'copy-to-clipboard',
                data: jsonString,
                count: publishedComponents.length
            });
        }
        else {
            // Re-enable buttons if no components found
            figma.ui.postMessage({
                type: 'enable-buttons'
            });
        }
    }
    else if (msg.type === 'copy-success') {
        const count = msg.count || 0;
        figma.notify(`Copied ${count} published components to clipboard.`);
        figma.ui.postMessage({
            type: 'enable-buttons',
            status: { message: `Copied ${count} components!`, className: 'success' }
        });
    }
    else if (msg.type === 'copy-error') {
        figma.notify('Failed to copy to clipboard.');
        figma.ui.postMessage({
            type: 'enable-buttons',
            status: { message: 'Copy failed', className: 'error' }
        });
    }
    else if (msg.type === 'download-json') {
        const publishedComponents = yield getPublishedComponents();
        if (publishedComponents.length > 0) {
            // Create JSON with name, key, id, type, and variant information
            const jsonData = publishedComponents.map(component => {
                const baseData = {
                    name: component.name,
                    key: component.key,
                    id: component.id,
                    type: component.type
                };
                // Add variant information if this is a variant component
                if (component.componentSetId) {
                    baseData.componentSetId = component.componentSetId;
                    baseData.componentSetName = component.componentSetName;
                    if (component.variantProperties) {
                        baseData.variantProperties = component.variantProperties;
                    }
                }
                return baseData;
            });
            const jsonString = JSON.stringify(jsonData, null, 2);
            // Send JSON to UI to download
            figma.ui.postMessage({
                type: 'download-json',
                data: jsonString,
                count: publishedComponents.length
            });
        }
        else {
            // Re-enable buttons if no components found
            figma.ui.postMessage({
                type: 'enable-buttons'
            });
        }
    }
    else if (msg.type === 'download-success') {
        const count = msg.count || 0;
        figma.notify(`Downloaded ${count} published components as JSON file.`);
        figma.ui.postMessage({
            type: 'enable-buttons',
            status: { message: `Downloaded ${count} components!`, className: 'success' }
        });
    }
});
