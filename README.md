# ProDevTools # Productivity Dashboard

A comprehensive suite of productivity tools built with **React**, **Vite**, and **Tailwind CSS**. This dashboard includes ten powerful tools designed to enhance your productivity and streamline your workflow.

![Productivity Dashboard](/image/image.png)

## 📚 Features

### 1. Task List
- Create, edit, and delete tasks
- Set priority levels (Low, Medium, High)
- Track progress with visual progress bars
- Mark tasks as complete
- Filter tasks by status and priority

### 2. Sticky Notes
- Create colorful digital sticky notes
- Edit note content on the fly
- Move notes around with drag-and-drop
- Color-code your notes by category
- Notes persist across sessions

### 3. Pomodoro Timer
- Traditional 25-minute work sessions with 5-minute breaks
- Customizable work and break durations
- Visual timer with progress circle
- Audio notifications when timers complete
- Switch between work and break modes

### 4. Markdown Editor
- Write using GitHub Flavored Markdown syntax
- Live preview of rendered markdown
- Word and character count tracking
- Save content to local storage
- Download your markdown files

### 5. Weekly Calendar
- Week view with all days visible
- Add tasks to specific days
- Drag and drop tasks between days
- Color-coded tasks for visual organization
- Select dates from a monthly calendar

### 6. Time Zone Converter
- Convert times between multiple time zones
- Select time zones from a comprehensive dropdown
- See current time across multiple locations
- Add frequently used time zones to favorites
- Perfect for coordinating meetings across regions

### 7. JSON Viewer/Editor
- Parse and validate JSON data
- Collapsible node structure for easy navigation
- Format JSON with proper indentation
- Copy formatted JSON to clipboard
- Load sample JSON for testing

### 8. Mind Map Builder
- Create visual mind maps for brainstorming
- Auto-expanding nodes for organic growth
- Add, edit, and delete nodes
- Connect related concepts with visual links
- Export your mind maps for sharing

### 9. Snippet Manager
- Store and organize code snippets
- Filter by programming language
- Search across all snippets
- Syntax highlighting for major languages
- Copy snippets to clipboard with one click

### 10. Regex Tester
- Test regular expressions in real-time
- Color-coded match highlighting
- Match information and group details
- Test against custom input text
- Reference common regex patterns

## 🚀 Getting Started

### Prerequisites
- Node.js (v14.0 or higher)
- npm or yarn

### Installation

1. Clone the repository:
    ```sh
    git clone <repository-url>
    ```

2. Navigate to the project directory:
    ```sh
    cd ProDevTools
    ```

3. Install dependencies:
    ```sh
    npm install
    # or
    yarn
    ```

4. Start the development server:
    ```sh
    npm run dev
    # or
    yarn dev
    ```

5. Open your browser and visit:
    ```
    http://localhost:5173
    ```

## 💻 How to Use

### Navigation
- The sidebar on the left allows you to navigate between different tools
- Each tool opens in the main content area
- You can collapse the sidebar using the menu button in the header

### Using Individual Tools

#### Task List
- Click "Add Task" to create a new task
- Set title, description, priority, and due date
- Use the progress slider to update completion percentage
- Click checkboxes to mark tasks as complete
- Use filters to organize your view

#### Sticky Notes
- Click "Add Note" to create a new sticky note
- Click on a note to edit its content
- Drag notes to rearrange them
- Use the color picker to change note colors

#### Pomodoro Timer
- Click "Start" to begin a work session
- Use "Pause" to temporarily stop the timer
- Click "Reset" to restart the current session
- Use "Switch to Break/Work" to change modes
- Adjust work and break durations in the settings cards

#### Markdown Editor
- Write markdown in the editor tab
- Switch to preview tab to see rendered output
- The word and character count updates as you type
- Click "Save" to persist content to local storage
- Click "Download" to export as a .md file

#### Weekly Calendar
- Select a date from the monthly calendar
- Add tasks to specific days using the form
- Drag tasks between days to reschedule
- Click on a task to edit or delete it
- Navigate between weeks using the buttons

#### Time Zone Converter
- Select your base time zone
- Add additional time zones for comparison
- Set the time in any zone to see conversions
- Add or remove time zones as needed

#### JSON Viewer/Editor
- Paste JSON into the input area
- Click "Parse JSON" to validate and visualize
- Use the chevron icons to collapse/expand nodes
- Click "Format JSON" to properly indent your code
- Use "Copy" to copy the formatted JSON to clipboard

#### Mind Map Builder
- Start with a central idea node
- Click "+" to add child nodes
- Edit node text by clicking on it
- Drag nodes to reposition them
- Use the toolbar for additional functions

#### Snippet Manager
- Add snippets with language, tags, and code
- Filter by language using the dropdown
- Search for snippets by content or tags
- Click to copy a snippet to clipboard
- Edit or delete snippets as needed

#### Regex Tester
- Enter your regular expression in the pattern field
- Add test input text in the content area
- View matches highlighted in the output
- Check match groups and details in the results panel

## 🔧 Customization

You can customize the dashboard by:

- Modifying the theme colors in `tailwind.config.ts`
- Adding new tools by creating components in the `pages` directory
- Updating the sidebar navigation in `components/SidebarNav.tsx`
- Customizing default settings for various tools

## 📱 Responsive Design

The dashboard is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones (best in landscape orientation for tools like Calendar)

## 🔒 Data Persistence

Your data is stored locally in your browser using:
- localStorage for text-based content (notes, markdown, snippets)
- indexedDB for more complex data structures (tasks, calendar events)

No data is sent to any external servers without your explicit permission.

## 🛠️ Technology Stack

- **React**: UI Library
- **Vite**: Build tool
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn UI**: Component library
- **Lucide React**: Icon library
- **React Router**: Navigation
- **React Query**: Data fetching and state management
- **React Markdown**: Markdown rendering
