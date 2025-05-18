
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, X, Pencil, Check } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

/**
 * Interface for sticky note data structure
 */
interface StickyNote {
  id: string;
  content: string;
  color: string;
  position: { x: number; y: number };
}

/**
 * Available colors for sticky notes
 */
const colors = [
  "#FEF7CD", // yellow
  "#FFDEE2", // pink
  "#E5DEFF", // purple
  "#D3E4FD", // blue
  "#F2FCE2", // green
];

/**
 StickyNotesPage Component
  
 A drag-and-drop sticky notes application that allows
 users to create, edit, and organize colorful notes.
 */
const StickyNotesPage = () => {
  // Toast notifications for user feedback
  const { toast } = useToast();
  
  // State for all sticky notes with localStorage persistence
  // Initialize notes from localStorage or set to empty array
  // This uses a function to avoid parsing localStorage on every render
  const [notes, setNotes] = useState<StickyNote[]>(() => {
    const savedNotes = localStorage.getItem("stickyNotes");
    return savedNotes ? JSON.parse(savedNotes) : [];
  });
  
  // State for tracking which note is being edited
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // State for the content of the note being edited
  const [editContent, setEditContent] = useState("");

  // Save notes to localStorage when they change
  useEffect(() => {
    localStorage.setItem("stickyNotes", JSON.stringify(notes));
  }, [notes]);

  /**
   Add a new sticky note with default content
    and random color.
   */
  const addNote = () => {
    const newNote: StickyNote = {
      id: Date.now().toString(),
      content: "",
      color: colors[Math.floor(Math.random() * colors.length)],
      position: {
        x: Math.random() * 100,
        y: Math.random() * 100,
      },
    };
    setNotes([...notes, newNote]);
    setEditingId(newNote.id);
    setEditContent("");

    toast({
      title: "Note added",
      description: "Your note has been added"
    });
  };

  /**
   Delete a sticky note by its ID
   */
  const deleteNote = (id: string) => {
    setNotes(notes.filter((note) => note.id !== id));
    toast({
      title: "Note deleted",
      description: "Your note has been deleted"
    });
  };

  /**
    Start editing a note by setting its ID and content
    This function is called when the edit button is clicked.
   */
  const startEditing = (note: StickyNote) => {
    setEditingId(note.id);
    setEditContent(note.content);
  };

  /**
   Save changes to a note being edited 
   */
  const saveNote = () => {
    if (editingId) {
      setNotes(
        notes.map((note) =>
          note.id === editingId ? { ...note, content: editContent } : note
        )
      );
      setEditingId(null);
      toast({
        title: "Note updated",
        description: "Your note has been saved"
      });
    }
  };

  /**
   Handle drag start event 
   */
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("noteId", id);
  };

  /**
   Handle drag over event (required for drop) 
   */
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  /**
   Handle drop event to reposition a note
   */
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("noteId");
    const boardRect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    
    // Calculate percentage positions
    const xPos = ((e.clientX - boardRect.left) / boardRect.width) * 100;
    const yPos = ((e.clientY - boardRect.top) / boardRect.height) * 100;
    
    // Update note position
    setNotes(
      notes.map((note) =>
        note.id === id ? { ...note, position: { x: xPos, y: yPos } } : note
      )
    );
  };

  return (
    <div className="space-y-4 h-full">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Sticky Notes</h1>
        <Button onClick={addNote}>
          <Plus className="h-4 w-4 mr-2" /> Add Note
        </Button>
      </div>

      {/* Notes board area */}
      <div 
        className="relative bg-muted/30 rounded-lg h-[calc(100vh-220px)] min-h-[500px] border-2 border-dashed border-muted-foreground/20 p-4 overflow-hidden"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {/* Empty state */}
        {notes.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">No sticky notes yet</p>
              <Button onClick={addNote}>
                <Plus className="h-4 w-4 mr-2" /> Add Your First Note
              </Button>
            </div>
          </div>
        )}
        
        {/* Render all notes */}
        {notes.map((note) => (
          <div
            key={note.id}
            className="sticky-note absolute w-64 shadow-md rounded-md overflow-hidden"
            style={{
              backgroundColor: note.color,
              left: `${note.position.x}%`,
              top: `${note.position.y}%`,
              transform: "translate(-50%, -50%)",
            }}
            draggable={editingId !== note.id}
            onDragStart={(e) => handleDragStart(e, note.id)}
          >
            {/* Note header with controls */}
            <div className="p-3">
              <div className="flex justify-between items-center mb-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full" />
                  <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                </div>
                <div className="flex space-x-1">
                  {/* Edit/Save button */}
                  {editingId === note.id ? (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6"
                      onClick={saveNote}
                    >
                      <Check className="h-3 w-3" />
                    </Button>
                  ) : (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6"
                      onClick={() => startEditing(note)}
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                  )}
                  {/* Delete button */}
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6"
                    onClick={() => deleteNote(note.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              {/* Note content (editable or read-only) */}
              {editingId === note.id ? (
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="min-h-[100px] resize-none bg-transparent focus-visible:ring-0 border-0 p-0"
                  autoFocus
                  onBlur={saveNote}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.ctrlKey) {
                      saveNote();
                    }
                  }}
                />
              ) : (
                <div className="min-h-[100px] text-sm break-words">
                  {note.content}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Instructions and actions card */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Drag notes to position them
              </p>
            </div>
            <div>
              <Button
                variant="outline"
                className="text-sm"
                onClick={() => {
                  setNotes([]);
                  toast({
                    title: "Notes cleared",
                    description: "All notes have been removed"
                  });
                }}
              >
                Clear All
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StickyNotesPage;
