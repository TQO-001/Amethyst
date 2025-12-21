# Amethyst - Obsidian-Style Markdown Editor

Amethyst is a web-based Markdown editor inspired by Obsidian, built for developers, writers, and knowledge workers who want a sleek, feature-rich note-taking experience with modern styling and persistent storage.

---

## 🚀 Features

- Obsidian-style **callouts** (note, tip, warning, danger, info, question, example, quote, bug, success)
- **LaTeX math rendering** for inline and display equations
- **Code syntax highlighting** and styled code blocks
- **Task lists** with checkboxes
- **Tables** with proper formatting and borders
- **Strikethrough** text
- **Dark mode** support
- **Multiple vaults** with persistent storage
- Responsive **mobile-first design**

---

## 💻 Technology Stack

- **Next.js 16** – modern React framework with Turbopack
- **Tailwind CSS v4.0** – utility-first styling
- **React Hooks** – state management and side effects
- Optional: **KaTeX** for math rendering

---

## 📦 Installation

### Using Next.js

```bash
git clone https://github.com/YourUsername/Amethyst.git
cd Amethyst/amethyst
npm install
npm run dev
````

Visit `http://localhost:3000` to see the editor in action.

### Using Vite React (Optional)

```bash
# Create Vite app
npm create vite@latest amethyst -- --template react
cd amethyst
npm install
npm run dev
```

---

## 📖 Documentation

The full documentation with usage examples, Markdown syntax guide, styling system, and developer notes can be found in the [docs](https://chatgpt.com/c/docs) folder:

- `docs/usage.md` – How to use the editor
- `docs/dev.md` – Contributing and development guide
- `docs/roadmap.md` – Planned features and roadmap

---

## 🏗️ Project Structure

```
Amethyst/
├── amethyst/      # Next.js app
├── electron/      # Future desktop version
├── docs/          # Documentation
├── scripts/       # Build and deploy scripts
├── README.md      # This file
└── package.json   # Optional repo-level scripts
```

---

**Built with ❤️ using Next.js, Tailwind CSS, and inspired by Obsidian**
