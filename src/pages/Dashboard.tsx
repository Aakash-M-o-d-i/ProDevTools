
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckSquare, StickyNote, Clock, FileText, Calendar as CalendarIcon, Globe, CodeIcon, Network, Braces, SearchCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

/**
 Dashboard Component
 
 The main landing page of the application displaying cards for all available tools.
 Each card provides a quick description and a link to the respective tool.
 */
const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Welcome to ProDevTools</h1>
      </div>
      
      {/* Main tools grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"> 
        {/* Tasks Card */}
        <Card className="hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-lg font-medium">Tasks</CardTitle>
            <CheckSquare className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-3">
              Manage your tasks with priorities and track progress
            </CardDescription>
            <Link to="/tasks">
              <Button className="w-full" variant="outline">Open Tasks</Button>
            </Link>
          </CardContent>
        </Card>

        {/* Sticky Notes Card */}
        <Card className="hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-lg font-medium">Sticky Notes</CardTitle>
            <StickyNote className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-3">
              Create and organize sticky notes with drag and drop
            </CardDescription>
            <Link to="/sticky-notes">
              <Button className="w-full" variant="outline">Open Sticky Notes</Button>
            </Link>
          </CardContent>
        </Card>

        {/* Pomodoro Card */}
        <Card className="hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-lg font-medium">Pomodoro</CardTitle>
            <Clock className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-3">
              Stay focused with a simple pomodoro timer
            </CardDescription>
            <Link to="/pomodoro">
              <Button className="w-full" variant="outline">Open Pomodoro</Button>
            </Link>
          </CardContent>
        </Card>

        {/* Markdown Editor Card */}
        <Card className="hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-lg font-medium">Markdown Editor</CardTitle>
            <FileText className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-3">
              Write and preview markdown with word count
            </CardDescription>
            <Link to="/markdown">
              <Button className="w-full" variant="outline">Open Markdown Editor</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
      
      {/* Additional Tools */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Calendar Card */}
        <Card className="hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-lg font-medium">Calendar</CardTitle>
            <CalendarIcon className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-3">
              Weekly calendar with draggable task blocks
            </CardDescription>
            <Link to="/calendar">
              <Button className="w-full" variant="outline">Open Calendar</Button>
            </Link>
          </CardContent>
        </Card>
        
        {/* Time Zone Card */}
        <Card className="hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-lg font-medium">Time Zone</CardTitle>
            <Globe className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-3">
              Convert times between different time zones
            </CardDescription>
            <Link to="/timezone">
              <Button className="w-full" variant="outline">Open Time Zone</Button>
            </Link>
          </CardContent>
        </Card>
        
        {/* JSON Viewer Card */}
        <Card className="hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-lg font-medium">JSON Viewer</CardTitle>
            <CodeIcon className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-3">
              View and edit JSON with collapsible nodes
            </CardDescription>
            <Link to="/json-viewer">
              <Button className="w-full" variant="outline">Open JSON Viewer</Button>
            </Link>
          </CardContent>
        </Card>
        
        {/* Mind Map Card */}
        <Card className="hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-lg font-medium">Mind Map</CardTitle>
            <Network className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-3">
              Create visual mind maps with expanding nodes
            </CardDescription>
            <Link to="/mind-map">
              <Button className="w-full" variant="outline">Open Mind Map</Button>
            </Link>
          </CardContent>
        </Card>
        
        {/* Snippet Manager Card */}
        <Card className="hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-lg font-medium">Snippet Manager</CardTitle>
            <Braces className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-3">
              Store and manage code snippets with tags
            </CardDescription>
            <Link to="/snippet-manager">
              <Button className="w-full" variant="outline">Open Snippet Manager</Button>
            </Link>
          </CardContent>
        </Card>
        
        {/* Regex Tester Card */}
        <Card className="hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-lg font-medium">Regex Tester</CardTitle>
            <SearchCode className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-3">
              Test regular expressions with highlighted matches
            </CardDescription>
            <Link to="/regex-tester">
              <Button className="w-full" variant="outline">Open Regex Tester</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
