
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Braces, Copy, Plus, Search, Trash2, Code } from "lucide-react";

/**
 Interface for code snippet data structure
 */
interface CodeSnippet {
  id: string;
  title: string;
  code: string;
  language: string;
  tags: string[];
  createdAt: number;
}

/**
 SnippetManagerPage Component
  
 A code snippet manager with language filtering, search functionality,
 and syntax highlighting for various programming languages.
 */
const SnippetManagerPage = () => {
  // Toast notifications for user feedback
  const { toast } = useToast();
  
  // State for all code snippets
  // This state is initialized from localStorage if available
  // or set to an empty array if not.
  const [snippets, setSnippets] = useState<CodeSnippet[]>(() => {
    const savedSnippets = localStorage.getItem("codeSnippets");
    return savedSnippets ? JSON.parse(savedSnippets) : [];
  });
  
  // State for new snippet being created
  // This state holds the title, code, language, and tags for the new snippet
  // The initial state is set to an empty snippet object.
  const [newSnippet, setNewSnippet] = useState<Omit<CodeSnippet, "id" | "createdAt">>({
    title: "",
    code: "",
    language: "javascript",
    tags: [],
  });
  
  // Search term for filtering snippets
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter by language
  const [languageFilter, setLanguageFilter] = useState<string>("all");
  
  // New tag being added
  const [newTag, setNewTag] = useState("");
  
  // Currently selected snippet for viewing
  const [selectedSnippetId, setSelectedSnippetId] = useState<string | null>(null);
  
  // Save snippets to localStorage when they change
  useEffect(() => {
    localStorage.setItem("codeSnippets", JSON.stringify(snippets));
  }, [snippets]);
  
  // Get all available languages from snippets
  const getLanguages = () => {
    const languages = new Set<string>();
    snippets.forEach(snippet => languages.add(snippet.language));
    return Array.from(languages);
  };
  
  // Filter snippets based on search term and language filter
  // This function checks if the snippet title, tags, or code contains the search term
  // and if the snippet language matches the selected language filter.
  const filteredSnippets = snippets.filter(snippet => {
    const matchesSearch = 
      snippet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      snippet.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
      snippet.code.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesLanguage = languageFilter === "all" || snippet.language === languageFilter;
    
    return matchesSearch && matchesLanguage;
  });
  
  // Add a new code snippet
  const addSnippet = () => {
    if (!newSnippet.title.trim()) {
      toast({
        title: "Error",
        description: "Snippet title cannot be empty",
        variant: "destructive",
      });
      return;
    }
    
    if (!newSnippet.code.trim()) {
      toast({
        title: "Error",
        description: "Snippet code cannot be empty",
        variant: "destructive",
      });
      return;
    }
    
    const newSnippetObj: CodeSnippet = {
      ...newSnippet,
      id: Date.now().toString(),
      createdAt: Date.now(),
    };
    
    setSnippets([...snippets, newSnippetObj]);
    
    // Reset form
    setNewSnippet({
      title: "",
      code: "",
      language: "javascript",
      tags: [],
    });
    
    toast({
      title: "Snippet Added",
      description: "Your code snippet has been saved"
    });
  };
  
  // Delete a snippet
  const deleteSnippet = (id: string) => {
    setSnippets(snippets.filter(snippet => snippet.id !== id));
    
    if (selectedSnippetId === id) {
      setSelectedSnippetId(null);
    }
    
    toast({
      title: "Snippet Deleted",
      description: "The code snippet has been removed"
    });
  };
  
  // Add a tag to the new snippet
  // This function checks if the tag already exists in the snippet's tags
  const addTag = () => {
    if (!newTag.trim()) return;
    
    if (!newSnippet.tags.includes(newTag)) {
      setNewSnippet({
        ...newSnippet,
        tags: [...newSnippet.tags, newTag],
      });
    }
    
    setNewTag("");
  };
  
  // Remove a tag from the new snippet
  // This function filters out the tag to be removed from the snippet's tags
  const removeTag = (tagToRemove: string) => {
    setNewSnippet({
      ...newSnippet,
      tags: newSnippet.tags.filter(tag => tag !== tagToRemove),
    });
  };
  
  // Copy snippet code to clipboard
  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    
    toast({
      title: "Copied",
      description: "Code copied to clipboard"
    });
  };
  
  // Get all available languages for the dropdown
  const programmingLanguages = [
    "javascript",
    "typescript",
    "python",
    "java",
    "csharp",
    "cpp",
    "php",
    "ruby",
    "swift",
    "go",
    "rust",
    "sql",
    "html",
    "css",
    "shell",
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Snippet Manager</h1>
      </div>

      <Tabs defaultValue="browse">
        <TabsList className="mb-4">
          <TabsTrigger value="browse" className="flex items-center">
            <Code className="h-4 w-4 mr-2" /> Browse Snippets
          </TabsTrigger>
          <TabsTrigger value="add" className="flex items-center">
            <Plus className="h-4 w-4 mr-2" /> Add New Snippet
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="browse">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Search & Filter</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Input
                      placeholder="Search snippets..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="flex-1"
                    />
                    <Button variant="outline" size="icon">
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Filter by Language</label>
                    <Select 
                      value={languageFilter}
                      onValueChange={setLanguageFilter}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Languages</SelectItem>
                        {getLanguages().map(lang => (
                          <SelectItem key={lang} value={lang}>
                            {lang.charAt(0).toUpperCase() + lang.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {filteredSnippets.length} snippets found
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <div className="mt-4 space-y-2">
                {filteredSnippets.length > 0 ? (
                  filteredSnippets.map(snippet => (
                    <div
                      key={snippet.id}
                      className={`p-3 border rounded-lg cursor-pointer hover:bg-accent ${
                        selectedSnippetId === snippet.id ? "border-primary bg-accent" : ""
                      }`}
                      onClick={() => setSelectedSnippetId(snippet.id)}
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">{snippet.title}</h3>
                        <div className="flex space-x-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6"
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(snippet.code);
                            }}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteSnippet(snippet.id);
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {snippet.language}
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {snippet.tags.map(tag => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 text-xs rounded-full bg-muted"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <Braces className="h-12 w-12 mx-auto text-muted-foreground" />
                      <h3 className="mt-4 text-lg font-medium">No snippets found</h3>
                      <p className="text-sm text-muted-foreground">
                        {snippets.length > 0
                          ? "Try changing your search or filters"
                          : "Add your first code snippet to get started"}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
            
            <div className="md:col-span-2">
              {selectedSnippetId ? (
                (() => {
                  const snippet = snippets.find(s => s.id === selectedSnippetId);
                  if (!snippet) return null;
                  
                  return (
                    <Card>
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <CardTitle>{snippet.title}</CardTitle>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => copyToClipboard(snippet.code)}
                            >
                              <Copy className="h-4 w-4 mr-2" /> Copy
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-muted p-4 rounded-md overflow-auto font-mono text-sm">
                          <pre>{snippet.code}</pre>
                        </div>
                        <div className="mt-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium">Language:</span>
                            <span className="px-2 py-0.5 text-xs rounded-full bg-muted">
                              {snippet.language}
                            </span>
                          </div>
                          {snippet.tags.length > 0 && (
                            <div className="mt-2">
                              <span className="text-sm font-medium">Tags:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {snippet.tags.map(tag => (
                                  <span
                                    key={tag}
                                    className="px-2 py-0.5 text-xs rounded-full bg-muted"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          <div className="mt-4 text-xs text-muted-foreground">
                            Created: {new Date(snippet.createdAt).toLocaleString()}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })()
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Braces className="h-16 w-16 mx-auto text-muted-foreground" />
                    <h3 className="mt-4 text-xl font-medium">Select a snippet</h3>
                    <p className="text-muted-foreground mt-2">
                      Choose a snippet from the list to view its details
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="add">
          <Card>
            <CardHeader>
              <CardTitle>Add New Snippet</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Snippet Title</label>
                    <Input
                      placeholder="Enter a descriptive title"
                      value={newSnippet.title}
                      onChange={(e) => setNewSnippet({ ...newSnippet, title: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Language</label>
                    <Select
                      value={newSnippet.language}
                      onValueChange={(value) => setNewSnippet({ ...newSnippet, language: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        {programmingLanguages.map(lang => (
                          <SelectItem key={lang} value={lang}>
                            {lang.charAt(0).toUpperCase() + lang.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Code</label>
                  <Textarea
                    placeholder="Paste your code here..."
                    value={newSnippet.code}
                    onChange={(e) => setNewSnippet({ ...newSnippet, code: e.target.value })}
                    rows={10}
                    className="font-mono text-sm"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tags</label>
                  <div className="flex items-center space-x-2">
                    <Input
                      placeholder="Add a tag"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addTag()}
                    />
                    <Button variant="outline" onClick={addTag}>
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {newSnippet.tags.map((tag) => (
                      <div
                        key={tag}
                        className="flex items-center px-3 py-1 text-sm rounded-full bg-muted"
                      >
                        {tag}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 ml-2"
                          onClick={() => removeTag(tag)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Button onClick={addSnippet} className="w-full">
                  <Plus className="h-4 w-4 mr-2" /> Add Snippet
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SnippetManagerPage;
