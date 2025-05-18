
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Copy, Save, FileText } from "lucide-react";

/**
 RegexTesterPage Component
  
 A regular expression testing tool that allows users to test regex patterns
 against input text with visual highlighting of matches.
 */
const RegexTesterPage = () => {
  // Toast notifications for user feedback
  const { toast } = useToast();
  
  // Regex pattern input
  const [pattern, setPattern] = useState<string>("");
  
  // Text to match against
  const [inputText, setInputText] = useState<string>("");
  
  // Regex flags
  const [flags, setFlags] = useState({
    global: true,
    caseInsensitive: false,
    multiline: false,
  });
  
  // Match results
  const [matches, setMatches] = useState<RegExpExecArray[]>([]);
  
  // Groups from regex captures
  const [groups, setGroups] = useState<Record<string, string[]>>({});
  
  // Error message if regex is invalid
  const [error, setError] = useState<string | null>(null);
  
  // Saved regex patterns
  // This state is initialized from localStorage if available
  // or with some default patterns.
  const [savedPatterns, setSavedPatterns] = useState<{name: string, pattern: string, flags: typeof flags}[]>(() => {
    const saved = localStorage.getItem("savedRegexPatterns");
    return saved ? JSON.parse(saved) : [
      { name: "Email", pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}", flags: { global: true, caseInsensitive: true, multiline: false } },
      { name: "URL", pattern: "https?:\\/\\/[\\w\\d\\-._~:/?#[\\]@!$&'()*+,;=]+", flags: { global: true, caseInsensitive: false, multiline: false } },
      { name: "Phone Number", pattern: "\\(\\d{3}\\)\\s?\\d{3}-\\d{4}", flags: { global: true, caseInsensitive: false, multiline: false } },
    ];
  });
  
  // New pattern name for saving
  const [newPatternName, setNewPatternName] = useState<string>("");
  
  // Save patterns to localStorage when they change
  useEffect(() => {
    localStorage.setItem("savedRegexPatterns", JSON.stringify(savedPatterns));
  }, [savedPatterns]);
  
  // Test the regex pattern against the input text
  useEffect(() => {
    testRegex();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pattern, inputText, flags]);
  
  // Build flags string from flag options
  const getFlagsString = () => {
    let flagsString = '';
    if (flags.global) flagsString += 'g';
    if (flags.caseInsensitive) flagsString += 'i';
    if (flags.multiline) flagsString += 'm';
    return flagsString;
  };
  
  // Test the regex pattern against input text
  // This function is called when the user clicks the "Test Regex" button
  // or when the pattern, input text, or flags change.
  const testRegex = () => {
    // Clear previous results
    setMatches([]);
    setGroups({});
    setError(null);
    
    if (!pattern || !inputText) return;
    
    try {
      // Create regex from pattern and flags
      const flagsString = getFlagsString();
      const regex = new RegExp(pattern, flagsString);
      
      // Find all matches
      const allMatches: RegExpExecArray[] = [];
      const captureGroups: Record<string, string[]> = {};
      
      if (flags.global) {
        let match;
        while ((match = regex.exec(inputText)) !== null) {
          allMatches.push(match);
          
          // Process named capture groups
          if (match.groups) {
            Object.entries(match.groups).forEach(([name, value]) => {
              if (!captureGroups[name]) captureGroups[name] = [];
              captureGroups[name].push(value as string);
            });
          }
        }
      } else {
        const match = regex.exec(inputText);
        if (match) {
          allMatches.push(match);
          
          // Process named capture groups
          if (match.groups) {
            Object.entries(match.groups).forEach(([name, value]) => {
              if (!captureGroups[name]) captureGroups[name] = [];
              captureGroups[name].push(value as string);
            });
          }
        }
      }
      
      // Set results
      setMatches(allMatches);
      setGroups(captureGroups);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      }
    }
  };
  
  // Toggle a flag option
  // This function is called when the user checks/unchecks a flag checkbox
  // It updates the flags state accordingly.
  const toggleFlag = (flag: keyof typeof flags) => {
    setFlags({ ...flags, [flag]: !flags[flag] });
  };
  
  // Save current regex pattern
  const savePattern = () => {
    if (!pattern) {
      toast({
        title: "Error",
        description: "Pattern cannot be empty",
        variant: "destructive",
      });
      return;
    }
    
    if (!newPatternName.trim()) {
      toast({
        title: "Error",
        description: "Please provide a name for the pattern",
        variant: "destructive",
      });
      return;
    }
    
    // Add new pattern to saved patterns
    setSavedPatterns([
      ...savedPatterns,
      { 
        name: newPatternName, 
        pattern, 
        flags: { ...flags } 
      }
    ]);
    
    setNewPatternName("");
    
    toast({
      title: "Pattern Saved",
      description: `"${newPatternName}" has been saved to your patterns`
    });
  };
  
  // Load a saved pattern
  const loadPattern = (saved: typeof savedPatterns[0]) => {
    setPattern(saved.pattern);
    setFlags(saved.flags);
    
    toast({
      title: "Pattern Loaded",
      description: `"${saved.name}" pattern has been loaded`
    });
  };
  
  // Delete a saved pattern
  const deletePattern = (index: number) => {
    const newPatterns = [...savedPatterns];
    newPatterns.splice(index, 1);
    setSavedPatterns(newPatterns);
    
    toast({
      title: "Pattern Deleted",
      description: "Pattern has been removed from your saved patterns"
    });
  };
  
  // Copy regex pattern to clipboard
  const copyPattern = () => {
    navigator.clipboard.writeText(`/${pattern}/${getFlagsString()}`);
    
    toast({
      title: "Copied",
      description: "Regex pattern copied to clipboard"
    });
  };
  
  // Render input text with highlighted matches
  const renderHighlightedText = () => {
    if (!pattern || !inputText || matches.length === 0) {
      return <div className="whitespace-pre-wrap">{inputText}</div>;
    }
    
    // Sort matches by index
    const sortedMatches = [...matches].sort((a, b) => a.index - b.index);
    
    // Build segments of text with highlights
    const segments = [];
    let lastIndex = 0;
    
    sortedMatches.forEach((match, i) => {
      // Add text before match
      if (match.index > lastIndex) {
        segments.push(
          <span key={`text-${i}`}>
            {inputText.substring(lastIndex, match.index)}
          </span>
        );
      }
      
      // Add highlighted match
      segments.push(
        <span
          key={`match-${i}`}
          className="bg-yellow-300 dark:bg-yellow-800"
        >
          {match[0]}
        </span>
      );
      
      lastIndex = match.index + match[0].length;
    });
    
    // Add remaining text after last match
    if (lastIndex < inputText.length) {
      segments.push(
        <span key="text-last">
          {inputText.substring(lastIndex)}
        </span>
      );
    }
    
    return <div className="whitespace-pre-wrap">{segments}</div>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Regex Tester</h1>
        <div className="space-x-2">
          <Button variant="outline" onClick={testRegex}>
            Test Regex
          </Button>
          <Button variant="outline" onClick={copyPattern}>
            <Copy className="h-4 w-4 mr-2" /> Copy Pattern
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Regular Expression</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <span className="text-lg mr-2">/</span>
                <Input
                  value={pattern}
                  onChange={(e) => setPattern(e.target.value)}
                  placeholder="Enter regex pattern"
                  className="flex-1"
                />
                <span className="text-lg mx-2">/</span>
                <div className="text-lg font-mono">{getFlagsString()}</div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="global"
                    checked={flags.global}
                    onCheckedChange={() => toggleFlag("global")}
                  />
                  <label htmlFor="global" className="text-sm">
                    Global (g)
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="caseInsensitive"
                    checked={flags.caseInsensitive}
                    onCheckedChange={() => toggleFlag("caseInsensitive")}
                  />
                  <label htmlFor="caseInsensitive" className="text-sm">
                    Case Insensitive (i)
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="multiline"
                    checked={flags.multiline}
                    onCheckedChange={() => toggleFlag("multiline")}
                  />
                  <label htmlFor="multiline" className="text-sm">
                    Multiline (m)
                  </label>
                </div>
              </div>
              
              {error && <div className="text-red-500 text-sm">{error}</div>}
            </CardContent>
          </Card>
          
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Test String</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter text to test against the regex pattern..."
                className="min-h-[200px]"
              />
            </CardContent>
          </Card>
          
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md p-4 min-h-[100px] bg-muted">
                {renderHighlightedText()}
              </div>
              
              <div className="mt-4">
                <h3 className="text-lg font-medium mb-2">Match Information</h3>
                {matches.length > 0 ? (
                  <div className="space-y-2">
                    <p>Found <strong>{matches.length}</strong> matches</p>
                    
                    <div className="border rounded-md overflow-hidden">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-muted">
                            <th className="p-2 text-left">Match #</th>
                            <th className="p-2 text-left">Text</th>
                            <th className="p-2 text-left">Index</th>
                            <th className="p-2 text-left">Length</th>
                          </tr>
                        </thead>
                        <tbody>
                          {matches.map((match, index) => (
                            <tr key={index} className="border-t">
                              <td className="p-2">{index + 1}</td>
                              <td className="p-2 font-mono">"{match[0]}"</td>
                              <td className="p-2">{match.index}</td>
                              <td className="p-2">{match[0].length}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    {/* Capture groups */}
                    {Object.keys(groups).length > 0 && (
                      <div className="mt-4">
                        <h3 className="text-lg font-medium mb-2">Capture Groups</h3>
                        <div className="border rounded-md overflow-hidden">
                          <table className="w-full">
                            <thead>
                              <tr className="bg-muted">
                                <th className="p-2 text-left">Name</th>
                                <th className="p-2 text-left">Values</th>
                              </tr>
                            </thead>
                            <tbody>
                              {Object.entries(groups).map(([name, values], index) => (
                                <tr key={index} className="border-t">
                                  <td className="p-2 font-mono">{name}</td>
                                  <td className="p-2">
                                    {values.map((value, i) => (
                                      <div key={i} className="font-mono">"{value}"</div>
                                    ))}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No matches found.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Save Pattern</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                value={newPatternName}
                onChange={(e) => setNewPatternName(e.target.value)}
                placeholder="Pattern name"
              />
              <Button onClick={savePattern} className="w-full">
                <Save className="h-4 w-4 mr-2" /> Save Current Pattern
              </Button>
            </CardContent>
          </Card>
          
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Saved Patterns</CardTitle>
            </CardHeader>
            <CardContent>
              {savedPatterns.length > 0 ? (
                <div className="space-y-2">
                  {savedPatterns.map((saved, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 border rounded-md hover:bg-accent"
                    >
                      <div>
                        <div className="font-medium">{saved.name}</div>
                        <div className="text-xs font-mono text-muted-foreground">
                          /{saved.pattern}/
                          {saved.flags.global ? 'g' : ''}
                          {saved.flags.caseInsensitive ? 'i' : ''}
                          {saved.flags.multiline ? 'm' : ''}
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7"
                          onClick={() => loadPattern(saved)}
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7"
                          onClick={() => deletePattern(index)}
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No saved patterns.</p>
              )}
            </CardContent>
          </Card>
          
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Regex Cheatsheet</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div>
                  <div className="font-medium">Character Classes</div>
                  <ul className="ml-4 list-disc space-y-1">
                    <li><code>.</code> - Any character except newline</li>
                    <li><code>\w</code> - Word character [a-zA-Z0-9_]</li>
                    <li><code>\d</code> - Digit [0-9]</li>
                    <li><code>\s</code> - Whitespace</li>
                    <li><code>[abc]</code> - Any of a, b, or c</li>
                    <li><code>[^abc]</code> - Not a, b, or c</li>
                  </ul>
                </div>
                <div>
                  <div className="font-medium">Anchors</div>
                  <ul className="ml-4 list-disc space-y-1">
                    <li><code>^</code> - Start of string</li>
                    <li><code>$</code> - End of string</li>
                    <li><code>\b</code> - Word boundary</li>
                  </ul>
                </div>
                <div>
                  <div className="font-medium">Quantifiers</div>
                  <ul className="ml-4 list-disc space-y-1">
                    <li><code>*</code> - 0 or more</li>
                    <li><code>+</code> - 1 or more</li>
                    <li><code>?</code> - 0 or 1</li>
                    <li><code>{'{n}'}</code> - Exactly n times</li>
                    <li><code>{'{n,}'}</code> - n or more times</li>
                    <li><code>{'{n,m}'}</code> - Between n and m times</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RegexTesterPage;
