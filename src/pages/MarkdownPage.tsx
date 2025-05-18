
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Eye, Save, Clock, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from 'react-markdown';

/**
 MarkdownPage Component
  
 A markdown editor and viewer that allows users to write,
 preview, and download markdown documents with word counting.
 */
const MarkdownPage = () => {
  // Toast notifications for user feedback
  const { toast } = useToast();
  
  // State for markdown content with localStorage persistence
  // Initialize markdown state with saved content or default text
  const [markdown, setMarkdown] = useState(() => {
    const savedText = localStorage.getItem("markdownText");
    return savedText || "# Welcome to Markdown Editor\n\nThis is a **bold** text, and this is an *italic* text.\n\n## Lists\n\n- Item 1\n- Item 2\n- Item 3\n\n## Code\n\n```\nconst greeting = 'Hello World!';\nconsole.log(greeting);\n```\n\n> This is a blockquote\n";
  });
  
  // State for word and character count
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  
  // State for tracking last save time
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Calculate word and character counts when markdown changes
  // This effect runs whenever the markdown state changes
  useEffect(() => {
    // Count characters
    const text = markdown.trim();
    setCharCount(text.length);
    
    // Count words by splitting on whitespace
    const words = text.split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  }, [markdown]);

  /**
   Save markdown content to localStorage
   */
  const handleSave = () => {
    localStorage.setItem("markdownText", markdown);
    setLastSaved(new Date());
    toast({
      title: "Saved",
      description: "Your markdown has been saved"
    });
  };

  /**
   Download markdown content as a file
   */
  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([markdown], { type: "text/markdown" });
    element.href = URL.createObjectURL(file);
    element.download = "document.md";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast({
      title: "Downloaded",
      description: "Your markdown has been downloaded"
    });
  };

  return (
    <div className="space-y-6">
      {/* Page header with actions */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Markdown Editor</h1>
        <div className="flex space-x-2">
          <Button onClick={handleSave} variant="outline">
            <Save className="h-4 w-4 mr-2" /> Save
          </Button>
          <Button onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" /> Download
          </Button>
        </div>
      </div>

      {/* Editor and preview area */}
      <div className="relative">
        <Tabs defaultValue="edit">
          {/* Tab header with stats */}
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="edit" className="flex items-center">
                <FileText className="h-4 w-4 mr-2" /> Edit
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center">
                <Eye className="h-4 w-4 mr-2" /> Preview
              </TabsTrigger>
            </TabsList>
            <div className="text-sm text-muted-foreground flex items-center">
              <div className="flex items-center mr-4">
                Words: {wordCount}
              </div>
              <div>
                Characters: {charCount}
              </div>
            </div>
          </div>
          
          {/* Editor and preview panels */}
          <Card className="min-h-[600px]">
            {/* Edit tab */}
            <TabsContent value="edit" className="m-0">
              <Textarea 
                className="h-[600px] p-4 font-mono text-sm resize-none border-0 focus-visible:ring-0"
                placeholder="Type your markdown here..."
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
              />
            </TabsContent>
            
            {/* Preview tab */}
            <TabsContent value="preview" className="m-0">
              <div className="h-[600px] p-6 overflow-auto">
                <div className="prose prose-sm max-w-none markdown-preview">
                  <ReactMarkdown>{markdown}</ReactMarkdown>
                </div>
              </div>
            </TabsContent>
          </Card>
        </Tabs>
      </div>
      
      {/* Footer with info and last saved time */}
      <div className="flex justify-between items-center text-sm text-muted-foreground">
        <div>
          <p>Supports GitHub Flavored Markdown</p>
        </div>
        <div className="flex items-center">
          {lastSaved && (
            <>
              <Clock className="h-3 w-3 mr-1" />
              <span>Last saved: {lastSaved.toLocaleTimeString()}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarkdownPage;
