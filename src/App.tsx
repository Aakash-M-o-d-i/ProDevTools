
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";

// Page imports
import Dashboard from "./pages/Dashboard";
import TasksPage from "./pages/TasksPage";
import StickyNotesPage from "./pages/StickyNotesPage";
import PomodoroPage from "./pages/PomodoroPage";
import MarkdownPage from "./pages/MarkdownPage";
import CalendarPage from "./pages/CalendarPage";
import TimezonePage from "./pages/TimezonePage";
import JsonViewerPage from "./pages/JsonViewerPage";
import MindMapPage from "./pages/MindMapPage";
import SnippetManagerPage from "./pages/SnippetManagerPage";
import RegexTesterPage from "./pages/RegexTesterPage";
import NotFound from "./pages/NotFound";

/**
 Setup query client for data fetching
 */
const queryClient = new QueryClient();

/**
 * App Component
  The root component of the application that sets up providers and routing
 */
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      {/* Toast notifications */}
      <Toaster />
      <Sonner />
      
      {/* Router configuration */}
      <BrowserRouter>
        <Routes>
          {/* main layout with sidebar */}
          <Route path="/" element={<DashboardLayout />}>
            {/* Dashboard and tool pages */}
            <Route index element={<Dashboard />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/sticky-notes" element={<StickyNotesPage />} />
            <Route path="/pomodoro" element={<PomodoroPage />} />
            <Route path="/markdown" element={<MarkdownPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/timezone" element={<TimezonePage />} />
            <Route path="/json-viewer" element={<JsonViewerPage />} />
            <Route path="/mind-map" element={<MindMapPage />} />
            <Route path="/snippet-manager" element={<SnippetManagerPage />} />
            <Route path="/regex-tester" element={<RegexTesterPage />} />
          </Route>
          
          {/* 404 page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
