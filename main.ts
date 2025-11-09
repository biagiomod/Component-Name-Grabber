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
    <div class="title">Component Scraper</div>
    <button id="show-published">
      <span class="button-icon">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
        </svg>
      </span>
      <span>CREATE STAGE NOTES</span>
    </button>
    <button id="scan-metadata">
      <span class="button-icon">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
        </svg>
      </span>
      <span>SCAN METADATA</span>
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
    const scanMetadataBtn = document.getElementById('scan-metadata');
    const copyPublishedBtn = document.getElementById('copy-published');
    const downloadJsonBtn = document.getElementById('download-json');
    const statusEl = document.getElementById('status');

    function setButtonsEnabled(enabled) {
      showPublishedBtn.disabled = !enabled;
      if (scanMetadataBtn) scanMetadataBtn.disabled = !enabled;
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

    if (scanMetadataBtn) {
      scanMetadataBtn.addEventListener('click', () => {
        setButtonsEnabled(false);
        setStatus('Scanning metadata...', 'loading');
        parent.postMessage({ pluginMessage: { type: 'scan-metadata' } }, '*');
      });
    }

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

// Legacy interface for backward compatibility during refactoring
interface ComponentInfo {
  name: string;
  key: string | null;
  id: string;
  published: boolean;
  type: 'COMPONENT' | 'COMPONENT_SET';
  componentSetId?: string;
  componentSetName?: string;
  variantProperties?: { [key: string]: string };
}

// New hierarchical structure interfaces
interface VariantGroup {
  name: string;
  values: string[];
}

interface ComponentProperty {
  name: string;
  type: 'TEXT' | 'BOOLEAN' | 'INSTANCE_SWAP' | 'VARIANT';
  defaultValue?: string | boolean;
}

interface VariantConstraints {
  horizontal: string;
  vertical: string;
}

interface ComponentVariant {
  name: string;
  key: string | null;
  id: string;
  variantProperties: { [key: string]: string };
  width?: number;
  height?: number;
  layoutMode?: string;
  layoutGrow?: number;
  layoutAlign?: string;
  paddingLeft?: number;
  paddingRight?: number;
  paddingTop?: number;
  paddingBottom?: number;
  itemSpacing?: number;
  constraints?: VariantConstraints;
}

interface InstancePropertyValue {
  type: 'TEXT' | 'BOOLEAN' | 'INSTANCE_SWAP' | 'VARIANT';
  value: string | boolean | { componentId: string; componentName: string } | { [key: string]: string };
}

interface NestedInstance {
  name: string;
  id: string;
  mainComponentId: string;
  mainComponentName: string;
  mainComponentKey: string | null;
  variantProperties: { [key: string]: string };
  componentProperties?: { [key: string]: InstancePropertyValue };
}

interface ComponentInstance {
  id: string;
  name: string;
  componentProperties: { [key: string]: InstancePropertyValue };
  variantProperties?: { [key: string]: string };
  nestedInstances: NestedInstance[];
}

interface ComponentMetadata {
  componentDescription?: string;
  contentNotes?: string;
  devNotes?: string;
  designNotes?: string;
  productNotes?: string;
}

interface ComponentSetEntry {
  name: string;
  key: string | null;
  id: string;
  type: 'COMPONENT_SET';
  variantGroups: VariantGroup[];
  componentProperties: ComponentProperty[];
  variants: ComponentVariant[];
  instances?: ComponentInstance[];
  metadata?: ComponentMetadata;
}

async function getComponentInfo(node: ComponentNode | ComponentSetNode, componentSet?: ComponentSetNode): Promise<ComponentInfo> {
  const key = node.key || null;
  // A component is considered published if it has a key
  // Components published to libraries have keys
  const published = key !== null;

  const info: ComponentInfo = {
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
}

async function getVariantInfo(variant: ComponentNode): Promise<ComponentVariant> {
  const variantInfo: ComponentVariant = {
    name: variant.name,
    key: variant.key || null,
    id: variant.id,
    variantProperties: variant.variantProperties || {}
  };

  // Extract dimensions
  variantInfo.width = variant.width;
  variantInfo.height = variant.height;

  // Extract layout properties if Auto Layout is enabled
  if ('layoutMode' in variant && variant.layoutMode) {
    variantInfo.layoutMode = variant.layoutMode;
    variantInfo.layoutGrow = variant.layoutGrow;
    variantInfo.layoutAlign = variant.layoutAlign;
    variantInfo.paddingLeft = variant.paddingLeft;
    variantInfo.paddingRight = variant.paddingRight;
    variantInfo.paddingTop = variant.paddingTop;
    variantInfo.paddingBottom = variant.paddingBottom;
    variantInfo.itemSpacing = variant.itemSpacing;
  }

  // Extract constraints
  if (variant.constraints) {
    variantInfo.constraints = {
      horizontal: variant.constraints.horizontal,
      vertical: variant.constraints.vertical
    };
  }

  return variantInfo;
}

function extractVariantGroups(variants: ComponentVariant[]): VariantGroup[] {
  const groupsMap: { [key: string]: Set<string> } = {};

  // Collect all unique values for each variant property
  for (const variant of variants) {
    for (const propertyName in variant.variantProperties) {
      if (variant.variantProperties.hasOwnProperty(propertyName)) {
        const propertyValue = variant.variantProperties[propertyName];
        if (!groupsMap[propertyName]) {
          groupsMap[propertyName] = new Set<string>();
        }
        groupsMap[propertyName].add(String(propertyValue));
      }
    }
  }

  // Convert to VariantGroup array
  const variantGroups: VariantGroup[] = [];
  for (const name in groupsMap) {
    if (groupsMap.hasOwnProperty(name)) {
      const valuesSet = groupsMap[name];
      variantGroups.push({
        name: name,
        values: Array.from(valuesSet).sort()
      });
    }
  }

  return variantGroups;
}

async function getComponentSetInfo(componentSet: ComponentSetNode, variants: ComponentVariant[]): Promise<ComponentSetEntry> {
  const entry: ComponentSetEntry = {
    name: componentSet.name,
    key: componentSet.key || null,
    id: componentSet.id,
    type: 'COMPONENT_SET',
    variantGroups: extractVariantGroups(variants),
    componentProperties: [],
    variants: variants
  };

  // Extract component properties from ComponentSet
  if (componentSet.componentPropertyDefinitions) {
    for (const propName in componentSet.componentPropertyDefinitions) {
      if (componentSet.componentPropertyDefinitions.hasOwnProperty(propName)) {
        const propDef = componentSet.componentPropertyDefinitions[propName];
        const componentProp: ComponentProperty = {
          name: propName,
          type: propDef.type
        };

        // Add default value if available
        if ('defaultValue' in propDef && propDef.defaultValue !== undefined) {
          if (propDef.type === 'BOOLEAN') {
            componentProp.defaultValue = propDef.defaultValue as boolean;
          } else if (propDef.type === 'TEXT') {
            componentProp.defaultValue = propDef.defaultValue as string;
          }
        }

        entry.componentProperties.push(componentProp);
      }
    }
  }

  return entry;
}

function getComponentSetIdFromComponent(componentNode: ComponentNode): string | null {
  try {
    // If the component's parent is a ComponentSet, return the ComponentSet ID
    const parent = componentNode.parent;
    if (parent && parent.type === 'COMPONENT_SET') {
      return parent.id;
    }
    // If it's a standalone component, return the component's own ID
    return componentNode.id;
  } catch (error) {
    console.error(`Error getting ComponentSet ID from component ${componentNode.name}:`, error);
    return null;
  }
}

function extractInstancePropertyValues(instance: InstanceNode): { [key: string]: InstancePropertyValue } {
  const properties: { [key: string]: InstancePropertyValue } = {};
  
  if (!instance.componentProperties) {
    console.log(`Instance "${instance.name}" has no componentProperties`);
    return properties;
  }
  
  const propCount = Object.keys(instance.componentProperties).length;
  console.log(`Extracting ${propCount} properties from instance "${instance.name}"`);
  
  for (const propName in instance.componentProperties) {
    if (instance.componentProperties.hasOwnProperty(propName)) {
      try {
        const prop = instance.componentProperties[propName];
        let value: string | boolean | { componentId: string; componentName: string } | { [key: string]: string };
        
        if (prop.type === 'TEXT') {
          value = typeof prop.value === 'string' ? prop.value : String(prop.value);
          console.log(`  Property "${propName}": TEXT = "${value}"`);
        } else if (prop.type === 'BOOLEAN') {
          value = typeof prop.value === 'boolean' ? prop.value : Boolean(prop.value);
          console.log(`  Property "${propName}": BOOLEAN = ${value}`);
        } else if (prop.type === 'INSTANCE_SWAP') {
          const swappedComponent = prop.value as unknown as ComponentNode;
          if (swappedComponent && typeof swappedComponent === 'object' && 'id' in swappedComponent) {
            value = {
              componentId: swappedComponent.id,
              componentName: swappedComponent.name
            };
            console.log(`  Property "${propName}": INSTANCE_SWAP = ${swappedComponent.name}`);
          } else {
            value = String(prop.value);
            console.log(`  Property "${propName}": INSTANCE_SWAP (invalid) = ${value}`);
          }
        } else if (prop.type === 'VARIANT') {
          const variantValue = prop.value as unknown;
          if (variantValue && typeof variantValue === 'object' && !Array.isArray(variantValue)) {
            value = variantValue as { [key: string]: string };
            console.log(`  Property "${propName}": VARIANT =`, value);
          } else {
            value = String(prop.value);
            console.log(`  Property "${propName}": VARIANT (invalid) = ${value}`);
          }
        } else {
          value = String(prop.value);
          console.log(`  Property "${propName}": ${prop.type} = ${value}`);
        }
        
        properties[propName] = {
          type: prop.type,
          value: value
        };
      } catch (error) {
        console.error(`Error extracting property "${propName}" from instance "${instance.name}":`, error);
      }
    }
  }
  
  return properties;
}

async function extractNestedInstances(node: SceneNode, depth: number = 0, maxDepth: number = 10): Promise<NestedInstance[]> {
  const nestedInstances: NestedInstance[] = [];
  
  // Prevent infinite recursion
  if (depth > maxDepth) {
    return nestedInstances;
  }
  
  // Only process nodes that have children
  if (!('children' in node)) {
    return nestedInstances;
  }
  
  for (const child of node.children) {
    if (child.type === 'INSTANCE') {
      const instance = child as InstanceNode;
      const mainComponent = instance.mainComponent;
      
      // Get main component info
      const mainComponentKey = mainComponent.key || null;
      
      const nestedInstance: NestedInstance = {
        name: instance.name,
        id: instance.id,
        mainComponentId: mainComponent.id,
        mainComponentName: mainComponent.name,
        mainComponentKey: mainComponentKey,
        variantProperties: instance.variantProperties || {},
        componentProperties: extractInstancePropertyValues(instance)
      };
      
      // Recursively find nested instances within this instance
      const deeperNested = await extractNestedInstances(instance, depth + 1, maxDepth);
      // Note: We're not storing nested-nested instances in the structure, but we could if needed
      
      nestedInstances.push(nestedInstance);
    } else if ('children' in child) {
      // Recursively search in non-instance nodes that have children
      const deeperNested = await extractNestedInstances(child, depth + 1, maxDepth);
      nestedInstances.push(...deeperNested);
    }
  }
  
  return nestedInstances;
}

async function extractInstanceData(instance: InstanceNode): Promise<ComponentInstance> {
  try {
    const mainComponent = instance.mainComponent;
    
    // Extract component properties
    const componentProperties = extractInstancePropertyValues(instance);
    console.log(`Extracted ${Object.keys(componentProperties).length} properties from instance "${instance.name}"`);
    
    // Extract variant properties if this instance has variant properties
    const variantProperties = instance.variantProperties || undefined;
    if (variantProperties && Object.keys(variantProperties).length > 0) {
      console.log(`Instance "${instance.name}" has variant properties:`, variantProperties);
    }
    
    // Extract nested instances
    const nestedInstances = await extractNestedInstances(instance);
    if (nestedInstances.length > 0) {
      console.log(`Found ${nestedInstances.length} nested instances in "${instance.name}"`);
    }
    
    return {
      id: instance.id,
      name: instance.name,
      componentProperties: componentProperties,
      variantProperties: variantProperties,
      nestedInstances: nestedInstances
    };
  } catch (error) {
    console.error(`Error extracting data from instance ${instance.name}:`, error);
    throw error;
  }
}

async function gatherAllInstances(): Promise<Map<string, ComponentInstance[]>> {
  try {
    await figma.loadAllPagesAsync();
    
    // Find all INSTANCE nodes in the document
    const allInstances = figma.root.findAll(node => node.type === 'INSTANCE') as InstanceNode[];
    
    console.log(`Found ${allInstances.length} instances in document`);
    
    // Group instances by ComponentSet ID (not just mainComponent ID)
    // This ensures instances from ComponentSets are matched correctly
    const instancesByComponentSet = new Map<string, ComponentInstance[]>();
    
    for (const instance of allInstances) {
      try {
        const mainComponent = instance.mainComponent;
        const mainComponentId = mainComponent.id;
        
        // Get the ComponentSet ID (handles both ComponentSet variants and standalone components)
        const componentSetId = getComponentSetIdFromComponent(mainComponent);
        
        if (!componentSetId) {
          console.warn(`Could not determine ComponentSet ID for instance ${instance.name} (mainComponent: ${mainComponent.name})`);
          continue;
        }
        
        // Extract instance data
        const instanceData = await extractInstanceData(instance);
        
        // Store by ComponentSet ID (this is what we'll match against)
        if (!instancesByComponentSet.has(componentSetId)) {
          instancesByComponentSet.set(componentSetId, []);
        }
        instancesByComponentSet.get(componentSetId)!.push(instanceData);
        
        // Also store by mainComponent ID for fallback matching
        if (componentSetId !== mainComponentId && !instancesByComponentSet.has(mainComponentId)) {
          instancesByComponentSet.set(mainComponentId, []);
        }
        if (componentSetId !== mainComponentId) {
          instancesByComponentSet.get(mainComponentId)!.push(instanceData);
        }
        
        console.log(`Processed instance "${instance.name}" -> ComponentSet ID: ${componentSetId}, MainComponent: ${mainComponent.name}`);
      } catch (error) {
        console.error(`Error processing instance ${instance.name}:`, error);
      }
    }
    
    console.log(`Grouped instances into ${instancesByComponentSet.size} ComponentSet groups`);
    return instancesByComponentSet;
  } catch (error) {
    console.error('Error gathering instances:', error);
    return new Map<string, ComponentInstance[]>();
  }
}

async function getPublishedComponents(): Promise<ComponentInfo[]> {
  try {
    // Send status update
    figma.ui.postMessage({ 
      type: 'status-update', 
      status: { message: 'Loading pages...', className: 'loading' } 
    });
    
    // Load all pages first to ensure we have access to the entire document
    await figma.loadAllPagesAsync();
    
    // Send status update
    figma.ui.postMessage({ 
      type: 'status-update', 
      status: { message: 'Finding components...', className: 'loading' } 
    });
    
    // Find only COMPONENT and COMPONENT_SET nodes (exclude INSTANCE)
    const allNodes = figma.root.findAll(node => 
      node.type === "COMPONENT" || 
      node.type === "COMPONENT_SET"
    ) as (ComponentNode | ComponentSetNode)[];

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
    const componentInfos: ComponentInfo[] = [];
    const processedComponentIds = new Set<string>(); // Track processed component IDs to avoid duplicates
    let processedCount = 0;
    const totalNodes = allNodes.length;
    
    for (let i = 0; i < allNodes.length; i++) {
      const node = allNodes[i];
      try {
        if (node.type === 'COMPONENT_SET') {
          // For ComponentSets, also process all variant components
          const componentSet = node as ComponentSetNode;
          const componentSetInfo = await getComponentInfo(componentSet);
          componentInfos.push(componentSetInfo);
          processedComponentIds.add(componentSet.id);
          processedCount++;
          
          // Process all variant components within the ComponentSet
          const variantComponents = componentSet.children.filter(
            child => child.type === 'COMPONENT'
          ) as ComponentNode[];
          
          for (const variant of variantComponents) {
            // Skip if we've already processed this component
            if (processedComponentIds.has(variant.id)) {
              continue;
            }
            
            try {
              const variantInfo = await getComponentInfo(variant, componentSet);
              componentInfos.push(variantInfo);
              processedComponentIds.add(variant.id);
              processedCount++;
            } catch (error) {
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
        } else {
          // For standalone components, process normally
          // But skip if it's already part of a ComponentSet we've processed
          if (processedComponentIds.has(node.id)) {
            continue;
          }
          
        const info = await getComponentInfo(node);
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
      } catch (error) {
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
  } catch (error) {
    console.error('Plugin error:', error);
    figma.notify('An error occurred while scanning components.');
    figma.ui.postMessage({ 
      type: 'enable-buttons',
      status: { message: 'Error occurred', className: 'error' }
    });
    return [];
  }
}

async function getPublishedComponentsHierarchical(): Promise<ComponentSetEntry[]> {
  try {
    // Send status update
    figma.ui.postMessage({ 
      type: 'status-update', 
      status: { message: 'Loading pages...', className: 'loading' } 
    });
    
    // Load all pages first to ensure we have access to the entire document
    await figma.loadAllPagesAsync();
    
    // Send status update
    figma.ui.postMessage({ 
      type: 'status-update', 
      status: { message: 'Finding components...', className: 'loading' } 
    });
    
    // Find only COMPONENT and COMPONENT_SET nodes (exclude INSTANCE)
    const allNodes = figma.root.findAll(node => 
      node.type === "COMPONENT" || 
      node.type === "COMPONENT_SET"
    ) as (ComponentNode | ComponentSetNode)[];

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

    const componentSetEntries: ComponentSetEntry[] = [];
    const processedComponentIds = new Set<string>();
    const standaloneComponents: ComponentNode[] = [];
    let processedCount = 0;
    
    // First pass: Process ComponentSets and collect their variants
    for (let i = 0; i < allNodes.length; i++) {
      const node = allNodes[i];
      
      if (node.type === 'COMPONENT_SET') {
        const componentSet = node as ComponentSetNode;
        
        // Only process published ComponentSets (those with keys)
        if (!componentSet.key) {
          continue;
        }
        
        try {
          // Get all variant components within the ComponentSet
          const variantNodes = componentSet.children.filter(
            child => child.type === 'COMPONENT'
          ) as ComponentNode[];
          
          // Extract variant information
          const variants: ComponentVariant[] = [];
          for (const variantNode of variantNodes) {
            // Only include published variants
            if (variantNode.key) {
              try {
                const variantInfo = await getVariantInfo(variantNode);
                variants.push(variantInfo);
                processedComponentIds.add(variantNode.id);
              } catch (error) {
                console.error(`Error processing variant ${variantNode.name}:`, error);
              }
            }
          }
          
          // Only create entry if there are published variants
          if (variants.length > 0) {
            const componentSetEntry = await getComponentSetInfo(componentSet, variants);
            componentSetEntries.push(componentSetEntry);
            processedComponentIds.add(componentSet.id);
            processedCount++;
          }
          
          // Update progress
          if (processedCount % 5 === 0 || i === allNodes.length - 1) {
            figma.ui.postMessage({ 
              type: 'status-update', 
              status: { message: `Processing ${processedCount} component sets...`, className: 'loading' } 
            });
          }
        } catch (error) {
          console.error(`Error processing ComponentSet ${componentSet.name}:`, error);
        }
      } else if (node.type === 'COMPONENT') {
        // Collect standalone components for later processing
        const component = node as ComponentNode;
        // Only collect published standalone components that aren't part of a ComponentSet
        if (component.key && !processedComponentIds.has(component.id)) {
          // Check if this component is part of a ComponentSet by checking its parent
          const parent = component.parent;
          if (!parent || parent.type !== 'COMPONENT_SET') {
            standaloneComponents.push(component);
          }
        }
      }
    }
    
    // Handle standalone components - create a ComponentSetEntry for each standalone component
    // with a single variant entry
    for (const standalone of standaloneComponents) {
      if (processedComponentIds.has(standalone.id)) {
        continue;
      }
      
      try {
        const variantInfo = await getVariantInfo(standalone);
        // Create a ComponentSetEntry for the standalone component
        const standaloneEntry: ComponentSetEntry = {
          name: standalone.name,
          key: standalone.key || null,
          id: standalone.id,
          type: 'COMPONENT_SET',
          variantGroups: [],
          componentProperties: [],
          variants: [variantInfo]
        };
        componentSetEntries.push(standaloneEntry);
        processedComponentIds.add(standalone.id);
        processedCount++;
      } catch (error) {
        console.error(`Error processing standalone component ${standalone.name}:`, error);
      }
    }

    if (componentSetEntries.length === 0) {
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
      status: { message: 'Gathering component instances...', className: 'loading' } 
    });

    // Gather all instances in the document
    const instancesByComponent = await gatherAllInstances();

    // Attach instances to each ComponentSetEntry
    for (const entry of componentSetEntries) {
      // The entry.id is the ComponentSet ID (or component ID for standalone components)
      // This matches what we stored in gatherAllInstances
      const matchingInstances = instancesByComponent.get(entry.id);
      
      if (matchingInstances && matchingInstances.length > 0) {
        entry.instances = matchingInstances;
        console.log(`Matched ${matchingInstances.length} instances to ComponentSet "${entry.name}"`);
      } else {
        // Also check variant IDs as fallback (for backwards compatibility)
        const variantIds = entry.variants.map(v => v.id);
        const fallbackInstances: ComponentInstance[] = [];
        
        for (const variantId of variantIds) {
          const instances = instancesByComponent.get(variantId);
          if (instances) {
            fallbackInstances.push(...instances);
          }
        }
        
        if (fallbackInstances.length > 0) {
          entry.instances = fallbackInstances;
          console.log(`Matched ${fallbackInstances.length} instances to ComponentSet "${entry.name}" via variant IDs`);
        } else {
          console.log(`No instances found for ComponentSet "${entry.name}" (ID: ${entry.id})`);
        }
      }
    }

    // Scan metadata from Stage Notes
    figma.ui.postMessage({ 
      type: 'status-update', 
      status: { message: 'Scanning metadata from Stage Notes...', className: 'loading' } 
    });

    const metadataMap = await scanMetadataFromStageNotes();
    
    // Attach metadata to ComponentSetEntries
    for (const entry of componentSetEntries) {
      const metadata = metadataMap.get(entry.name);
      if (metadata) {
        entry.metadata = metadata;
        console.log(`Attached metadata to ComponentSet "${entry.name}"`);
      }
    }

    // Send status update
    figma.ui.postMessage({ 
      type: 'status-update', 
      status: { message: `Found ${componentSetEntries.length} published component sets`, className: 'success' } 
    });

    return componentSetEntries;
  } catch (error) {
    console.error('Plugin error:', error);
    figma.notify('An error occurred while scanning components.');
    figma.ui.postMessage({ 
      type: 'enable-buttons',
      status: { message: 'Error occurred', className: 'error' }
    });
    return [];
  }
}

async function findNodeById(nodeId: string): Promise<ComponentNode | ComponentSetNode | null> {
  try {
    await figma.loadAllPagesAsync();
    const node = await figma.getNodeByIdAsync(nodeId);
    if (node && (node.type === 'COMPONENT' || node.type === 'COMPONENT_SET')) {
      return node as ComponentNode | ComponentSetNode;
    }
    return null;
  } catch (error) {
    console.error(`Error finding node ${nodeId}:`, error);
    return null;
  }
}

async function getSelectedOrPublishedComponentSets(): Promise<ComponentSetEntry[]> {
  try {
    // Check if user has selected ComponentSet nodes
    const selection = figma.currentPage.selection;
    const selectedComponentSets: ComponentSetNode[] = [];
    
    for (const node of selection) {
      if (node.type === 'COMPONENT_SET') {
        selectedComponentSets.push(node as ComponentSetNode);
      }
    }
    
    if (selectedComponentSets.length > 0) {
      // Convert selected ComponentSets to ComponentSetEntry format
      const entries: ComponentSetEntry[] = [];
      
      for (const componentSet of selectedComponentSets) {
        // Get variants
        const variantNodes = componentSet.children.filter(
          child => child.type === 'COMPONENT'
        ) as ComponentNode[];
        
        const variants: ComponentVariant[] = [];
        for (const variantNode of variantNodes) {
          if (variantNode.key) { // Only published variants
            const variantInfo = await getVariantInfo(variantNode);
            variants.push(variantInfo);
          }
        }
        
        if (variants.length > 0) {
          const entry = await getComponentSetInfo(componentSet, variants);
          entries.push(entry);
        }
      }
      
      return entries;
    } else {
      // No selection, get all published ComponentSets
      return await getPublishedComponentsHierarchical();
    }
  } catch (error) {
    console.error('Error getting ComponentSets:', error);
    return [];
  }
}

function organizeVariantsByProperties(componentSetEntry: ComponentSetEntry): {
  yAxisProperty: string | null;
  xAxisProperty: string | null;
  hierarchy: Map<string, Map<string, ComponentVariant[]>>;
  otherProperties: string[];
} {
  const hierarchy = new Map<string, Map<string, ComponentVariant[]>>();
  const variantGroups = componentSetEntry.variantGroups;
  
  // Get first two groups as Y and X axes
  const yAxisProperty = variantGroups.length > 0 ? variantGroups[0].name : null;
  const xAxisProperty = variantGroups.length > 1 ? variantGroups[1].name : null;
  const otherProperties = variantGroups.slice(2).map(g => g.name);
  
  // Organize variants hierarchically
  for (const variant of componentSetEntry.variants) {
    const yValue = yAxisProperty ? (variant.variantProperties[yAxisProperty] || '') : '';
    const xValue = xAxisProperty ? (variant.variantProperties[xAxisProperty] || '') : '';
    
    if (!hierarchy.has(yValue)) {
      hierarchy.set(yValue, new Map<string, ComponentVariant[]>());
    }
    
    const xMap = hierarchy.get(yValue)!;
    if (!xMap.has(xValue)) {
      xMap.set(xValue, []);
    }
    
    xMap.get(xValue)!.push(variant);
  }
  
  return {
    yAxisProperty,
    xAxisProperty,
    hierarchy,
    otherProperties
  };
}

function createPropertyChip(propertyName: string, propertyValue: string): FrameNode {
  const chip = figma.createFrame();
  chip.name = `${propertyName}: ${propertyValue}`;
  chip.layoutMode = "HORIZONTAL";
  chip.primaryAxisSizingMode = "AUTO";
  chip.counterAxisSizingMode = "AUTO";
  chip.paddingLeft = 4;
  chip.paddingRight = 4;
  chip.paddingTop = 2;
  chip.paddingBottom = 2;
  chip.itemSpacing = 4;
  chip.fills = [{ type: "SOLID", color: { r: 0.89, g: 0.95, b: 0.99 } }]; // #E3F2FD
  chip.strokes = [{ type: "SOLID", color: { r: 0.13, g: 0.59, b: 0.95 } }]; // #2196F3
  chip.strokeWeight = 1;
  chip.cornerRadius = 4;
  
  const chipText = figma.createText();
  chipText.characters = `${propertyName}: ${propertyValue}`;
  chipText.fontName = { family: "Inter", style: "Regular" };
  chipText.fontSize = 9;
  chipText.fills = [{ type: "SOLID", color: { r: 0.13, g: 0.13, b: 0.13 } }];
  chip.appendChild(chipText);
  
  return chip;
}

async function createVariantThumbnail(variant: ComponentVariant): Promise<FrameNode | null> {
  try {
    // Find the variant component node
    const variantNode = await figma.getNodeByIdAsync(variant.id) as ComponentNode | null;
    if (!variantNode || variantNode.type !== 'COMPONENT') {
      return null;
    }
    
    // Create instance
    const instance = variantNode.createInstance();
    
    // Calculate size maintaining aspect ratio
    const targetWidth = 240;
    const targetHeight = 140;
    const aspectRatio = variantNode.width / variantNode.height;
    
    let width = targetWidth;
    let height = targetHeight;
    
    if (aspectRatio > targetWidth / targetHeight) {
      height = targetWidth / aspectRatio;
    } else {
      width = targetHeight * aspectRatio;
    }
    
    instance.resize(width, height);
    instance.layoutMode = "NONE";
    
    // Wrap in frame
    const thumbnailFrame = figma.createFrame();
    thumbnailFrame.name = "Thumbnail";
    thumbnailFrame.layoutMode = "NONE";
    thumbnailFrame.resize(width, height);
    thumbnailFrame.fills = [];
    thumbnailFrame.appendChild(instance);
    
    return thumbnailFrame;
  } catch (error) {
    console.error(`Error creating thumbnail for variant ${variant.name}:`, error);
    return null;
  }
}

async function findNoteFrame(componentName: string): Promise<FrameNode | null> {
  try {
    await figma.loadAllPagesAsync();
    const noteFrames = figma.root.findAll(node => 
      node.type === 'FRAME' && node.name === `NOTE_${componentName}`
    ) as FrameNode[];
    
    return noteFrames.length > 0 ? noteFrames[0] : null;
  } catch (error) {
    console.error(`Error finding NOTE frame for ${componentName}:`, error);
    return null;
  }
}

async function createComponentOutlineFrame(componentSetEntry: ComponentSetEntry): Promise<FrameNode | null> {
  try {
    // Load fonts
    await figma.loadFontAsync({ family: "Inter", style: "Regular" });
    await figma.loadFontAsync({ family: "Inter", style: "Medium" });
    await figma.loadFontAsync({ family: "Inter", style: "Bold" });
    
    // Organize variants
    const { yAxisProperty, xAxisProperty, hierarchy, otherProperties } = organizeVariantsByProperties(componentSetEntry);
    
    // Create main frame
    const frame = figma.createFrame();
    frame.name = `OUTLINE_${componentSetEntry.name}`;
    frame.layoutMode = "VERTICAL";
    frame.primaryAxisSizingMode = "AUTO";
    frame.counterAxisSizingMode = "AUTO";
    frame.paddingLeft = 16;
    frame.paddingRight = 16;
    frame.paddingTop = 16;
    frame.paddingBottom = 16;
    frame.itemSpacing = 12;
    frame.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
    frame.strokes = [{ type: "SOLID", color: { r: 0.85, g: 0.85, b: 0.85 } }];
    frame.strokeWeight = 1;
    frame.cornerRadius = 12;
    frame.effects = [{ type: "DROP_SHADOW", color: { r: 0, g: 0, b: 0, a: 0.1 }, offset: { x: 0, y: 2 }, radius: 8, spread: 0, visible: true, blendMode: "NORMAL" }];
    
    // Header section
    const headerFrame = figma.createFrame();
    headerFrame.name = "Header";
    headerFrame.layoutMode = "VERTICAL";
    headerFrame.primaryAxisSizingMode = "AUTO";
    headerFrame.counterAxisSizingMode = "AUTO";
    headerFrame.itemSpacing = 4;
    headerFrame.fills = [];
    
    // Component name
    const nameText = figma.createText();
    nameText.characters = componentSetEntry.name;
    nameText.fontName = { family: "Inter", style: "Bold" };
    nameText.fontSize = 14;
    nameText.fills = [{ type: "SOLID", color: { r: 0.1, g: 0.1, b: 0.1 } }];
    headerFrame.appendChild(nameText);
    
    // Key and ID
    const infoText = figma.createText();
    const keyText = componentSetEntry.key || "No Key";
    infoText.characters = `Key: ${keyText} | ID: ${componentSetEntry.id}`;
    infoText.fontName = { family: "Inter", style: "Regular" };
    infoText.fontSize = 10;
    infoText.fills = [{ type: "SOLID", color: { r: 0.5, g: 0.5, b: 0.5 } }];
    headerFrame.appendChild(infoText);
    
    // Outline info
    if (yAxisProperty || xAxisProperty) {
      const outlineInfoText = figma.createText();
      let outlineInfo = "Outline: ";
      if (yAxisProperty) outlineInfo += `Y: ${yAxisProperty}`;
      if (xAxisProperty) outlineInfo += `, X: ${xAxisProperty}`;
      outlineInfoText.characters = outlineInfo;
      outlineInfoText.fontName = { family: "Inter", style: "Regular" };
      outlineInfoText.fontSize = 10;
      outlineInfoText.fills = [{ type: "SOLID", color: { r: 0.4, g: 0.4, b: 0.4 } }];
      headerFrame.appendChild(outlineInfoText);
    }
    
    frame.appendChild(headerFrame);
    
    // Divider
    const divider = figma.createRectangle();
    divider.name = "Divider";
    divider.resize(200, 1);
    divider.fills = [{ type: "SOLID", color: { r: 0.88, g: 0.88, b: 0.88 } }];
    divider.constraints = { horizontal: "STRETCH", vertical: "MIN" };
    frame.appendChild(divider);
    
    // Content section
    const contentFrame = figma.createFrame();
    contentFrame.name = "Content";
    contentFrame.layoutMode = "VERTICAL";
    contentFrame.primaryAxisSizingMode = "AUTO";
    contentFrame.counterAxisSizingMode = "AUTO";
    contentFrame.itemSpacing = 8;
    contentFrame.fills = [];
    
    // Build hierarchy
    if (hierarchy.size > 0) {
      for (const [yValue, xMap] of hierarchy.entries()) {
        // Level 1: Y-axis group
        const yGroupFrame = figma.createFrame();
        yGroupFrame.name = `${yAxisProperty || 'Group'}: ${yValue}`;
        yGroupFrame.layoutMode = "VERTICAL";
        yGroupFrame.primaryAxisSizingMode = "AUTO";
        yGroupFrame.counterAxisSizingMode = "AUTO";
        yGroupFrame.paddingLeft = 0;
        yGroupFrame.itemSpacing = 6;
        yGroupFrame.fills = [];
        
        // Y-axis label with bullet
        const yLabelFrame = figma.createFrame();
        yLabelFrame.name = "Y Label";
        yLabelFrame.layoutMode = "HORIZONTAL";
        yLabelFrame.primaryAxisSizingMode = "AUTO";
        yLabelFrame.counterAxisSizingMode = "AUTO";
        yLabelFrame.itemSpacing = 6;
        yLabelFrame.fills = [];
        
        // Bullet
        const bullet = figma.createEllipse();
        bullet.resize(5, 5);
        bullet.fills = [{ type: "SOLID", color: { r: 0.1, g: 0.1, b: 0.1 } }];
        yLabelFrame.appendChild(bullet);
        
        // Y-axis text
        const yText = figma.createText();
        yText.characters = `${yAxisProperty || 'Group'}: ${yValue}`;
        yText.fontName = { family: "Inter", style: "Medium" };
        yText.fontSize = 12;
        yText.fills = [{ type: "SOLID", color: { r: 0.1, g: 0.1, b: 0.1 } }];
        yLabelFrame.appendChild(yText);
        
        yGroupFrame.appendChild(yLabelFrame);
        
        // Level 2: X-axis groups
        for (const [xValue, variants] of xMap.entries()) {
          const xGroupFrame = figma.createFrame();
          xGroupFrame.name = `${xAxisProperty || 'Subgroup'}: ${xValue}`;
          xGroupFrame.layoutMode = "VERTICAL";
          xGroupFrame.primaryAxisSizingMode = "AUTO";
          xGroupFrame.counterAxisSizingMode = "AUTO";
          xGroupFrame.paddingLeft = 16;
          xGroupFrame.itemSpacing = 4;
          xGroupFrame.fills = [];
          
          // X-axis label with bullet
          const xLabelFrame = figma.createFrame();
          xLabelFrame.name = "X Label";
          xLabelFrame.layoutMode = "HORIZONTAL";
          xLabelFrame.primaryAxisSizingMode = "AUTO";
          xLabelFrame.counterAxisSizingMode = "AUTO";
          xLabelFrame.itemSpacing = 6;
          xLabelFrame.fills = [];
          
          // Bullet
          const xBullet = figma.createEllipse();
          xBullet.resize(5, 5);
          xBullet.fills = [{ type: "SOLID", color: { r: 0.1, g: 0.1, b: 0.1 } }];
          xLabelFrame.appendChild(xBullet);
          
          // X-axis text
          const xText = figma.createText();
          xText.characters = `${xAxisProperty || 'Subgroup'}: ${xValue}`;
          xText.fontName = { family: "Inter", style: "Medium" };
          xText.fontSize = 11;
          xText.fills = [{ type: "SOLID", color: { r: 0.1, g: 0.1, b: 0.1 } }];
          xLabelFrame.appendChild(xText);
          
          xGroupFrame.appendChild(xLabelFrame);
          
          // Level 3: Variant rows
          for (const variant of variants) {
            const variantRowFrame = figma.createFrame();
            variantRowFrame.name = `Variant: ${variant.name}`;
            variantRowFrame.layoutMode = "HORIZONTAL";
            variantRowFrame.primaryAxisSizingMode = "AUTO";
            variantRowFrame.counterAxisSizingMode = "AUTO";
            variantRowFrame.paddingLeft = 32;
            variantRowFrame.itemSpacing = 8;
            variantRowFrame.fills = [];
            
            // Bullet
            const variantBullet = figma.createEllipse();
            variantBullet.resize(4, 4);
            variantBullet.fills = [{ type: "SOLID", color: { r: 0.3, g: 0.3, b: 0.3 } }];
            variantRowFrame.appendChild(variantBullet);
            
            // Variant name
            const variantNameText = figma.createText();
            variantNameText.characters = variant.name;
            variantNameText.fontName = { family: "Inter", style: "Regular" };
            variantNameText.fontSize = 11;
            variantNameText.fills = [{ type: "SOLID", color: { r: 0.1, g: 0.1, b: 0.1 } }];
            variantRowFrame.appendChild(variantNameText);
            
            // Chips for other properties
            for (const propName of otherProperties) {
              const propValue = variant.variantProperties[propName];
              if (propValue) {
                const chip = createPropertyChip(propName, propValue);
                variantRowFrame.appendChild(chip);
              }
            }
            
            // Optional thumbnail
            const thumbnail = await createVariantThumbnail(variant);
            if (thumbnail) {
              variantRowFrame.appendChild(thumbnail);
            }
            
            xGroupFrame.appendChild(variantRowFrame);
          }
          
          yGroupFrame.appendChild(xGroupFrame);
        }
        
        contentFrame.appendChild(yGroupFrame);
      }
    } else {
      // No variants, show message
      const noVariantsText = figma.createText();
      noVariantsText.characters = "— No variants —";
      noVariantsText.fontName = { family: "Inter", style: "Regular" };
      noVariantsText.fontSize = 11;
      noVariantsText.fills = [{ type: "SOLID", color: { r: 0.5, g: 0.5, b: 0.5 } }];
      contentFrame.appendChild(noVariantsText);
    }
    
    frame.appendChild(contentFrame);
    
    // Position frame
    const noteFrame = await findNoteFrame(componentSetEntry.name);
    if (noteFrame) {
      frame.x = noteFrame.x + noteFrame.width + 40;
      frame.y = noteFrame.y;
      const notePage = noteFrame.parent;
      if (notePage && notePage.type === 'PAGE') {
        notePage.appendChild(frame);
      } else {
        figma.currentPage.appendChild(frame);
      }
    } else {
      // Default position
      frame.x = 200;
      frame.y = 200;
      figma.currentPage.appendChild(frame);
    }
    
    return frame;
  } catch (error) {
    console.error(`Error creating outline frame for ${componentSetEntry.name}:`, error);
    return null;
  }
}

async function renderComponentOutlines(): Promise<void> {
  try {
    figma.ui.postMessage({ 
      type: 'status-update', 
      status: { message: 'Getting ComponentSets...', className: 'loading' } 
    });
    
    const componentSets = await getSelectedOrPublishedComponentSets();
    
    if (componentSets.length === 0) {
      figma.notify("No ComponentSets found.");
      figma.ui.postMessage({ 
        type: 'enable-buttons',
        status: { message: 'No ComponentSets found', className: 'error' }
      });
      return;
    }
    
    // Load fonts once
    await figma.loadFontAsync({ family: "Inter", style: "Regular" });
    await figma.loadFontAsync({ family: "Inter", style: "Medium" });
    await figma.loadFontAsync({ family: "Inter", style: "Bold" });
    
    figma.ui.postMessage({ 
      type: 'status-update', 
      status: { message: `Rendering ${componentSets.length} outline(s)...`, className: 'loading' } 
    });
    
    const createdFrames: FrameNode[] = [];
    let successCount = 0;
    
    for (let i = 0; i < componentSets.length; i++) {
      const componentSet = componentSets[i];
      const frame = await createComponentOutlineFrame(componentSet);
      
      if (frame) {
        createdFrames.push(frame);
        successCount++;
      }
      
      if ((i + 1) % 5 === 0 || i === componentSets.length - 1) {
        figma.ui.postMessage({ 
          type: 'status-update', 
          status: { message: `Rendering ${i + 1}/${componentSets.length} outline(s)...`, className: 'loading' } 
        });
      }
    }
    
    if (createdFrames.length > 0) {
      figma.currentPage.selection = createdFrames;
      figma.viewport.scrollAndZoomIntoView(createdFrames);
      
      figma.notify(`Created ${successCount} outline frame(s).`);
      figma.ui.postMessage({ 
        type: 'enable-buttons',
        status: { message: `Created ${successCount} outline frame(s)`, className: 'success' }
      });
    } else {
      figma.notify("Failed to create outline frames.");
      figma.ui.postMessage({ 
        type: 'enable-buttons',
        status: { message: 'Failed to create outlines', className: 'error' }
      });
    }
  } catch (error) {
    console.error('Error rendering component outlines:', error);
    figma.notify('An error occurred while rendering outlines.');
    figma.ui.postMessage({ 
      type: 'enable-buttons',
      status: { message: 'Error occurred', className: 'error' }
    });
  }
}

async function scanMetadataFromStageNotes(): Promise<Map<string, ComponentMetadata>> {
  try {
    await figma.loadAllPagesAsync();
    
    // Find all frames with names starting with "NOTE_"
    const allFrames = figma.root.findAll(node => 
      node.type === 'FRAME' && node.name.startsWith('NOTE_')
    ) as FrameNode[];
    
    console.log(`Found ${allFrames.length} Stage Note frames`);
    
    const metadataMap = new Map<string, ComponentMetadata>();
    
    // Placeholder texts for comparison
    const placeholders: { [key: string]: string } = {
      'Component Description': 'Enter component description (optional)',
      'Content Notes': 'Enter content notes (optional)',
      'Dev Notes': 'Enter dev notes (optional)',
      'Design Notes': 'Enter design notes (optional)',
      'Product Notes': 'Enter product notes (optional)'
    };
    
    for (const frame of allFrames) {
      try {
        // Extract component name from frame name (remove "NOTE_" prefix)
        const componentName = frame.name.replace(/^NOTE_/, '');
        
        // Find the "Metadata" child frame
        const metadataFrame = frame.children.find(
          child => child.type === 'FRAME' && child.name === 'Metadata'
        ) as FrameNode | undefined;
        
        if (!metadataFrame) {
          console.warn(`No Metadata frame found in Stage Note: ${frame.name}`);
          continue;
        }
        
        const metadata: ComponentMetadata = {};
        
        // Find each metadata field frame
        const fieldNames = ['Component Description', 'Content Notes', 'Dev Notes', 'Design Notes', 'Product Notes'];
        
        for (const fieldName of fieldNames) {
          const fieldFrame = metadataFrame.children.find(
            child => child.type === 'FRAME' && child.name === fieldName
          ) as FrameNode | undefined;
          
          if (fieldFrame) {
            // Find the TextNode (the editable text field - second child after label)
            const textNodes = fieldFrame.children.filter(child => child.type === 'TEXT') as TextNode[];
            if (textNodes.length > 0) {
              // The editable text field should be the last TextNode (after the label)
              const textField = textNodes[textNodes.length - 1];
              const textContent = textField.characters.trim();
              const placeholder = placeholders[fieldName];
              
              // Only extract if it's different from placeholder and not empty
              if (textContent && textContent !== placeholder) {
                // Map field name to metadata property name
                if (fieldName === 'Component Description') {
                  metadata.componentDescription = textContent;
                } else if (fieldName === 'Content Notes') {
                  metadata.contentNotes = textContent;
                } else if (fieldName === 'Dev Notes') {
                  metadata.devNotes = textContent;
                } else if (fieldName === 'Design Notes') {
                  metadata.designNotes = textContent;
                } else if (fieldName === 'Product Notes') {
                  metadata.productNotes = textContent;
                }
              }
            }
          }
        }
        
        // Only add to map if we found at least one non-empty field
        if (Object.keys(metadata).length > 0) {
          metadataMap.set(componentName, metadata);
          console.log(`Extracted metadata from Stage Note: ${componentName}`, metadata);
        }
      } catch (error) {
        console.error(`Error processing Stage Note frame ${frame.name}:`, error);
      }
    }
    
    console.log(`Successfully scanned metadata from ${metadataMap.size} Stage Notes`);
    return metadataMap;
  } catch (error) {
    console.error('Error scanning metadata from Stage Notes:', error);
    return new Map<string, ComponentMetadata>();
  }
}

async function createMetadataFrame(componentSetEntry: ComponentSetEntry): Promise<FrameNode | null> {
  try {
    // Find the component node in the document
    const componentNode = await findNodeById(componentSetEntry.id);
    if (!componentNode) {
      console.warn(`Component node not found for ID: ${componentSetEntry.id}`);
      return null;
    }
    
    // Debug: Log instance information
    if (componentSetEntry.instances && componentSetEntry.instances.length > 0) {
      console.log(`Creating metadata frame for "${componentSetEntry.name}" with ${componentSetEntry.instances.length} instances`);
    } else {
      console.log(`Creating metadata frame for "${componentSetEntry.name}" with no instances`);
    }

    // Load fonts
    await figma.loadFontAsync({ family: "Inter", style: "Regular" });
    await figma.loadFontAsync({ family: "Inter", style: "Bold" });
    await figma.loadFontAsync({ family: "Inter", style: "Medium" });

    // Create main frame with Auto Layout
    const frame = figma.createFrame();
    frame.name = `NOTE_${componentSetEntry.name}`;
    frame.layoutMode = "VERTICAL";
    frame.primaryAxisSizingMode = "AUTO";
    frame.counterAxisSizingMode = "AUTO";
    frame.paddingLeft = 16;
    frame.paddingRight = 16;
    frame.paddingTop = 16;
    frame.paddingBottom = 16;
    frame.itemSpacing = 12;
    frame.fills = [{ type: "SOLID", color: { r: 0.94, g: 0.94, b: 0.94 } } ];
    frame.strokes = [{ type: "SOLID", color: { r: 0.8, g: 0.8, b: 0.8 } } ];
    frame.strokeWeight = 1;
    frame.cornerRadius = 8;

    // Header Section
    const headerFrame = figma.createFrame();
    headerFrame.name = "Header";
    headerFrame.layoutMode = "VERTICAL";
    headerFrame.primaryAxisSizingMode = "AUTO";
    headerFrame.counterAxisSizingMode = "AUTO";
    headerFrame.itemSpacing = 4;
    headerFrame.fills = [];

    // Component name (bold, larger)
    const nameText = figma.createText();
    nameText.characters = componentSetEntry.name;
    nameText.fontName = { family: "Inter", style: "Bold" };
    nameText.fontSize = 18;
    nameText.fills = [{ type: "SOLID", color: { r: 0.1, g: 0.1, b: 0.1 } }];
    headerFrame.appendChild(nameText);

    // Key and ID (smaller text)
    const infoText = figma.createText();
    const keyText = componentSetEntry.key || "No Key";
    infoText.characters = `Key: ${keyText} | ID: ${componentSetEntry.id}`;
    infoText.fontName = { family: "Inter", style: "Regular" };
    infoText.fontSize = 11;
    infoText.fills = [{ type: "SOLID", color: { r: 0.5, g: 0.5, b: 0.5 } }];
    headerFrame.appendChild(infoText);

    frame.appendChild(headerFrame);

    // Separator line - will be sized by Auto Layout
    const separator = figma.createRectangle();
    separator.name = "Separator";
    separator.resize(250, 1);
    separator.fills = [{ type: "SOLID", color: { r: 0.7, g: 0.7, b: 0.7 } }];
    // Set constraints to stretch horizontally
    separator.constraints = { horizontal: "STRETCH", vertical: "MIN" };
    frame.appendChild(separator);

    // Variants Section (if ComponentSet has variants)
    if (componentSetEntry.variants.length > 1 || (componentSetEntry.variants.length === 1 && componentSetEntry.variantGroups.length > 0)) {
      const variantsFrame = figma.createFrame();
      variantsFrame.name = "Variants";
      variantsFrame.layoutMode = "VERTICAL";
      variantsFrame.primaryAxisSizingMode = "AUTO";
      variantsFrame.counterAxisSizingMode = "AUTO";
      variantsFrame.itemSpacing = 8;
      variantsFrame.paddingLeft = 8;
      variantsFrame.paddingRight = 8;
      variantsFrame.paddingTop = 8;
      variantsFrame.paddingBottom = 8;
      variantsFrame.fills = [{ type: "SOLID", color: { r: 0.97, g: 0.97, b: 0.97 } }];
      variantsFrame.cornerRadius = 4;

      // Variants label
      const variantsLabel = figma.createText();
      variantsLabel.characters = "Variants:";
      variantsLabel.fontName = { family: "Inter", style: "Medium" };
      variantsLabel.fontSize = 12;
      variantsLabel.fills = [{ type: "SOLID", color: { r: 0.2, g: 0.2, b: 0.2 } }];
      variantsFrame.appendChild(variantsLabel);

      // List variants
      for (const variant of componentSetEntry.variants) {
        const variantItemFrame = figma.createFrame();
        variantItemFrame.name = `Variant: ${variant.name}`;
        variantItemFrame.layoutMode = "VERTICAL";
        variantItemFrame.primaryAxisSizingMode = "AUTO";
        variantItemFrame.counterAxisSizingMode = "AUTO";
        variantItemFrame.itemSpacing = 2;
        variantItemFrame.paddingLeft = 8;
        variantItemFrame.paddingRight = 8;
        variantItemFrame.paddingTop = 4;
        variantItemFrame.paddingBottom = 4;
        variantItemFrame.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
        variantItemFrame.cornerRadius = 2;

        // Variant name
        const variantNameText = figma.createText();
        variantNameText.characters = variant.name;
        variantNameText.fontName = { family: "Inter", style: "Medium" };
        variantNameText.fontSize = 11;
        variantNameText.fills = [{ type: "SOLID", color: { r: 0.3, g: 0.3, b: 0.3 } }];
        variantItemFrame.appendChild(variantNameText);

        // Variant properties
        if (Object.keys(variant.variantProperties).length > 0) {
          const propsText = figma.createText();
          const propsArray: string[] = [];
          for (const key in variant.variantProperties) {
            if (variant.variantProperties.hasOwnProperty(key)) {
              propsArray.push(`${key}: ${variant.variantProperties[key]}`);
            }
          }
          propsText.characters = propsArray.join(" | ");
          propsText.fontName = { family: "Inter", style: "Regular" };
          propsText.fontSize = 10;
          propsText.fills = [{ type: "SOLID", color: { r: 0.5, g: 0.5, b: 0.5 } }];
          variantItemFrame.appendChild(propsText);
        }

        variantsFrame.appendChild(variantItemFrame);
      }

      frame.appendChild(variantsFrame);
    }

    // Component Outline Section
    const { yAxisProperty, xAxisProperty, hierarchy, otherProperties } = organizeVariantsByProperties(componentSetEntry);
    
    if (hierarchy.size > 0) {
      const outlineFrame = figma.createFrame();
      outlineFrame.name = "Component Outline";
      outlineFrame.layoutMode = "VERTICAL";
      outlineFrame.primaryAxisSizingMode = "AUTO";
      outlineFrame.counterAxisSizingMode = "AUTO";
      outlineFrame.itemSpacing = 8;
      outlineFrame.paddingLeft = 8;
      outlineFrame.paddingRight = 8;
      outlineFrame.paddingTop = 8;
      outlineFrame.paddingBottom = 8;
      outlineFrame.fills = [{ type: "SOLID", color: { r: 0.98, g: 0.98, b: 0.98 } }];
      outlineFrame.cornerRadius = 4;

      // Outline label
      const outlineLabel = figma.createText();
      outlineLabel.characters = "Component Outline:";
      outlineLabel.fontName = { family: "Inter", style: "Medium" };
      outlineLabel.fontSize = 12;
      outlineLabel.fills = [{ type: "SOLID", color: { r: 0.2, g: 0.2, b: 0.2 } }];
      outlineFrame.appendChild(outlineLabel);

      // Build hierarchy
      for (const [yValue, xMap] of hierarchy.entries()) {
        // Level 1: Y-axis group
        const yGroupFrame = figma.createFrame();
        yGroupFrame.name = `${yAxisProperty || 'Group'}: ${yValue}`;
        yGroupFrame.layoutMode = "VERTICAL";
        yGroupFrame.primaryAxisSizingMode = "AUTO";
        yGroupFrame.counterAxisSizingMode = "AUTO";
        yGroupFrame.paddingLeft = 0;
        yGroupFrame.itemSpacing = 6;
        yGroupFrame.fills = [];

        // Y-axis label with bullet
        const yLabelFrame = figma.createFrame();
        yLabelFrame.name = "Y Label";
        yLabelFrame.layoutMode = "HORIZONTAL";
        yLabelFrame.primaryAxisSizingMode = "AUTO";
        yLabelFrame.counterAxisSizingMode = "AUTO";
        yLabelFrame.itemSpacing = 6;
        yLabelFrame.fills = [];

        // Bullet
        const bullet = figma.createEllipse();
        bullet.resize(5, 5);
        bullet.fills = [{ type: "SOLID", color: { r: 0.1, g: 0.1, b: 0.1 } }];
        yLabelFrame.appendChild(bullet);

        // Y-axis text
        const yText = figma.createText();
        yText.characters = `${yAxisProperty || 'Group'}: ${yValue}`;
        yText.fontName = { family: "Inter", style: "Medium" };
        yText.fontSize = 12;
        yText.fills = [{ type: "SOLID", color: { r: 0.1, g: 0.1, b: 0.1 } }];
        yLabelFrame.appendChild(yText);

        yGroupFrame.appendChild(yLabelFrame);

        // Level 2: X-axis groups
        for (const [xValue, variants] of xMap.entries()) {
          const xGroupFrame = figma.createFrame();
          xGroupFrame.name = `${xAxisProperty || 'Subgroup'}: ${xValue}`;
          xGroupFrame.layoutMode = "VERTICAL";
          xGroupFrame.primaryAxisSizingMode = "AUTO";
          xGroupFrame.counterAxisSizingMode = "AUTO";
          xGroupFrame.paddingLeft = 16;
          xGroupFrame.itemSpacing = 4;
          xGroupFrame.fills = [];

          // X-axis label with bullet
          const xLabelFrame = figma.createFrame();
          xLabelFrame.name = "X Label";
          xLabelFrame.layoutMode = "HORIZONTAL";
          xLabelFrame.primaryAxisSizingMode = "AUTO";
          xLabelFrame.counterAxisSizingMode = "AUTO";
          xLabelFrame.itemSpacing = 6;
          xLabelFrame.fills = [];

          // Bullet
          const xBullet = figma.createEllipse();
          xBullet.resize(5, 5);
          xBullet.fills = [{ type: "SOLID", color: { r: 0.1, g: 0.1, b: 0.1 } }];
          xLabelFrame.appendChild(xBullet);

          // X-axis text
          const xText = figma.createText();
          xText.characters = `${xAxisProperty || 'Subgroup'}: ${xValue}`;
          xText.fontName = { family: "Inter", style: "Medium" };
          xText.fontSize = 11;
          xText.fills = [{ type: "SOLID", color: { r: 0.1, g: 0.1, b: 0.1 } }];
          xLabelFrame.appendChild(xText);

          xGroupFrame.appendChild(xLabelFrame);

          // Level 3: Variant rows
          for (const variant of variants) {
            const variantRowFrame = figma.createFrame();
            variantRowFrame.name = `Variant: ${variant.name}`;
            variantRowFrame.layoutMode = "HORIZONTAL";
            variantRowFrame.primaryAxisSizingMode = "AUTO";
            variantRowFrame.counterAxisSizingMode = "AUTO";
            variantRowFrame.paddingLeft = 32;
            variantRowFrame.itemSpacing = 8;
            variantRowFrame.fills = [];

            // Bullet
            const variantBullet = figma.createEllipse();
            variantBullet.resize(4, 4);
            variantBullet.fills = [{ type: "SOLID", color: { r: 0.3, g: 0.3, b: 0.3 } }];
            variantRowFrame.appendChild(variantBullet);

            // Variant name
            const variantNameText = figma.createText();
            variantNameText.characters = variant.name;
            variantNameText.fontName = { family: "Inter", style: "Regular" };
            variantNameText.fontSize = 11;
            variantNameText.fills = [{ type: "SOLID", color: { r: 0.1, g: 0.1, b: 0.1 } }];
            variantRowFrame.appendChild(variantNameText);

            // Chips for other properties
            for (const propName of otherProperties) {
              const propValue = variant.variantProperties[propName];
              if (propValue) {
                const chip = createPropertyChip(propName, propValue);
                variantRowFrame.appendChild(chip);
              }
            }

            // Optional thumbnail (disabled - uncomment to re-enable)
            // const thumbnail = await createVariantThumbnail(variant);
            // if (thumbnail) {
            //   variantRowFrame.appendChild(thumbnail);
            // }

            xGroupFrame.appendChild(variantRowFrame);
          }

          yGroupFrame.appendChild(xGroupFrame);
        }

        outlineFrame.appendChild(yGroupFrame);
      }

      frame.appendChild(outlineFrame);
    }

    // Metadata Fields Section
    const metadataFrame = figma.createFrame();
    metadataFrame.name = "Metadata";
    metadataFrame.layoutMode = "VERTICAL";
    metadataFrame.primaryAxisSizingMode = "AUTO";
    metadataFrame.counterAxisSizingMode = "AUTO";
    metadataFrame.itemSpacing = 10;
    metadataFrame.paddingLeft = 8;
    metadataFrame.paddingRight = 8;
    metadataFrame.paddingTop = 8;
    metadataFrame.paddingBottom = 8;
    metadataFrame.fills = [{ type: "SOLID", color: { r: 0.99, g: 0.99, b: 0.99 } }];
    metadataFrame.cornerRadius = 4;

    // Metadata label
    const metadataLabel = figma.createText();
    metadataLabel.characters = "Metadata:";
    metadataLabel.fontName = { family: "Inter", style: "Medium" };
    metadataLabel.fontSize = 12;
    metadataLabel.fills = [{ type: "SOLID", color: { r: 0.2, g: 0.2, b: 0.2 } }];
    metadataFrame.appendChild(metadataLabel);

    // Create metadata text fields
    const metadataFields = [
      { label: "Component Description", placeholder: "Enter component description (optional)" },
      { label: "Content Notes", placeholder: "Enter content notes (optional)" },
      { label: "Dev Notes", placeholder: "Enter dev notes (optional)" },
      { label: "Design Notes", placeholder: "Enter design notes (optional)" },
      { label: "Product Notes", placeholder: "Enter product notes (optional)" }
    ];

    for (const field of metadataFields) {
      const fieldFrame = figma.createFrame();
      fieldFrame.name = field.label;
      fieldFrame.layoutMode = "VERTICAL";
      fieldFrame.primaryAxisSizingMode = "AUTO";
      fieldFrame.counterAxisSizingMode = "AUTO";
      fieldFrame.itemSpacing = 4;

      // Field label
      const labelText = figma.createText();
      labelText.characters = `${field.label} (optional):`;
      labelText.fontName = { family: "Inter", style: "Regular" };
      labelText.fontSize = 10;
      labelText.fills = [{ type: "SOLID", color: { r: 0.4, g: 0.4, b: 0.4 } }];
      fieldFrame.appendChild(labelText);

      // Editable text field
      const fieldText = figma.createText();
      fieldText.characters = field.placeholder;
      fieldText.fontName = { family: "Inter", style: "Regular" };
      fieldText.fontSize = 11;
      fieldText.fills = [{ type: "SOLID", color: { r: 0.6, g: 0.6, b: 0.6 } }];
      // Make it editable by setting textAutoResize
      fieldText.textAutoResize = "HEIGHT";
      fieldText.resize(250, 20);
      // Set horizontal constraint to stretch within the frame
      fieldText.constraints = { horizontal: "STRETCH", vertical: "MIN" };
      fieldFrame.appendChild(fieldText);

      metadataFrame.appendChild(fieldFrame);
    }

    frame.appendChild(metadataFrame);

    // Add frame to the same page as the component first (so width is calculated)
    const componentPage = componentNode.parent;
    if (componentPage && componentPage.type === 'PAGE') {
      componentPage.appendChild(frame);
    } else {
      figma.currentPage.appendChild(frame);
    }

    // Position frame 40px to the left of component, top-aligned
    // Now that frame is in the document, its width is calculated
    frame.x = componentNode.x - frame.width - 40;
    frame.y = componentNode.y;

    return frame;
  } catch (error) {
    console.error(`Error creating metadata frame for ${componentSetEntry.name}:`, error);
    return null;
  }
}

async function createMetadataFrames(): Promise<void> {
  try {
    const componentSetEntries = await getPublishedComponentsHierarchical();
    
    if (componentSetEntries.length === 0) {
      figma.notify("No published components found.");
      figma.ui.postMessage({ 
        type: 'enable-buttons',
        status: { message: 'No published components found', className: 'error' }
      });
      return;
    }

    // Send status update
    figma.ui.postMessage({ 
      type: 'status-update', 
      status: { message: `Creating metadata frames...`, className: 'loading' } 
    });

    const createdFrames: FrameNode[] = [];
    let successCount = 0;

    for (let i = 0; i < componentSetEntries.length; i++) {
      const entry = componentSetEntries[i];
      const frame = await createMetadataFrame(entry);
      
      if (frame) {
        createdFrames.push(frame);
        successCount++;
      }

      // Update progress
      if ((i + 1) % 5 === 0 || i === componentSetEntries.length - 1) {
        figma.ui.postMessage({ 
          type: 'status-update', 
          status: { message: `Creating ${i + 1}/${componentSetEntries.length} frames...`, className: 'loading' } 
        });
      }
    }

    if (createdFrames.length > 0) {
      // Select all created frames
      figma.currentPage.selection = createdFrames;
      figma.viewport.scrollAndZoomIntoView(createdFrames);
      
      figma.notify(`Created ${successCount} metadata frame(s).`);
      figma.ui.postMessage({ 
        type: 'enable-buttons',
        status: { message: `Created ${successCount} metadata frame(s)`, className: 'success' }
      });
    } else {
      figma.notify("Failed to create metadata frames.");
      figma.ui.postMessage({ 
        type: 'enable-buttons',
        status: { message: 'Failed to create frames', className: 'error' }
      });
    }
  } catch (error) {
    console.error('Error creating metadata frames:', error);
    figma.notify('An error occurred while creating metadata frames.');
    figma.ui.postMessage({ 
      type: 'enable-buttons',
      status: { message: 'Error occurred', className: 'error' }
    });
  }
}

async function createTextFieldOnStage(components: ComponentInfo[]): Promise<void> {
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
            const variantProps: string[] = [];
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
    await figma.loadFontAsync({ family: "Inter", style: "Regular" });
    textNode.characters = textContent;
    
    // Position the text node in the center of the viewport
    const { x, y } = figma.viewport.center;
    textNode.x = x - (textNode.width / 2);
    textNode.y = y - (textNode.height / 2);

    // Select the created text node
    figma.currentPage.selection = [textNode];
    figma.viewport.scrollAndZoomIntoView([textNode]);

    figma.notify(`Created text field with ${components.length} published components.`);
  } catch (error) {
    console.error('Error creating text field:', error);
    figma.notify('Failed to create text field.');
    throw error;
  }
}

// Listen for messages from the UI
figma.ui.onmessage = async (msg) => {
  if (msg.type === 'show-published') {
    try {
      await createMetadataFrames();
    } catch (error) {
      figma.ui.postMessage({ 
        type: 'enable-buttons',
        status: { message: 'Failed to create metadata frames', className: 'error' }
      });
    }
  } else if (msg.type === 'scan-metadata') {
    try {
      figma.ui.postMessage({ 
        type: 'status-update', 
        status: { message: 'Scanning metadata from Stage Notes...', className: 'loading' } 
      });
      
      const metadataMap = await scanMetadataFromStageNotes();
      
      if (metadataMap.size > 0) {
        figma.notify(`Scanned metadata from ${metadataMap.size} Stage Note(s).`);
        figma.ui.postMessage({ 
          type: 'enable-buttons',
          status: { message: `Scanned ${metadataMap.size} Stage Note(s)`, className: 'success' }
        });
      } else {
        figma.notify("No Stage Notes found or no metadata entered.");
        figma.ui.postMessage({ 
          type: 'enable-buttons',
          status: { message: 'No Stage Notes found', className: 'error' }
        });
      }
    } catch (error) {
      console.error('Error scanning metadata:', error);
      figma.notify('An error occurred while scanning metadata.');
      figma.ui.postMessage({ 
        type: 'enable-buttons',
        status: { message: 'Scan failed', className: 'error' }
      });
    }
  } else if (msg.type === 'copy-published') {
    const componentSetEntries = await getPublishedComponentsHierarchical();
    
    if (componentSetEntries.length > 0) {
      // Use hierarchical structure directly
      const jsonString = JSON.stringify(componentSetEntries, null, 2);
      
      // Calculate total variant count for notification
      const totalVariants = componentSetEntries.reduce((sum, entry) => sum + entry.variants.length, 0);
      
      // Send JSON to UI to copy to clipboard
      figma.ui.postMessage({ 
        type: 'copy-to-clipboard', 
        data: jsonString,
        count: totalVariants
      });
    } else {
      // Re-enable buttons if no components found
      figma.ui.postMessage({ 
        type: 'enable-buttons'
      });
    }
  } else if (msg.type === 'copy-success') {
    const count = msg.count || 0;
    figma.notify(`Copied ${count} published components to clipboard.`);
    figma.ui.postMessage({ 
      type: 'enable-buttons',
      status: { message: `Copied ${count} components!`, className: 'success' }
    });
  } else if (msg.type === 'copy-error') {
    figma.notify('Failed to copy to clipboard.');
    figma.ui.postMessage({ 
      type: 'enable-buttons',
      status: { message: 'Copy failed', className: 'error' }
    });
  } else if (msg.type === 'download-json') {
    const componentSetEntries = await getPublishedComponentsHierarchical();
    
    if (componentSetEntries.length > 0) {
      // Use hierarchical structure directly
      const jsonString = JSON.stringify(componentSetEntries, null, 2);
      
      // Calculate total variant count for notification
      const totalVariants = componentSetEntries.reduce((sum, entry) => sum + entry.variants.length, 0);
      
      // Send JSON to UI to download
      figma.ui.postMessage({ 
        type: 'download-json', 
        data: jsonString,
        count: totalVariants
      });
    } else {
      // Re-enable buttons if no components found
      figma.ui.postMessage({ 
        type: 'enable-buttons'
      });
    }
  } else if (msg.type === 'download-success') {
    const count = msg.count || 0;
    figma.notify(`Downloaded ${count} published components as JSON file.`);
    figma.ui.postMessage({ 
      type: 'enable-buttons',
      status: { message: `Downloaded ${count} components!`, className: 'success' }
    });
  }
}; 