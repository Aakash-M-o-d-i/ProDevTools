
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, Plus, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useToast } from "@/hooks/use-toast";

/**
 Type definition for task priority levels
 */
type Priority = "low" | "medium" | "high";

/**
 Task interface defining the structure of task items
 */
interface Task {
  id: string;
  title: string;
  priority: Priority;
  completed: boolean;
}

/**
 TasksPage Component
 
 A task management page that allows users to create, complete,
 and delete tasks with different priority levels.
 */
const TasksPage = () => {
  // Toast notifications for user feedback
  const { toast } = useToast();
  
  // State for the list of tasks with localStorage persistence
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  
  // State for new task form
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<Priority>("medium");
  
  // State for task completion progress percentage
  const [progress, setProgress] = useState(0);

  // Persist tasks to localStorage and update progress when tasks change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    
    // Calculate progress based on completed tasks
    if (tasks.length === 0) {
      setProgress(0);
    } else {
      const completedTasks = tasks.filter(task => task.completed).length;
      setProgress(Math.round((completedTasks / tasks.length) * 100));
    }
  }, [tasks]);

  /**
   Add a new task to the list 
    and reset the form.
   */
  const addTask = () => {
    // Validate task title
    if (!newTaskTitle.trim()) {
      toast({
        title: "Error",
        description: "Task title cannot be empty",
        variant: "destructive",
      });
      return;
    }

    // Create new task object
    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      priority: newTaskPriority,
      completed: false,
    };

    // Add task and reset form
    setTasks([...tasks, newTask]);
    setNewTaskTitle("");
    toast({
      title: "Task added",
      description: "Your task has been added successfully"
    });
  };

  /**
   Toggle the completion status of a task
   and update the task list.   
   */
  const toggleTaskCompletion = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  /**
   Delete a task from the list
   */
  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
    toast({
      title: "Task deleted",
      description: "Your task has been deleted"
    });
  };

  /**
   Get the appropriate CSS class for priority indicators
   */
  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case "high":
        return "bg-priority-high";
      case "medium":
        return "bg-priority-medium";
      case "low":
        return "bg-priority-low";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Tasks</h1>
      </div>

      {/* Progress card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Tasks completed</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Add task form */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Task</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              placeholder="Enter task title"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  addTask();
                }
              }}
              className="flex-1"
            />
            <Select
              value={newTaskPriority}
              onValueChange={(value) => setNewTaskPriority(value as Priority)}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={addTask}>
              <Plus className="h-4 w-4 mr-2" /> Add
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Task list */}
      <Card>
        <CardHeader>
          <CardTitle>Task List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {tasks.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                No tasks yet. Add one above!
              </p>
            ) : (
              tasks.map((task) => (
                <div
                  key={task.id}
                  className={`flex items-center justify-between p-3 border rounded-lg ${
                    task.completed ? "bg-muted/50" : ""
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {/* Priority indicator */}
                    <div
                      className={`w-3 h-3 rounded-full ${getPriorityColor(
                        task.priority
                      )}`}
                    />
                    {/* Task title */}
                    <span
                      className={`${
                        task.completed ? "line-through text-muted-foreground" : ""
                      }`}
                    >
                      {task.title}
                    </span>
                    {/* Completion indicator */}
                    {task.completed && (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                  
                  {/* Task actions */}
                  <div className="flex space-x-2">
                    <Button
                      variant={task.completed ? "outline" : "default"}
                      size="sm"
                      onClick={() => toggleTaskCompletion(task.id)}
                    >
                      {task.completed ? "Undo" : "Complete"}
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => deleteTask(task.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TasksPage;
