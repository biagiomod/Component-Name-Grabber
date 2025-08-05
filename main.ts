figma.showUI(`<script>window.close()</script>`, { visible: false });

interface ComponentInfo {
  name: string;
  key: string | null;
  id: string;
  published: boolean;
  type: 'COMPONENT' | 'COMPONENT_SET' | 'INSTANCE';
}

async function getComponentInfo(node: ComponentNode | ComponentSetNode | InstanceNode): Promise<ComponentInfo> {
  let key: string | null = null;
  let published: boolean = false;

  // Handle different node types
  if (node.type === 'COMPONENT' || node.type === 'COMPONENT_SET') {
    key = node.key || null;
    published = (node as any).remote || false;
  } else if (node.type === 'INSTANCE') {
    // For instances, we need to check if they have a mainComponent
    try {
      const mainComponent = await node.getMainComponentAsync();
      if (mainComponent) {
        key = mainComponent.key || null;
        published = (mainComponent as any).remote || false;
      }
    } catch (error) {
      console.error(`Error getting main component for instance ${node.name}:`, error);
    }
  }

  return {
    name: node.name,
    key: key,
    id: node.id,
    published: published,
    type: node.type
  };
}

function formatComponentInfo(info: ComponentInfo): string {
  const keyText = info.key ? info.key : 'No Key';
  const publishedText = info.published ? 'true' : 'false';
  return `${info.name} — Key: ${keyText} — ID: ${info.id} — Published: ${publishedText}`;
}

async function main() {
  try {
    // Load all pages first to ensure we have access to the entire document
    await figma.loadAllPagesAsync();
    
    // Find all components, component sets, and component instances in the document
    const allNodes = figma.root.findAll(node => 
      node.type === "COMPONENT" || 
      node.type === "COMPONENT_SET" || 
      node.type === "INSTANCE"
    ) as (ComponentNode | ComponentSetNode | InstanceNode)[];

    if (allNodes.length === 0) {
      figma.notify("No components found in this file.");
      figma.closePlugin();
      return;
    }

    // Gather information for each component
    const componentInfos: ComponentInfo[] = [];
    
    for (const node of allNodes) {
      try {
        const info = await getComponentInfo(node);
        componentInfos.push(info);
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
      }
    }

    // Create formatted text content
    const textContent = componentInfos
      .map(info => formatComponentInfo(info))
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

    figma.notify(`Found ${componentInfos.length} components. Text node created on canvas.`);
    figma.closePlugin();
  } catch (error) {
    console.error('Plugin error:', error);
    figma.notify('An error occurred while scanning components.');
    figma.closePlugin();
  }
}

// Run the main function
main(); 