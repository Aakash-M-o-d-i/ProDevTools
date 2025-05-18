
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Save, Download, RefreshCw } from "lucide-react";

/**
 Interface for mind map node structure
 Represents a node in the mind map with ID, content, and children
 */
interface MindMapNode {
  id: string;
  content: string;
  children: MindMapNode[];
  x?: number;
  y?: number;
  color?: string;
}

/**
 MindMapPage Component
  
 A visual mind map builder that allows users to create
 hierarchical mind maps with expandable nodes.
 */
const MindMapPage = () => {
  // Toast notifications for user feedback
  const { toast } = useToast();
  
  // Reference for the canvas element
  const canvasRef = useRef<HTMLDivElement>(null);
  
  // State for root node of the mind map
  // This node serves as the central idea of the mind map
  // and can have multiple child nodes
  const [rootNode, setRootNode] = useState<MindMapNode>(() => {
    const savedMindMap = localStorage.getItem("mindMap");
    return savedMindMap 
      ? JSON.parse(savedMindMap) 
      : { id: "root", content: "Central Idea", children: [], x: 0, y: 0, color: "#9b87f5" };
  });
  
  // Node being edited (if any)
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  
  // Content of node being edited
  const [editNodeContent, setEditNodeContent] = useState<string>("");
  
  // Available colors for nodes
  const nodeColors = [
    "#9b87f5", // primary purple
    "#FFDEE2", // pink
    "#E5DEFF", // purple
    "#D3E4FD", // blue
    "#F2FCE2", // green
    "#FEF7CD", // yellow
  ];
  
  // Zoom level for the mind map
  const [zoom, setZoom] = useState(1);
  
  // Canvas offset for panning
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  
  // Panning state
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  
  // Save mind map to local storage when it changes
  useEffect(() => {
    localStorage.setItem("mindMap", JSON.stringify(rootNode));
  }, [rootNode]);
  
  // Layout the mind map when it changes or when canvas size changes
  useEffect(() => {
    layoutMindMap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rootNode, canvasRef.current?.clientWidth, canvasRef.current?.clientHeight]);
  
  // Calculate node positions for the mind map layout 
  // This function positions the root node at the center of the canvas
  // and arranges child nodes in a circular pattern around it.
  const layoutMindMap = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const centerX = canvas.clientWidth / 2;
    const centerY = canvas.clientHeight / 2;
    
    // Position root node at center
    const updatedRoot = { ...rootNode, x: centerX, y: centerY };
    
    // Position children around the root
    layoutChildren(updatedRoot, 0, 200);
    
    setRootNode(updatedRoot);
  };
  
  // Recursively layout children of a node
  // This function calculates the position of each child node
  // based on the angle and distance from the parent node.
  const layoutChildren = (node: MindMapNode, angle: number, distance: number) => {
    if (!node.children || node.children.length === 0) return;
    
    const nodeX = node.x || 0;
    const nodeY = node.y || 0;
    const angleStep = (Math.PI * 2) / node.children.length;
    
    node.children.forEach((child, index) => {
      const childAngle = angle + index * angleStep;
      child.x = nodeX + Math.cos(childAngle) * distance;
      child.y = nodeY + Math.sin(childAngle) * distance;
      
      // Recursively layout grandchildren with smaller distance
      layoutChildren(child, childAngle, distance * 0.8);
    });
  };
  
  // Add a child node to a parent node 
  // This function creates a new node with random color
  // and adds it to the specified parent node.
  const addChildNode = (parentId: string) => {
    const newNodeId = `node-${Date.now()}`;
    const newNode: MindMapNode = {
      id: newNodeId,
      content: "New Idea",
      children: [],
      color: nodeColors[Math.floor(Math.random() * nodeColors.length)],
    };
    
    // Function to recursively find and update the parent node
    const addChildToNode = (node: MindMapNode): MindMapNode => {
      if (node.id === parentId) {
        return {
          ...node,
          children: [...node.children, newNode],
        };
      }
      
      return {
        ...node,
        children: node.children.map(addChildToNode),
      };
    };
    
    // Update the root node with the new child
    const updatedRoot = addChildToNode(rootNode);
    setRootNode(updatedRoot);
    
    // Start editing the new node
    setEditingNodeId(newNodeId);
    setEditNodeContent("New Idea");
    
    toast({
      title: "Node Added",
      description: "New node has been added to the mind map."
    });
  };
  
  // Delete a node from the mind map
  const deleteNode = (nodeId: string) => {
    if (nodeId === "root") {
      toast({
        title: "Cannot Delete Root",
        description: "The central idea cannot be deleted.",
        variant: "destructive",
      });
      return;
    }
    
    // Function to recursively filter out the node to delete
    const removeNodeFromTree = (node: MindMapNode): MindMapNode => {
      return {
        ...node,
        children: node.children
          .filter(child => child.id !== nodeId)
          .map(removeNodeFromTree),
      };
    };
    
    // Update the root node by removing the deleted node
    // and re-layout the mind map 
    const updatedRoot = removeNodeFromTree(rootNode);
    setRootNode(updatedRoot);
    
    toast({
      title: "Node Deleted",
      description: "Node has been removed from the mind map."
    });
  };
  
  // Start editing a node
  const editNode = (node: MindMapNode) => {
    setEditingNodeId(node.id);
    setEditNodeContent(node.content);
  };
  
  // Save changes to a node being edited
  const saveNodeEdit = () => {
    if (!editingNodeId) return;
    
    // Function to recursively find and update the edited node
    const updateNodeContent = (node: MindMapNode): MindMapNode => {
      if (node.id === editingNodeId) {
        return {
          ...node,
          content: editNodeContent,
        };
      }
      
      return {
        ...node,
        children: node.children.map(updateNodeContent),
      };
    };
    
    // Update the root node with the edited content
    const updatedRoot = updateNodeContent(rootNode);
    setRootNode(updatedRoot);
    
    // Exit editing mode
    setEditingNodeId(null);
    setEditNodeContent("");
    
    toast({
      title: "Node Updated",
      description: "Node content has been updated."
    });
  };
  
  // Reset the mind map to initial state
  const resetMindMap = () => {
    setRootNode({
      id: "root",
      content: "Central Idea",
      children: [],
      x: 0,
      y: 0,
      color: "#9b87f5",
    });
    
    setZoom(1);
    setOffset({ x: 0, y: 0 });
    
    toast({
      title: "Mind Map Reset",
      description: "Mind map has been reset to default."
    });
  };
  
  // Export the mind map as a JSON file
  const exportMindMap = () => {
    const dataStr = JSON.stringify(rootNode, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = "mindmap.json";
    
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
    
    toast({
      title: "Mind Map Exported",
      description: "Your mind map has been exported as JSON."
    });
  };
  
  // Start panning the canvas
  const startPanning = (e: React.MouseEvent) => {
    setIsPanning(true);
    setPanStart({ x: e.clientX, y: e.clientY });
  };
  
  // Pan the canvas while dragging
  const doPanning = (e: React.MouseEvent) => {
    if (!isPanning) return;
    
    setOffset({
      x: offset.x + (e.clientX - panStart.x),
      y: offset.y + (e.clientY - panStart.y),
    });
    
    setPanStart({ x: e.clientX, y: e.clientY });
  };
  
  // End panning
  const endPanning = () => {
    setIsPanning(false);
  };
  
  // Render a node and its children recursively
  const renderNode = (node: MindMapNode) => {
    const nodeSize = node.id === "root" ? 120 : 100;
    
    return (
      <div key={node.id} className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
        style={{
          left: `${node.x || 0}px`,
          top: `${node.y || 0}px`,
        }}
      >
        {/* Node content */}
        <div 
          className={`rounded-lg shadow-md p-2 min-w-[${nodeSize}px] max-w-[${nodeSize * 1.5}px] flex flex-col items-center justify-center text-center cursor-pointer ${node.id === "root" ? "font-bold" : ""}`}
          style={{ 
            backgroundColor: node.color || "#9b87f5",
            width: nodeSize,
            height: nodeSize,
            borderRadius: "50%",
          }}
          onClick={() => editNode(node)}
        >
          {editingNodeId === node.id ? (
            <Input
              value={editNodeContent}
              onChange={(e) => setEditNodeContent(e.target.value)}
              onBlur={saveNodeEdit}
              onKeyDown={(e) => e.key === "Enter" && saveNodeEdit()}
              className="w-full text-center"
              autoFocus
            />
          ) : (
            <div className="break-words">{node.content}</div>
          )}
        </div>
        
        {/* Action buttons */}
        <div className="flex space-x-1 mt-1">
          <Button
            size="icon"
            variant="outline"
            className="h-6 w-6"
            onClick={(e) => {
              e.stopPropagation();
              addChildNode(node.id);
            }}
          >
            <Plus className="h-3 w-3" />
          </Button>
          
          {node.id !== "root" && (
            <Button
              size="icon"
              variant="outline"
              className="h-6 w-6"
              onClick={(e) => {
                e.stopPropagation();
                deleteNode(node.id);
              }}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          )}
        </div>
        
        {/* Lines to children */}
        {node.children.map((child) => {
          const childX = child.x || 0;
          const childY = child.y || 0;
          const nodeX = node.x || 0;
          const nodeY = node.y || 0;
          
          return (
            <svg
              key={`line-${node.id}-${child.id}`}
              className="absolute top-0 left-0 pointer-events-none"
              style={{
                width: "100%",
                height: "100%",
              }}
            >
              <line
                x1={nodeX}
                y1={nodeY}
                x2={childX}
                y2={childY}
                stroke="#888"
                strokeWidth="2"
              />
            </svg>
          );
        })}
        
        {/* Render children nodes recursively */}
        {node.children.map(renderNode)}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Mind Map Builder</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setZoom(zoom + 0.1)}>
            Zoom In
          </Button>
          <Button variant="outline" onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}>
            Zoom Out
          </Button>
          <Button variant="outline" onClick={resetMindMap}>
            <RefreshCw className="h-4 w-4 mr-2" /> Reset
          </Button>
          <Button onClick={exportMindMap}>
            <Download className="h-4 w-4 mr-2" /> Export
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Mind Map Canvas</span>
            <span className="text-sm font-normal">
              Click on nodes to edit • Drag canvas to pan
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-hidden border rounded-md"
            style={{ height: "600px" }}
            ref={canvasRef}
            onMouseDown={startPanning}
            onMouseMove={doPanning}
            onMouseUp={endPanning}
            onMouseLeave={endPanning}
          >
            <div className="absolute w-full h-full"
              style={{
                transform: `scale(${zoom}) translate(${offset.x}px, ${offset.y}px)`,
                transformOrigin: "center",
                transition: "transform 0.1s ease-out",
              }}
            >
              {/* Render the root node and all its children */}
              {rootNode && renderNode(rootNode)}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How to Use</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Click on a node to edit its content</li>
            <li>Use the <span className="px-1 py-0.5 bg-muted rounded">+</span> button to add child nodes</li>
            <li>Use the <span className="px-1 py-0.5 bg-muted rounded">🗑️</span> button to delete nodes</li>
            <li>Drag the canvas to pan around the mind map</li>
            <li>Use the zoom buttons to adjust the view</li>
            <li>Export your mind map to save or share it</li>
          </ul>
          <p className="mt-4 text-sm text-muted-foreground">
            Mind maps help organize information visually to enhance creativity, problem-solving, and memory retention.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MindMapPage;
