
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  ChevronDown, 
  ChevronRight, 
  Copy, 
  FileText, 
  RefreshCw,
  CheckCircle2, 
  XCircle
} from "lucide-react";

/**
 JsonViewerPage Component
  
  A JSON viewer/editor with collapsible nodes to visualize
  and edit JSON data structures.
 */
const JsonViewerPage = () => {
  // Toast notifications for user feedback
  const { toast } = useToast();
  
  // Input JSON string
  // This is the initial state with a sample JSON object
  const [jsonInput, setJsonInput] = useState<string>('{\n  "name": "John Doe",\n  "age": 30,\n  "isActive": true,\n  "address": {\n    "street": "123 Main St",\n    "city": "New York",\n    "zipCode": "10001"\n  },\n  "phoneNumbers": [\n    {\n      "type": "home",\n      "number": "212-555-1234"\n    },\n    {\n      "type": "work",\n      "number": "646-555-5678"\n    }\n  ],\n  "skills": ["programming", "design", "communication"]\n}');
  
  // Parsed JSON data
  // This will hold the parsed JSON object after validation
  const [parsedJson, setParsedJson] = useState<any>(null);
  
  // Error message for invalid JSON
  const [error, setError] = useState<string | null>(null);
  
  // Expanded nodes state (for collapsible view)
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  
  // Format the JSON input with proper indentation
  const formatJson = () => {
    try {
      // Parse JSON to ensure it's valid, then format with indentation
      // JSON.stringify with a replacer function to format the JSON
      // The second argument is null, and the third argument is 2 for 2 spaces indentation
      const parsed = JSON.parse(jsonInput);
      const formatted = JSON.stringify(parsed, null, 2);
      
      setJsonInput(formatted);
      setParsedJson(parsed);
      setError(null);
      
      toast({
        title: "JSON Formatted",
        description: "Your JSON has been formatted successfully."
      });
    } catch (e) {
      if (e instanceof Error) {
        setError(`Invalid JSON: ${e.message}`);
        setParsedJson(null);
        
        toast({
          title: "Invalid JSON",
          description: e.message,
          variant: "destructive",
        });
      }
    }
  };
  
  // Try to parse the JSON input
  const parseJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setParsedJson(parsed);
      setError(null);
      
      toast({
        title: "JSON Parsed",
        description: "Your JSON has been parsed successfully."
      });
    } catch (e) {
      if (e instanceof Error) {
        setError(`Invalid JSON: ${e.message}`);
        setParsedJson(null);
        
        toast({
          title: "Invalid JSON",
          description: e.message,
          variant: "destructive",
        });
      }
    }
  };
  
  // Reset the JSON input to an empty state
  const resetJson = () => {
    setJsonInput('');
    setParsedJson(null);
    setError(null);
    setExpandedNodes(new Set());
    
    toast({
      title: "Reset",
      description: "JSON editor has been reset."
    });
  };
  
  // Copy the JSON input to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(jsonInput);
    
    toast({
      title: "Copied",
      description: "JSON copied to clipboard."
    });
  };
  
  // Load sample JSON data
  const loadSample = () => {
    const sampleJson = '{\n  "name": "John Doe",\n  "age": 30,\n  "isActive": true,\n  "address": {\n    "street": "123 Main St",\n    "city": "New York",\n    "zipCode": "10001"\n  },\n  "phoneNumbers": [\n    {\n      "type": "home",\n      "number": "212-555-1234"\n    },\n    {\n      "type": "work",\n      "number": "646-555-5678"\n    }\n  ],\n  "skills": ["programming", "design", "communication"]\n}';
    
    setJsonInput(sampleJson);
    
    try {
      setParsedJson(JSON.parse(sampleJson));
      setError(null);
    } catch (e) {
      console.error("Error parsing sample JSON:", e);
    }
    
    toast({
      title: "Sample Loaded",
      description: "Sample JSON data has been loaded."
    });
  };
  
  // Toggle expanded state of a node
  const toggleNode = (path: string) => {
    const newExpandedNodes = new Set(expandedNodes);
    
    if (newExpandedNodes.has(path)) {
      newExpandedNodes.delete(path);
    } else {
      newExpandedNodes.add(path);
    }
    
    setExpandedNodes(newExpandedNodes);
  };
  
  // Render a JSON value with appropriate formatting
  const renderJsonValue = (value: any, path: string = "") => {
    if (value === null) {
      return <span className="text-gray-500">null</span>;
    }
    
    if (typeof value === "boolean") {
      return <span className="text-purple-600">{value.toString()}</span>;
    }
    
    if (typeof value === "number") {
      return <span className="text-blue-600">{value}</span>;
    }
    
    if (typeof value === "string") {
      return <span className="text-green-600">"{value}"</span>;
    }
    
    if (Array.isArray(value)) {
      const isExpanded = expandedNodes.has(path);
      
      return (
        <div>
          <div 
            className="cursor-pointer inline-flex items-center" 
            onClick={() => toggleNode(path)}
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
            <span className="ml-1">{`Array(${value.length})`}</span>
          </div>
          
          {isExpanded && (
            <div className="pl-4 border-l-2 border-gray-300 ml-2">
              {value.map((item, index) => (
                <div key={`${path}-${index}`} className="my-1">
                  <span className="text-gray-500 mr-2">{index}:</span>
                  {renderJsonValue(item, `${path}-${index}`)}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }
    
    // It's an object
    const isExpanded = expandedNodes.has(path);
    
    return (
      <div>
        <div 
          className="cursor-pointer inline-flex items-center" 
          onClick={() => toggleNode(path)}
        >
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
          <span className="ml-1">{`Object`}</span>
        </div>
        
        {isExpanded && (
          <div className="pl-4 border-l-2 border-gray-300 ml-2">
            {Object.entries(value).map(([key, propValue]) => (
              <div key={`${path}-${key}`} className="my-1">
                <span className="text-red-600 mr-2">"{key}":</span>
                {renderJsonValue(propValue, `${path}-${key}`)}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">JSON Viewer</h1>
        <div className="space-x-2">
          <Button variant="outline" onClick={copyToClipboard}>
            <Copy className="h-4 w-4 mr-2" /> Copy
          </Button>
          <Button variant="outline" onClick={formatJson}>
            Format JSON
          </Button>
          <Button variant="outline" onClick={resetJson}>
            <RefreshCw className="h-4 w-4 mr-2" /> Reset
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between">
              JSON Input
              <Button variant="ghost" size="sm" onClick={loadSample}>
                <FileText className="h-4 w-4 mr-1" /> Load Sample
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder="Paste your JSON here..."
              className="font-mono text-sm min-h-[500px]"
            />
            <div className="mt-4">
              <Button onClick={parseJson} className="w-full">
                Parse JSON
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              JSON Tree View
              {error ? (
                <XCircle className="ml-2 h-5 w-5 text-red-500" />
              ) : parsedJson ? (
                <CheckCircle2 className="ml-2 h-5 w-5 text-green-500" />
              ) : null}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-md min-h-[500px] overflow-auto">
              {error ? (
                <div className="text-red-500">{error}</div>
              ) : parsedJson ? (
                renderJsonValue(parsedJson, "root")
              ) : (
                <div className="text-muted-foreground">
                  Enter valid JSON and click "Parse JSON" to see the tree view
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>About JSON Viewer</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            JSON (JavaScript Object Notation) is a lightweight data-interchange format that is easy for humans to read and write and easy for machines to parse and generate. This tool helps you visualize, format, and validate JSON data.
          </p>
          <ul className="list-disc pl-5 mt-4 space-y-1 text-sm">
            <li>Click the chevron icons to expand or collapse objects and arrays</li>
            <li>Use "Format JSON" to properly indent your JSON</li>
            <li>Copy formatted JSON to clipboard with the "Copy" button</li>
            <li>Reset the editor to start fresh with "Reset"</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default JsonViewerPage;
