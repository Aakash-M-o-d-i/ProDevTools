
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Plus } from "lucide-react";

// Define the Task interface for calendar events
interface Task {
  id: string;
  title: string;
  date: Date;
  color: string;
}

/**
  CalendarPage Component
  
  A weekly calendar view that allows users to add and manage tasks
  with drag-and-drop functionality across different days.
 */
const CalendarPage = () => {
  // Toast notifications for user feedback
  const { toast } = useToast();
  
  // State to track the selected date in the calendar 
  const [date, setDate] = useState<Date>(new Date());
  
  // State to manage tasks/events on the calendar 
  const [tasks, setTasks] = useState<Task[]>(() => {
    // Load tasks from localStorage if available
    const savedTasks = localStorage.getItem("calendarTasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  
  // State for the new task title input
  const [newTaskTitle, setNewTaskTitle] = useState("");

  // Array of colors for task categorization
  const colors = [
    "#FEF7CD", // yellow
    "#FFDEE2", // pink
    "#E5DEFF", // purple
    "#D3E4FD", // blue
    "#F2FCE2", // green
  ];
  
  // Save tasks to localStorage whenever they change
  const saveTasks = (updatedTasks: Task[]) => {
    localStorage.setItem("calendarTasks", JSON.stringify(updatedTasks));
    setTasks(updatedTasks);
  };
  
  // Add a new task to the calendar on the selected date
  const addTask = () => {
    if (!newTaskTitle.trim()) {
      toast({
        title: "Error",
        description: "Task title cannot be empty",
        variant: "destructive",
      });
      return;
    }
    
    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      date: new Date(date),
      color: colors[Math.floor(Math.random() * colors.length)],
    };
    
    const updatedTasks = [...tasks, newTask];
    saveTasks(updatedTasks);
    setNewTaskTitle("");
    
    toast({
      title: "Task added",
      description: `"${newTaskTitle}" added to ${date.toLocaleDateString()}`
    });
  };
  
  // Delete a task from the calendar
  const deleteTask = (id: string) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    saveTasks(updatedTasks);
    
    toast({
      title: "Task deleted",
      description: "Task has been removed from calendar"
    });
  };
  
  // Get tasks for a specific date
  const getTasksForDate = (date: Date) => {
    return tasks.filter(
      (task) => new Date(task.date).toDateString() === date.toDateString()
    );
  };
  
  // Handle drag start event for tasks
  const handleDragStart = (e: React.DragEvent, task: Task) => {
    e.dataTransfer.setData("taskId", task.id);
  };
  
  // Handle drop event when a task is dragged to a new date
  const handleDrop = (e: React.DragEvent, dropDate: Date) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    
    // Update the task's date to the new drop date
    const updatedTasks = tasks.map(task => 
      task.id === taskId 
        ? { ...task, date: new Date(dropDate) } 
        : task
    );
    
    saveTasks(updatedTasks);
    toast({
      title: "Task moved",
      description: `Task moved to ${dropDate.toLocaleDateString()}`
    });
  };
  
  // Allow drop by preventing the default behavior
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  
  // Generate dates for the week based on the selected date
  const getWeekDates = (date: Date) => {
    const day = date.getDay(); // 0 = Sunday, 6 = Saturday
    const startDate = new Date(date);
    startDate.setDate(date.getDate() - day); // Go to the Sunday of the week
    
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      weekDates.push(currentDate);
    }
    return weekDates;
  };
  
  // Navigate to previous week
  const previousWeek = () => {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() - 7);
    setDate(newDate);
  };
  
  // Navigate to next week
  const nextWeek = () => {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + 7);
    setDate(newDate);
  };
  
  // Format date to display day name and date
  const formatDate = (date: Date) => {
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayName = dayNames[date.getDay()];
    const day = date.getDate();
    return { dayName, day };
  };

  // Generate the week dates array
  const weekDates = getWeekDates(date);

  // Check if a date is today
  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Weekly Calendar</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={previousWeek}>Previous Week</Button>
          <Button variant="outline" onClick={() => setDate(new Date())}>Today</Button>
          <Button variant="outline" onClick={nextWeek}>Next Week</Button>
        </div>
      </div>
      
      {/* Month and year display */}
      <div className="text-center mb-4">
        <h2 className="text-xl font-semibold">
          {date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h2>
      </div>

      {/* Calendar selection and task input */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Select Date</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => newDate && setDate(newDate)}
              className="rounded-md border"
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Add Task</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Enter task title"
                className="border p-2 rounded-md"
                onKeyPress={(e) => e.key === "Enter" && addTask()}
              />
              <div className="text-sm">
                Selected date: <strong>{date.toLocaleDateString()}</strong>
              </div>
              <Button onClick={addTask}>
                <Plus className="h-4 w-4 mr-2" /> Add Task
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Weekly calendar view */}
      <div className="grid grid-cols-7 gap-2 mt-6">
        {weekDates.map((weekDate) => {
          const { dayName, day } = formatDate(weekDate);
          const dateTasksCount = getTasksForDate(weekDate).length;
          
          return (
            <div
              key={weekDate.toString()}
              className={`border rounded-lg p-2 min-h-40 ${
                isToday(weekDate) ? "border-primary bg-primary/10" : ""
              }`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, weekDate)}
            >
              <div className="text-center p-2 border-b mb-2">
                <div className="text-sm font-medium">{dayName}</div>
                <div className={`text-xl font-bold ${isToday(weekDate) ? "text-primary" : ""}`}>
                  {day}
                </div>
              </div>
              
              {/* Tasks for this day */}
              <div className="space-y-2">
                {getTasksForDate(weekDate).map((task) => (
                  <div
                    key={task.id}
                    className="p-2 rounded-md text-sm flex justify-between items-center cursor-move"
                    style={{ backgroundColor: task.color }}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task)}
                  >
                    <span>{task.title}</span>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6 opacity-70 hover:opacity-100"
                      onClick={() => deleteTask(task.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                {dateTasksCount === 0 && (
                  <div className="text-center text-sm text-muted-foreground py-2">
                    No tasks
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Select a date and add tasks using the form above</li>
            <li>Drag and drop tasks between days to reschedule</li>
            <li>Click the trash icon to delete a task</li>
            <li>Navigate between weeks using the buttons at the top</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarPage;
