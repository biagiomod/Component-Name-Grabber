"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
figma.showUI(`<script>window.close()</script>`, { visible: false });
function getComponentInfo(node) {
    return __awaiter(this, void 0, void 0, function* () {
        let key = null;
        let published = false;
        // Handle different node types
        if (node.type === 'COMPONENT' || node.type === 'COMPONENT_SET') {
            key = node.key || null;
            published = node.remote || false;
        }
        else if (node.type === 'INSTANCE') {
            // For instances, we need to check if they have a mainComponent
            try {
                const mainComponent = yield node.getMainComponentAsync();
                if (mainComponent) {
                    key = mainComponent.key || null;
                    published = mainComponent.remote || false;
                }
            }
            catch (error) {
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
    });
}
function formatComponentInfo(info) {
    const keyText = info.key ? info.key : 'No Key';
    const publishedText = info.published ? 'true' : 'false';
    return `${info.name} — Key: ${keyText} — ID: ${info.id} — Published: ${publishedText}`;
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Load all pages first to ensure we have access to the entire document
            yield figma.loadAllPagesAsync();
            // Find all components, component sets, and component instances in the document
            const allNodes = figma.root.findAll(node => node.type === "COMPONENT" ||
                node.type === "COMPONENT_SET" ||
                node.type === "INSTANCE");
            if (allNodes.length === 0) {
                figma.notify("No components found in this file.");
                figma.closePlugin();
                return;
            }
            // Gather information for each component
            const componentInfos = [];
            for (const node of allNodes) {
                try {
                    const info = yield getComponentInfo(node);
                    componentInfos.push(info);
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
                }
            }
            // Create formatted text content
            const textContent = componentInfos
                .map(info => formatComponentInfo(info))
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
            figma.notify(`Found ${componentInfos.length} components. Text node created on canvas.`);
            figma.closePlugin();
        }
        catch (error) {
            console.error('Plugin error:', error);
            figma.notify('An error occurred while scanning components.');
            figma.closePlugin();
        }
    });
}
// Run the main function
main();
