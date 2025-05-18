
import { NavLink } from "react-router-dom";
import {
  CheckSquare,
  StickyNote,
  Clock,
  FileText,
  Calendar as CalendarIcon,
  Globe,
  CodeIcon,
  Network,
  Braces,
  SearchCode,
} from "lucide-react";

/**
 * Navigation items configuration
 * Each item includes a title, route path, icon and disabled status state.
 * The `disabled` property is used to conditionally render the link as disabled.
 */
const navItems = [
  {
    // Dashboard
    // The main landing page of the application
    title: "Dashboard",
    href: "/",
    icon: <CheckSquare className="mr-2 h-5 w-5" />,
  },
  {
    // Tasks
    // Manage your tasks with priorities and track progress
    title: "Tasks",
    href: "/tasks",
    icon: <CheckSquare className="mr-2 h-5 w-5" />,
  },
  {
    // Sticky Notes
    // Create and organize sticky notes with drag and drop
    title: "Sticky Notes",
    href: "/sticky-notes",
    icon: <StickyNote className="mr-2 h-5 w-5" />,
  },
  {
    // Pomodoro
    // A time management method that uses a timer to break work into intervals
    title: "Pomodoro",
    href: "/pomodoro",
    icon: <Clock className="mr-2 h-5 w-5" />,
  },
  {
    // Markdown
    // A lightweight markup language with plain text formatting syntax
    title: "Markdown",
    href: "/markdown",
    icon: <FileText className="mr-2 h-5 w-5" />,
  },
  {
    title: "Calendar",
    href: "/calendar",
    icon: <CalendarIcon className="mr-2 h-5 w-5" />,
  },
  // Timezone
  // A tool to convert time between different time zones
  {
    title: "Time Zone",
    href: "/timezone",
    icon: <Globe className="mr-2 h-5 w-5" />,
  },
  {
    // JSON Viewer
    // A tool to view and format JSON data
    title: "JSON Viewer",
    href: "/json-viewer",
    icon: <CodeIcon className="mr-2 h-5 w-5" />,
  },
  {
    // Mind Map
    // A diagram used to represent words, ideas, tasks, or other concepts
    title: "Mind Map",
    href: "/mind-map",
    icon: <Network className="mr-2 h-5 w-5" />,
  },
  {
    // Snippet Manager
    // A tool to manage and organize code snippets
    // This could be a code snippet manager or a text snippet manager
    title: "Snippet Manager",
    href: "/snippet-manager",
    icon: <Braces className="mr-2 h-5 w-5" />,
  },
  {
    // Regex Tester
    // A tool to test and validate regular expressions
    title: "Regex Tester",
    href: "/regex-tester",
    icon: <SearchCode className="mr-2 h-5 w-5" />,
  },
];

/**
 * SidebarNav Component
 * 
 * Renders the sidebar navigation with links to all available tools.
 * Handles active state styling and disabled links.
 */
export function SidebarNav() {
  return (
    <div className="flex flex-col h-full p-3">
      {/* Header with app name */}
      <div className="px-3 py-2">
        <h2 className="text-sidebar-foreground text-xl font-semibold mb-4">ProDevTools</h2>
      </div>
      
      {/* Navigation links */}
      <nav className="space-y-1 flex-1">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              }`
            }
          >
            {item.icon}
            {item.title}
          </NavLink>
        ))}
      </nav>
      
      {/* Footer with version info */}
      <div className="py-2 px-3">
        <p className="text-xs text-sidebar-foreground/70">
          Powered by <a href="https://pyqsctuap.netlify.app/" target="_blank" rel="noopener noreferrer" className="text-sidebar-accent-foreground underline">Knowledge Hub</a></p>
      </div>
    </div>
  );
}
