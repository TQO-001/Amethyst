# Obsidian-Style Markdown Editor - Complete Documentation

## 📋 Table of Contents

1. [Overview](https://claude.ai/chat/d9132237-4b23-4e6a-a3a5-0fb34825b848#overview)
2. [What's New - Enhanced Styling](https://claude.ai/chat/d9132237-4b23-4e6a-a3a5-0fb34825b848#whats-new)
3. [Technology Stack](https://claude.ai/chat/d9132237-4b23-4e6a-a3a5-0fb34825b848#technology-stack)
4. [Obsidian-Specific Features](https://claude.ai/chat/d9132237-4b23-4e6a-a3a5-0fb34825b848#obsidian-features)
5. [Setup Instructions](https://claude.ai/chat/d9132237-4b23-4e6a-a3a5-0fb34825b848#setup-instructions)
6. [Architecture Explanation](https://claude.ai/chat/d9132237-4b23-4e6a-a3a5-0fb34825b848#architecture-explanation)
7. [Markdown Syntax Guide](https://claude.ai/chat/d9132237-4b23-4e6a-a3a5-0fb34825b848#markdown-syntax)
8. [Styling System](https://claude.ai/chat/d9132237-4b23-4e6a-a3a5-0fb34825b848#styling-system)
9. [Key Concepts Explained](https://claude.ai/chat/d9132237-4b23-4e6a-a3a5-0fb34825b848#key-concepts-explained)

---

## 🎯 Overview

This is a fully-styled web-based markdown editor inspired by Obsidian, featuring:

- ✅ **Obsidian-style callouts** (note, tip, warning, danger, etc.)
- ✅ **LaTeX math equations** (inline and display mode)
- ✅ **Code syntax highlighting** styling
- ✅ **Beautiful tables** with borders and spacing
- ✅ **Task lists** with checkboxes
- ✅ **Strikethrough** text support
- ✅ **Enhanced typography** and spacing
- ✅ **Multiple vaults** and file organization
- ✅ **Persistent storage** across sessions
- ✅ **Dark mode** support

---

## ✨ What's New - Enhanced Styling

### Based on Research

I researched Obsidian's markdown features and discovered:

1. **Callouts** (from Obsidian documentation):
    
    - Special blockquote syntax: `> [!type] Title`
    - Multiple types: note, tip, warning, danger, info, question, example, quote, bug, success
    - Each type has unique colors and icons
2. **Math Support** (from Obsidian LaTeX guides):
    
    - Uses MathJax/KaTeX for rendering LaTeX equations
    - Inline: `$equation$`
    - Display: `$$equation$$`
3. **Enhanced Markdown**:
    
    - Task lists with `- [ ]` and `- [x]`
    - Strikethrough with `~~text~~`
    - Tables with pipe syntax
    - Code blocks with language tags

### What I Added

```javascript
// NEW: Callout parsing with proper Obsidian styling
const calloutColors = {
  note: { bg: 'bg-blue-50', border: 'border-blue-500', ... },
  warning: { bg: 'bg-yellow-50', border: 'border-yellow-500', ... },
  danger: { bg: 'bg-red-50', border: 'border-red-500', ... },
  // ... 12 different callout types with unique colors
};

// NEW: Math equation rendering
html.replace(/\$\$([\s\S]*?)\$\$/g, ...) // Display math
html.replace(/\$([^\$\n]+?)\$/g, ...) // Inline math

// NEW: Enhanced code blocks with styling
html.replace(/```(\w+)?\n([\s\S]*?)```/g, ...) // Syntax-styled code

// NEW: Task lists
html.replace(/- \[([ x])\] (.+)/gi, ...) // Checkboxes

// NEW: Strikethrough
html.replace(/~~(.*?)~~/g, ...) // Strike text
```

---

## 🛠️ Technology Stack

### Next.js 16 (Latest)

- **Released**: October 2025
- **New Features**: Turbopack bundler (5-10x faster), React 19 support
- **What we use**: React components that work in Next.js environment

### Tailwind CSS v4.0 (Just Released!)

- **Released**: January 22, 2025
- **New Features**: 5x faster builds, simplified setup
- **What we use**: Extensive utility classes for styling

### React Hooks

- `useState`: State management
- `useEffect`: Side effects and lifecycle
- Modern functional component patterns

### Storage API

- `window.storage`: Persistent data across sessions
- Async operations with promises

---

## 🎨 Obsidian-Specific Features

### 1. Callouts (Most Important!)

**What are callouts?** Callouts are a feature in Obsidian that allows you to add more organization to your notes by highlighting or emphasizing specific blocks of content.

**Syntax:**

```markdown
> [!note] This is a Note Callout
> Your content goes here.
> You can have multiple lines.

> [!warning] Be Careful!
> Warning messages stand out.

> [!tip] Pro Tip
> Helpful suggestions use the tip callout.
```

**Supported Types:**

|Type|Color|Use Case|
|---|---|---|
|`note`, `info`|Blue|General information|
|`tip`, `hint`|Green|Helpful suggestions|
|`success`, `check`, `done`|Green|Completed items, success messages|
|`question`, `help`, `faq`|Purple|Questions and help topics|
|`warning`, `caution`|Yellow|Important warnings|
|`danger`, `error`|Red|Critical errors, dangerous actions|
|`bug`|Red|Bug reports, issues|
|`example`|Purple|Code or concept examples|
|`quote`, `cite`|Gray|Quotations and citations|

**How it works in our code:**

```javascript
// Parse callout syntax
html.replace(/^> \[!(\w+)\]([+-]?)\s*(.*)$/gm, (match, type, fold, title) => {
  const colors = calloutColors[type.toLowerCase()] || calloutColors.note;
  // Generate styled HTML with icon, title, and content
  return `<div class="callout ${colors.bg} ${colors.border} ...">...`;
});
```

### 2. Math Equations

**LaTeX Support:** Obsidian uses MathJax to render LaTeX math equations directly within markdown.

**Inline Math** - Use single `$`:

```markdown
The famous equation $E = mc^2$ changed physics.
```

Renders as: The famous equation $E = mc^2$ changed physics.

**Display Math** - Use double `$$`:

```markdown
$$
\frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
$$
```

Renders as a centered, large equation block.

**Common LaTeX Commands:**

- Fractions: `\frac{numerator}{denominator}`
- Square root: `\sqrt{x}`
- Summation: `\sum_{i=1}^{n}`
- Greek letters: `\alpha`, `\beta`, `\gamma`
- Subscript: `x_i`
- Superscript: `x^2`

### 3. Code Blocks with Syntax Highlighting

**Syntax:**

````markdown
```javascript
function hello() {
  console.log("Hello World!");
}
```
````

**Styling applied:**

- Dark background (`bg-gray-900`)
- Light text (`text-gray-100`)
- Rounded corners
- Proper padding and margins
- Horizontal scrolling for long lines

### 4. Enhanced Tables

**Syntax:**

```markdown
| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Data 1   | Data 2   | Data 3   |
| More     | Data     | Here     |
```

**Styling:**

- Border collapse for clean lines
- Alternating row colors (on hover)
- Proper padding (px-4 py-2)
- Border between header and body
- Full width with `w-full`

### 5. Task Lists

**Syntax:**

```markdown
- [ ] Unchecked task
- [x] Completed task
- [ ] Another task
```

**Rendering:**

- Real checkbox inputs (disabled to prevent interaction)
- Strike-through text for completed items
- Gray color for completed
- Proper spacing with flexbox

---

## 🚀 Setup Instructions

### Option 1: Next.js Project (Recommended)

```bash
# 1. Create Next.js app with latest version
npx create-next-app@latest my-markdown-editor
cd my-markdown-editor

# 2. Install dependencies
npm install lucide-react

# 3. Create the component
# Create file: app/components/ObsidianEditor.jsx
# Copy the artifact code

# 4. Use in your page
# In app/page.js:
import ObsidianEditor from './components/ObsidianEditor';

export default function Home() {
  return <ObsidianEditor />;
}

# 5. Run development server
npm run dev
# Visit http://localhost:3000
```

### Option 2: Standalone React (Vite)

```bash
# 1. Create Vite React app
npm create vite@latest my-editor -- --template react
cd my-editor

# 2. Install dependencies
npm install
npm install lucide-react tailwindcss postcss autoprefixer
npx tailwindcss init -p

# 3. Configure Tailwind
# In tailwind.config.js:
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

# 4. Add Tailwind to CSS
# In src/index.css:
@tailwind base;
@tailwind components;
@tailwind utilities;

# 5. Copy component and run
npm run dev
```

---

## 🏗️ Architecture Explanation

### Data Structure

```javascript
// Vault object structure
{
  id: "123_abc",              // Unique identifier
  name: "My Vault",           // Display name
  files: [                    // Array of files
    {
      id: "456_def",          // File ID
      name: "Note.md",        // Filename
      content: "# Hello..."   // Markdown content
    }
  ]
}

// Storage keys in window.storage
"vault-list" → ["vault_id_1", "vault_id_2"]
"vault-vault_id_1" → {entire vault object as JSON}
"vault-vault_id_2" → {entire vault object as JSON}
```

### Component Hierarchy

```
ObsidianEditor (Root)
│
├── Header
│   ├── Mobile Menu Button (hamburger)
│   ├── Vault Selector (dropdown)
│   └── Action Buttons
│       ├── New Vault Button
│       └── Delete Vault Button
│
├── Sidebar (File Browser)
│   ├── Header with "Files" title
│   ├── New File Button (+)
│   └── File List
│       └── File Items (clickable)
│
└── Main Content Area
    ├── File Toolbar
    │   ├── File Name Display
    │   ├── Edit/Preview Toggle
    │   └── Delete File Button
    │
    └── Editor/Preview Area
        ├── Edit Mode → <textarea>
        └── Preview Mode → Parsed HTML
```

---

## 📝 Markdown Syntax Guide

### Complete Supported Syntax

#### Headers

```markdown
# Heading 1 (4xl, bold, bottom margin)
## Heading 2 (3xl, bold, border-bottom)
### Heading 3 (2xl, bold, border-bottom)
#### Heading 4 (xl, bold)
##### Heading 5 (lg, bold)
```

#### Text Formatting

```markdown
**Bold text** → font-bold
*Italic text* → italic
~~Strikethrough~~ → line-through, gray
`Inline code` → pink bg, monospace font
```

#### Lists

```markdown
- Unordered list item
- Another item
  - Nested item (use spaces)

1. Numbered list
2. Second item
3. Third item
```

#### Task Lists

```markdown
- [ ] Incomplete task
- [x] Completed task
```

#### Links

```markdown
[Link text](https://example.com)
```

#### Blockquotes

```markdown
> This is a blockquote
> Multiple lines work too
```

#### Horizontal Rules

```markdown
---
```

#### Tables

```markdown
| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
```

#### Code Blocks

````markdown
```language
code here
```
````

#### Callouts

```markdown
> [!note] Title
> Content here

> [!warning] Warning!
> Be careful with this.
```

#### Math

```markdown
Inline: $x = y + 1$
Display: $$E = mc^2$$
```

---

## 🎨 Styling System

### Tailwind Class Breakdown

#### Spacing System

```javascript
// Padding (p = padding, px = horizontal, py = vertical)
p-1   // 0.25rem = 4px
p-2   // 0.5rem  = 8px
p-4   // 1rem    = 16px
p-6   // 1.5rem  = 24px
p-8   // 2rem    = 32px

// Margin (m = margin, mx = horizontal, my = vertical)
m-4   // 1rem = 16px
my-4  // margin top & bottom
```

#### Colors Used

**Background Colors:**

```javascript
// Light mode backgrounds
bg-white       // Pure white
bg-gray-50     // Very light gray
bg-gray-100    // Light gray

// Dark mode backgrounds
dark:bg-gray-800  // Dark gray
dark:bg-gray-900  // Very dark gray

// Callout backgrounds
bg-blue-50     // Light blue tint
bg-yellow-50   // Light yellow tint
bg-red-50      // Light red tint
```

**Text Colors:**

```javascript
// Primary text
text-gray-900  // Almost black
text-gray-700  // Dark gray
text-gray-500  // Medium gray

// Dark mode
dark:text-gray-100  // Almost white
dark:text-gray-300  // Light gray

// Accent colors
text-purple-600     // Purple (main accent)
text-blue-600       // Blue (links)
text-red-600        // Red (danger)
```

**Border Colors:**

```javascript
// Standard borders
border-gray-200      // Light border
dark:border-gray-700 // Dark mode border

// Callout borders
border-blue-500      // Blue accent
border-yellow-500    // Yellow accent
border-red-500       // Red accent
```

#### Typography

```javascript
// Font sizes
text-sm    // 0.875rem = 14px
text-base  // 1rem = 16px
text-lg    // 1.125rem = 18px
text-xl    // 1.25rem = 20px
text-2xl   // 1.5rem = 24px
text-3xl   // 1.875rem = 30px
text-4xl   // 2.25rem = 36px

// Font weights
font-medium    // 500
font-semibold  // 600
font-bold      // 700

// Font families
font-mono      // Monospace for code
```

#### Layout

```javascript
// Flexbox
flex              // display: flex
flex-col          // flex-direction: column
items-center      // align-items: center
justify-between   // justify-content: space-between
gap-2            // gap: 0.5rem

// Positioning
fixed      // position: fixed
relative   // position: relative
absolute   // position: absolute

// Z-index
z-10       // z-index: 10
z-20       // z-index: 20
z-30       // z-index: 30
```

### Callout Color System

Each callout type has 4 color properties:

```javascript
const calloutColors = {
  note: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',      // Background tint
    border: 'border-blue-500',                  // Left border color
    text: 'text-blue-700 dark:text-blue-300',  // Text color
    icon: 'text-blue-500'                       // Icon color
  },
  // ... other types
};
```

**Why this works:**

- Light backgrounds (`-50`) don't overpower text
- Dark borders (`-500`) provide strong visual separation
- Text colors (`-700` light, `-300` dark) ensure readability
- Icons match border color for consistency

---

## 🎓 Key Concepts Explained

### 1. Regex in Markdown Parsing

**What is Regex?** Regular Expressions (regex) are patterns used to match text.

**Example - Header Parsing:**

```javascript
// Match: ## Header Text
html.replace(/^## (.*$)/gim, '<h2>$1</h2>')

// Breaking it down:
^ = Start of line
## = Literal "##"
(.*$) = Capture everything until end of line
/gim = Flags: global, case-insensitive, multiline
$1 = First captured group (the header text)
```

**Why order matters:**

```javascript
// ❌ Wrong order - h3 matches before h2
html.replace(/^##(.*$)/, '<h2>$1</h2>')  // This would match ### too!
html.replace(/^###(.*$)/, '<h3>$1</h3>')

// ✅ Correct order - most specific first
html.replace(/^###(.*$)/, '<h3>$1</h3>')  // Match h3 first
html.replace(/^##(.*$)/, '<h2>$1</h2>')   // Then h2
```

### 2. Callout Parsing Algorithm

```javascript
// Step 1: Find callout declaration
> [!warning] Be Careful

// Step 2: Extract parts with regex
/^> \[!(\w+)\]([+-]?)\s*(.*)$/gm
     ↓        ↓          ↓
   type    fold?     title

// Step 3: Get colors for type
const colors = calloutColors[type.toLowerCase()];

// Step 4: Generate HTML structure
<div class="callout {colors.bg} {colors.border}">
  <div class="callout-title {colors.text}">
    <icon>{colors.icon}</icon>
    {title}
  </div>
  <div class="callout-content">
    {remaining lines starting with >}
  </div>
</div>
```

### 3. Math Rendering Strategy

**Display Math:**

```javascript
// Input: $$x^2 + y^2 = z^2$$
html.replace(/\$\$([\s\S]*?)\$\$/g, (match, equation) => {
  return `<div class="math-display">
    <code class="math-equation">${equation.trim()}</code>
  </div>`;
});

// Why [\s\S]*?:
// \s = whitespace
// \S = non-whitespace
// * = zero or more
// ? = non-greedy (stop at first $$)
```

**Inline Math:**

```javascript
// Input: The equation $x = y + 1$ is simple
html.replace(/\$([^\$\n]+?)\$/g, (match, equation) => {
  return `<code class="math-inline">${equation}</code>`;
});

// Why [^\$\n]+?:
// [^...] = NOT these characters
// \$ = dollar sign
// \n = newline
// + = one or more
// ? = non-greedy
```

### 4. State Management Flow

```
User types in editor
        ↓
onChange event fires
        ↓
setFileContent(newValue)
        ↓
React re-renders
        ↓
useEffect detects change
        ↓
Start 1-second timer
        ↓
(User keeps typing → cancel and restart timer)
        ↓
Timer completes → saveCurrentFile()
        ↓
Update vaults state
        ↓
Save to window.storage
        ↓
Data persists!
```

### 5. Responsive Design Pattern

**Mobile-First Approach:**

```jsx
// Default (mobile): hidden sidebar
className="-translate-x-full"

// Large screens: always visible
className="lg:translate-x-0"

// Combined:
className="-translate-x-full lg:translate-x-0"

// When user clicks menu button:
className={isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
```

**Breakpoint Strategy:**

- Base styles = mobile (< 640px)
- `sm:` = phone landscape (≥ 640px)
- `md:` = tablets (≥ 768px)
- `lg:` = laptops (≥ 1024px)
- `xl:` = desktops (≥ 1280px)

---

## 🔧 Customization Guide

### Adding New Callout Types

```javascript
// 1. Add to calloutIcons
import { Rocket } from 'lucide-react';
const calloutIcons = {
  ...existing,
  rocket: Rocket,  // New type
};

// 2. Add to calloutColors
const calloutColors = {
  ...existing,
  rocket: {
    bg: 'bg-orange-50 dark:bg-orange-900/20',
    border: 'border-orange-500',
    text: 'text-orange-700 dark:text-orange-300',
    icon: 'text-orange-500'
  },
};

// 3. Use in markdown
> [!rocket] Launch Ready!
> Your rocket is ready to launch.
```

### Changing Color Scheme

To change from purple to blue theme:

```javascript
// Find and replace throughout:
purple-600 → blue-600
purple-700 → blue-700
purple-50 → blue-50
purple-900 → blue-900
purple-100 → blue-100
purple-300 → blue-300
purple-400 → blue-400
purple-500 → blue-500
```

### Adding File Search

```javascript
const [searchQuery, setSearchQuery] = useState('');

// In sidebar header, add:
<input
  type="text"
  placeholder="Search files..."
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  className="w-full px-3 py-1.5 text-sm border rounded"
/>

// Filter files:
const filteredFiles = currentVault?.files.filter(file =>
  file.name.toLowerCase().includes(searchQuery.toLowerCase())
);

// Use filteredFiles in map instead of currentVault.files
```

---

## 🐛 Troubleshooting

### Callouts Not Rendering

**Issue:** Callouts show as plain blockquotes

**Solution:** Check regex order - callout parsing must happen before regular blockquotes

```javascript
// ✅ Correct order
html = html.replace(/^> \[!(\w+)\].../, ...);  // Callouts first
html = html.replace(/^> (.+)$/, ...);          // Regular blockquotes second
```

### Math Not Displaying

**Issue:** Math shows as raw LaTeX

**Solution:** For production, integrate actual KaTeX:

```bash
npm install katex
```

```javascript
import katex from 'katex';
import 'katex/dist/katex.min.css';

// In parseMarkdown:
html = html.replace(/\$\$([\s\S]*?)\$\$/g, (match, equation) => {
  try {
    const rendered = katex.renderToString(equation, {
      displayMode: true,
      throwOnError: false
    });
    return `<div class="math-display">${rendered}</div>`;
  } catch (e) {
    return match;  // Return original on error
  }
});
```

### Tables Not Aligned

**Issue:** Table cells not rendering properly

**Solution:** Ensure proper parsing order:

```javascript
// 1. Parse table rows first
html = html.replace(/^\|(.+)\|$/gm, ...);

// 2. Then wrap in <table> tags
html = html.replace(/(<tr>.*<\/tr>\s*)+/g, 
  '<table class="...">$&</table>'
);
```

---

## 📚 Further Learning

### Recommended Resources

1. **Obsidian Documentation**: https://help.obsidian.md
2. **Tailwind CSS Docs**: https://tailwindcss.com/docs
3. **React Hooks Guide**: https://react.dev/reference/react
4. **Regex Tutorial**: https://regexr.com
5. **LaTeX Math Guide**: https://en.wikibooks.org/wiki/LaTeX/Mathematics

### Next Features to Add

- [ ] Real KaTeX/MathJax integration
- [ ] Actual syntax highlighting (Prism.js)
- [ ] File folders/hierarchy
- [ ] Wiki-style links `[[Other Note]]`
- [ ] Image support
- [ ] Export to PDF
- [ ] Keyboard shortcuts
- [ ] Search across files
- [ ] Tags system
- [ ] Graph view

---

## 💡 Key Takeaways

1. **Obsidian callouts** use `> [!type]` syntax with 12+ built-in types
2. **Tailwind** provides utility classes for rapid UI development
3. **Regex** powers markdown parsing - order matters!
4. **State management** uses React hooks with auto-save debouncing
5. **Responsive design** uses mobile-first approach with breakpoints
6. **Dark mode** is automatic with Tailwind's `dark:` prefix
7. **Persistent storage** uses async window.storage API

---

**Built with ❤️ using Next.js 16, Tailwind CSS v4.0, and Obsidian-inspired design**