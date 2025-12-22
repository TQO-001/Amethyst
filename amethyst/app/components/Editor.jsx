"use client";

import React, { useState, useEffect } from 'react';
import { FileText, Folder, Plus, Trash2, FolderPlus, Menu, X, AlertCircle, Info, CheckCircle, AlertTriangle, Lightbulb, HelpCircle, Bug, Quote, Zap } from 'lucide-react';

/**
 * -STYLE MARKDOWN EDITOR WITH REAL MATH RENDERING
 * 
 * Enhanced features:
 * - Real LaTeX math rendering with KaTeX
 * - -style callouts with actual icons
 * - Beautiful typography and styling
 * - Code syntax highlighting preparation
 */

// ============================================================================
// KATEX STYLES - Load from CDN
// ============================================================================

// Inject KaTeX CSS into the document
if (typeof document !== 'undefined') {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css';
  if (!document.querySelector('link[href*="katex"]')) {
    document.head.appendChild(link);
  }
}

// ============================================================================
// CALLOUT CONFIGURATION
// ============================================================================

const calloutConfig = {
  note: {
    icon: Info,
    colors: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-500',
      text: 'text-blue-700 dark:text-blue-300',
      icon: 'text-blue-500',
      title: 'text-blue-800 dark:text-blue-200'
    }
  },
  abstract: {
    icon: FileText,
    colors: {
      bg: 'bg-cyan-50 dark:bg-cyan-900/20',
      border: 'border-cyan-500',
      text: 'text-cyan-700 dark:text-cyan-300',
      icon: 'text-cyan-500',
      title: 'text-cyan-800 dark:text-cyan-200'
    }
  },
  info: {
    icon: Info,
    colors: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-500',
      text: 'text-blue-700 dark:text-blue-300',
      icon: 'text-blue-500',
      title: 'text-blue-800 dark:text-blue-200'
    }
  },
  tip: {
    icon: Lightbulb,
    colors: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-500',
      text: 'text-green-700 dark:text-green-300',
      icon: 'text-green-500',
      title: 'text-green-800 dark:text-green-200'
    }
  },
  success: {
    icon: CheckCircle,
    colors: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-500',
      text: 'text-green-700 dark:text-green-300',
      icon: 'text-green-500',
      title: 'text-green-800 dark:text-green-200'
    }
  },
  question: {
    icon: HelpCircle,
    colors: {
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      border: 'border-purple-500',
      text: 'text-purple-700 dark:text-purple-300',
      icon: 'text-purple-500',
      title: 'text-purple-800 dark:text-purple-200'
    }
  },
  warning: {
    icon: AlertTriangle,
    colors: {
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      border: 'border-yellow-500',
      text: 'text-yellow-800 dark:text-yellow-300',
      icon: 'text-yellow-600',
      title: 'text-yellow-900 dark:text-yellow-200'
    }
  },
  danger: {
    icon: AlertCircle,
    colors: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-500',
      text: 'text-red-700 dark:text-red-300',
      icon: 'text-red-500',
      title: 'text-red-800 dark:text-red-200'
    }
  },
  bug: {
    icon: Bug,
    colors: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-500',
      text: 'text-red-700 dark:text-red-300',
      icon: 'text-red-500',
      title: 'text-red-800 dark:text-red-200'
    }
  },
  example: {
    icon: FileText,
    colors: {
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      border: 'border-purple-500',
      text: 'text-purple-700 dark:text-purple-300',
      icon: 'text-purple-500',
      title: 'text-purple-800 dark:text-purple-200'
    }
  },
  quote: {
    icon: Quote,
    colors: {
      bg: 'bg-gray-50 dark:bg-gray-800',
      border: 'border-gray-400 dark:border-gray-600',
      text: 'text-gray-700 dark:text-gray-300',
      icon: 'text-gray-500',
      title: 'text-gray-800 dark:text-gray-200'
    }
  },
};

// ============================================================================
// KATEX MATH RENDERING
// ============================================================================

const renderMath = (latex, displayMode = false) => {
  try {
    // KaTeX is loaded from CDN
    if (typeof window !== 'undefined' && window.katex) {
      return window.katex.renderToString(latex, {
        displayMode: displayMode,
        throwOnError: false,
        output: 'html',
        strict: false,
      });
    }
  } catch (e) {
    console.error('KaTeX rendering error:', e);
  }
  // Fallback if KaTeX not loaded
  return `<code class="math-fallback">${latex}</code>`;
};

// Load KaTeX library
if (typeof window !== 'undefined' && !window.katex) {
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js';
  script.async = true;
  document.head.appendChild(script);
}

// ============================================================================
// ENHANCED MARKDOWN PARSER WITH REAL MATH
// ============================================================================

const parseMarkdown = (markdown) => {
  if (!markdown) return '';
  
  let html = markdown;
  
  // Store callout data for later rendering
  const callouts = [];
  let calloutIndex = 0;
  
  // Parse  callouts - capture entire blocks
  html = html.replace(/^> \[!(\w+)\]([+-]?)(.*)$((?:\n> .*)*)$/gm, (match, type, fold, title, content) => {
    const lowerType = type.toLowerCase();
    const config = calloutConfig[lowerType] || calloutConfig.note;
    const displayTitle = title.trim() || type.charAt(0).toUpperCase() + type.slice(1);
    
    // Extract content lines (remove > prefix)
    const contentLines = content.split('\n')
      .filter(line => line.trim())
      .map(line => line.replace(/^> /, ''))
      .join('\n');
    
    const placeholder = `__CALLOUT_${calloutIndex}__`;
    callouts.push({ config, displayTitle, content: contentLines, type: lowerType });
    calloutIndex++;
    
    return placeholder;
  });
  
  // Parse display math ($$...$$) - must be before inline math
  html = html.replace(/\$\$([\s\S]*?)\$\$/g, (match, equation) => {
    const rendered = renderMath(equation.trim(), true);
    return `<div class="math-display my-6 overflow-x-auto flex justify-center">${rendered}</div>`;
  });
  
  // Parse inline math ($...$)
  html = html.replace(/\$([^\$\n]+?)\$/g, (match, equation) => {
    const rendered = renderMath(equation.trim(), false);
    return `<span class="math-inline">${rendered}</span>`;
  });
  
  // Code blocks with syntax highlighting
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
    const language = lang || 'plaintext';
    return `<pre class="code-block bg-gray-900 text-gray-100 p-4 rounded-lg my-4 overflow-x-auto"><code class="language-${language}">${escapeHtml(code.trim())}</code></pre>`;
  });
  
  // Tables
  html = html.replace(/^\|(.+)\|$/gm, (match) => {
    if (match.includes('---')) {
      return '<tr class="border-b-2 border-gray-300 dark:border-gray-600">' + 
        match.slice(1, -1).split('|').map(() => '<th class="px-4 py-2 text-left font-semibold bg-gray-50 dark:bg-gray-800"></th>').join('') + 
        '</tr>';
    }
    const cells = match.slice(1, -1).split('|').map(cell => 
      `<td class="px-4 py-2 border-t border-gray-200 dark:border-gray-700">${cell.trim()}</td>`
    ).join('');
    return `<tr>${cells}</tr>`;
  });
  
  html = html.replace(/(<tr>.*<\/tr>\s*)+/g, (match) => {
    return `<table class="table-auto w-full my-6 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">${match}</table>`;
  });
  
  // Headers
  html = html.replace(/^##### (.*$)/gim, '<h5 class="text-lg font-bold mt-4 mb-2 text-gray-800 dark:text-gray-200">$1</h5>');
  html = html.replace(/^#### (.*$)/gim, '<h4 class="text-xl font-bold mt-4 mb-2 text-gray-800 dark:text-gray-200">$1</h4>');
  html = html.replace(/^### (.*$)/gim, '<h3 class="text-2xl font-bold mt-6 mb-3 text-gray-900 dark:text-gray-100 border-b border-gray-300 dark:border-gray-700 pb-2">$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2 class="text-3xl font-bold mt-8 mb-4 text-cyan-600 dark:text-cyan-400 border-b-2 border-gray-300 dark:border-gray-600 pb-2">$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1 class="text-4xl font-bold mt-8 mb-4 text-gray-900 dark:text-gray-100">$1</h1>');
  
  // Task lists
  html = html.replace(/- \[([ x])\] (.+)/gi, (match, checked, text) => {
    const isChecked = checked.toLowerCase() === 'x';
    return `<div class="flex items-center gap-2 my-1">
      <input type="checkbox" ${isChecked ? 'checked' : ''} disabled class="rounded" />
      <span class="${isChecked ? 'line-through text-gray-500' : ''}">${text}</span>
    </div>`;
  });
  
  // Strikethrough
  html = html.replace(/~~(.*?)~~/g, '<del class="text-gray-500 dark:text-gray-400">$1</del>');
  
  // Bold text
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900 dark:text-gray-100">$1</strong>');
  
  // Italic text
  html = html.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');
  
  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded text-sm font-mono text-pink-600 dark:text-pink-400">$1</code>');
  
  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 dark:text-blue-400 hover:underline font-medium">$1</a>');
  
  // Horizontal rules
  html = html.replace(/^---$/gm, '<hr class="my-8 border-t-2 border-gray-300 dark:border-gray-700" />');
  
  // Lists
  html = html.replace(/^\- (.+)$/gm, '<li class="ml-4 my-1">$1</li>');
  html = html.replace(/(<li class="ml-4 my-1">.*<\/li>\s*)+/g, '<ul class="list-disc list-inside my-4 space-y-1">$&</ul>');
  
  html = html.replace(/^\d+\. (.+)$/gm, '<li class="ml-4 my-1">$1</li>');
  html = html.replace(/(<li class="ml-4 my-1">.*<\/li>\s*)+/g, '<ol class="list-decimal list-inside my-4 space-y-1">$&</ol>');
  
  // Regular blockquotes
  html = html.replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-gray-400 dark:border-gray-600 pl-4 italic text-gray-700 dark:text-gray-300 my-4">$1</blockquote>');
  
  // Paragraphs
  html = html.replace(/\n\n/g, '</p><p class="my-4 text-gray-800 dark:text-gray-200 leading-relaxed">');
  html = '<p class="my-4 text-gray-800 dark:text-gray-200 leading-relaxed">' + html + '</p>';
  
  // Line breaks
  html = html.replace(/\n/g, '<br/>');
  
  return { html, callouts };
};

const escapeHtml = (text) => {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
};

const generateId = () => `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// ============================================================================
// CALLOUT COMPONENT
// ============================================================================

const Callout = ({ config, title, content, type }) => {
  const IconComponent = config.icon;
  const { bg, border, text, icon, title: titleColor } = config.colors;
  
  // Parse markdown in content
  const parsedContent = parseMarkdown(content);
  
  return (
    <div className={`callout ${bg} ${border} border-l-4 rounded-r-lg p-4 my-6 shadow-sm`}>
      <div className={`callout-title flex items-start gap-3 font-semibold ${titleColor} mb-2`}>
        <IconComponent className={`${icon} flex-shrink-0 mt-0.5`} size={20} />
        <span>{title}</span>
      </div>
      <div 
        className={`callout-content ${text} pl-7`}
        dangerouslySetInnerHTML={{ __html: parsedContent.html }}
      />
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function Editor() {
  const [vaults, setVaults] = useState([]);
  const [currentVaultId, setCurrentVaultId] = useState(null);
  const [currentFileId, setCurrentFileId] = useState(null);
  const [fileContent, setFileContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState('edit');

  useEffect(() => {
    loadVaults();
  }, []);

  const loadVaults = async () => {
    try {
      setIsLoading(true);
      const vaultListResult = await window.storage.get('vault-list');
      
      if (vaultListResult && vaultListResult.value) {
        const vaultIds = JSON.parse(vaultListResult.value);
        const loadedVaults = await Promise.all(
          vaultIds.map(async (id) => {
            const result = await window.storage.get(`vault-${id}`);
            return result ? JSON.parse(result.value) : null;
          })
        );
        
        const validVaults = loadedVaults.filter(v => v !== null);
        setVaults(validVaults);
        
        if (validVaults.length > 0) {
          setCurrentVaultId(validVaults[0].id);
          if (validVaults[0].files.length > 0) {
            setCurrentFileId(validVaults[0].files[0].id);
            setFileContent(validVaults[0].files[0].content);
          }
        }
      } else {
        await createDefaultVault();
      }
    } catch (error) {
      console.error('Error loading vaults:', error);
      await createDefaultVault();
    } finally {
      setIsLoading(false);
    }
  };

  const createDefaultVault = async () => {
    const defaultVault = {
      id: generateId(),
      name: 'My First Vault',
      files: [
        {
          id: generateId(),
          name: 'Welcome.md',
          content: `# MIT 18.01 Lecture 1: Introduction to Derivatives

#mathematics #calculus #mit-1801 #derivatives

\`\`\`javascript
console.log("Hello, World");
\`\`\`

---

## What Is a Derivative?

The derivative measures **how fast something changes**. That's it. Everything else is just formalization.

### Two Ways to Think About It

1. **Geometric**: The derivative is the **slope of the tangent line** to a curve at a point
2. **Physical**: The derivative is an **instantaneous rate of change** (like velocity from position)

These aren't different things—they're the same mathematical idea applied in different contexts.

---

## From Secant to Tangent

### The Secant Line Setup

Take two points on the curve:

- **P** at $(x_0, f(x_0))$
- **Q** at $(x_0 + \\Delta x, f(x_0 + \\Delta x))$

> [!example] Figure Reference
> **📊 See Figure 2 in your lecture notes:** "Geometric definition of the derivative"
> 
> This diagram labels $\\Delta x$ (horizontal distance) and $\\Delta f$ (vertical distance) between P and Q.

> [!info] The Difference Quotient
> The secant line through P and Q has slope:
> 
> $$\\frac{\\Delta f}{\\Delta x} = \\frac{f(x_0 + \\Delta x) - f(x_0)}{\\Delta x}$$
> 
> This is called the **difference quotient**. It's the average rate of change between P and Q.

### Taking the Limit

As $Q \\to P$ (i.e., as $\\Delta x \\to 0$), the secant line approaches the tangent line. The slope of the tangent is:

> [!important] Definition: The Derivative
> $$f'(x_0) = \\lim_{\\Delta x \\to 0} \\frac{f(x_0 + \\Delta x) - f(x_0)}{\\Delta x}$$
> 
> This limit—**when it exists**—is called the **derivative of $f$ at $x_0$**.

---

## Why You Can't Just Plug In $\\Delta x = 0$

Students constantly try to "evaluate at zero" immediately:

$$\\frac{f(x_0 + 0) - f(x_0)}{0} = \\frac{0}{0}$$

This is **indeterminate**. The entire game of calculus is doing algebra first to cancel the problematic $\\Delta x$ in the denominator, _then_ taking the limit.

> [!tip] Mental Model
> You're trying to compute a division by zero "correctly" by approaching it carefully from both sides.

---

## Worked Example: Derivative of $f(x) = \\frac{1}{x}$

**Goal**: Find $f'(x_0)$ using the definition.

### Step 1: Write the difference quotient

$$\\frac{\\Delta f}{\\Delta x} = \\frac{f(x_0 + \\Delta x) - f(x_0)}{\\Delta x} = \\frac{\\frac{1}{x_0 + \\Delta x} - \\frac{1}{x_0}}{\\Delta x}$$

### Step 2: Combine fractions in the numerator

Common denominator is $(x_0 + \\Delta x) \\cdot x_0$:

$$\\frac{1}{x_0 + \\Delta x} - \\frac{1}{x_0} = \\frac{x_0 - (x_0 + \\Delta x)}{(x_0 + \\Delta x)x_0} = \\frac{-\\Delta x}{(x_0 + \\Delta x)x_0}$$

### Step 3: Divide by $\\Delta x$

$$\\frac{\\Delta f}{\\Delta x} = \\frac{1}{\\Delta x} \\cdot \\frac{-\\Delta x}{(x_0 + \\Delta x)x_0} = \\frac{-1}{(x_0 + \\Delta x)x_0}$$

**Notice**: The $\\Delta x$ canceled. This always happens if the derivative exists.

### Step 4: Take the limit

$$f'(x_0) = \\lim_{\\Delta x \\to 0} \\frac{-1}{(x_0 + \\Delta x)x_0} = \\frac{-1}{x_0^2}$$

> [!success] Result
> The derivative of $\\frac{1}{x}$ is $\\frac{-1}{x^2}$. The function is always decreasing (negative derivative) and the rate of change is fastest near zero.

---

## Power Rule

> [!important] The Power Rule
> For any positive integer $n$:
> 
> $$\\frac{d}{dx}x^n = nx^{n-1}$$
> 
> The power "pulls down" as a coefficient and decreases by 1.

### Example Application

$$\\frac{d}{dx}(x^2 + 3x^{10}) = 2x + 30x^9$$

---

## Physical Example: The Pumpkin Drop

MIT students drop pumpkins from a 400-foot building. The height is:

$$y(t) = 400 - 16t^2$$

> [!question] Question
> What is the velocity at impact?

**Solution:**

Time to hit ground: $y = 0 \\implies t = 5$ seconds

Instantaneous velocity:
$$v(t) = y'(t) = \\frac{d}{dt}(400 - 16t^2) = -32t$$

At impact ($t = 5$):
$$v(5) = -32 \\cdot 5 = -160 \\text{ ft/s} \\approx 110 \\text{ mph}$$

> [!warning] Important
> The _average_ velocity (80 ft/s) tells you nothing about the speed at impact. The pumpkin is accelerating the entire time!

---

## Mental Checklist

> [!check] You should be able to explain:
> - What a derivative measures (in words, no formulas)
> - Why the tangent line is a limit of secant lines
> - Why you can't just plug $\\Delta x = 0$ into the difference quotient
> - The difference between average and instantaneous rate of change

---

*Created with the -style markdown editor*`
        }
      ]
    };
    
    setVaults([defaultVault]);
    setCurrentVaultId(defaultVault.id);
    setCurrentFileId(defaultVault.files[0].id);
    setFileContent(defaultVault.files[0].content);
    
    await saveVaultToStorage(defaultVault);
    await window.storage.set('vault-list', JSON.stringify([defaultVault.id]));
  };

  const saveVaultToStorage = async (vault) => {
    try {
      await window.storage.set(`vault-${vault.id}`, JSON.stringify(vault));
      const vaultIds = vaults.map(v => v.id);
      if (!vaultIds.includes(vault.id)) {
        vaultIds.push(vault.id);
      }
      await window.storage.set('vault-list', JSON.stringify(vaultIds));
    } catch (error) {
      console.error('Error saving vault:', error);
    }
  };

  const createVault = async () => {
    const vaultName = prompt('Enter vault name:');
    if (!vaultName) return;
    
    const newVault = {
      id: generateId(),
      name: vaultName,
      files: []
    };
    
    const updatedVaults = [...vaults, newVault];
    setVaults(updatedVaults);
    setCurrentVaultId(newVault.id);
    setCurrentFileId(null);
    setFileContent('');
    
    await saveVaultToStorage(newVault);
  };

  const deleteCurrentVault = async () => {
    if (vaults.length === 1) {
      alert('Cannot delete the last vault!');
      return;
    }
    
    if (!confirm(`Delete vault "${currentVault?.name}"?`)) return;
    
    try {
      await window.storage.delete(`vault-${currentVaultId}`);
    } catch (error) {
      console.error('Error deleting vault:', error);
    }
    
    const updatedVaults = vaults.filter(v => v.id !== currentVaultId);
    setVaults(updatedVaults);
    
    if (updatedVaults.length > 0) {
      setCurrentVaultId(updatedVaults[0].id);
      if (updatedVaults[0].files.length > 0) {
        setCurrentFileId(updatedVaults[0].files[0].id);
        setFileContent(updatedVaults[0].files[0].content);
      } else {
        setCurrentFileId(null);
        setFileContent('');
      }
    }
    
    await window.storage.set('vault-list', JSON.stringify(updatedVaults.map(v => v.id)));
  };

  const createFile = async () => {
    const fileName = prompt('Enter file name (with .md extension):');
    if (!fileName) return;
    
    const newFile = {
      id: generateId(),
      name: fileName.endsWith('.md') ? fileName : `${fileName}.md`,
      content: ''
    };
    
    const updatedVaults = vaults.map(vault => {
      if (vault.id === currentVaultId) {
        return { ...vault, files: [...vault.files, newFile] };
      }
      return vault;
    });
    
    setVaults(updatedVaults);
    setCurrentFileId(newFile.id);
    setFileContent('');
    
    const updatedVault = updatedVaults.find(v => v.id === currentVaultId);
    await saveVaultToStorage(updatedVault);
  };

  const deleteCurrentFile = async () => {
    if (!currentFileId) return;
    
    const currentFile = currentVault?.files.find(f => f.id === currentFileId);
    if (!confirm(`Delete "${currentFile?.name}"?`)) return;
    
    const updatedVaults = vaults.map(vault => {
      if (vault.id === currentVaultId) {
        return {
          ...vault,
          files: vault.files.filter(f => f.id !== currentFileId)
        };
      }
      return vault;
    });
    
    setVaults(updatedVaults);
    
    const updatedVault = updatedVaults.find(v => v.id === currentVaultId);
    if (updatedVault && updatedVault.files.length > 0) {
      setCurrentFileId(updatedVault.files[0].id);
      setFileContent(updatedVault.files[0].content);
    } else {
      setCurrentFileId(null);
      setFileContent('');
    }
    
    await saveVaultToStorage(updatedVault);
  };

  const saveCurrentFile = async () => {
    if (!currentFileId) return;
    
    const updatedVaults = vaults.map(vault => {
      if (vault.id === currentVaultId) {
        return {
          ...vault,
          files: vault.files.map(file => 
            file.id === currentFileId 
              ? { ...file, content: fileContent }
              : file
          )
        };
      }
      return vault;
    });
    
    setVaults(updatedVaults);
    
    const updatedVault = updatedVaults.find(v => v.id === currentVaultId);
    await saveVaultToStorage(updatedVault);
  };

  const selectFile = (fileId) => {
    if (currentFileId) {
      saveCurrentFile();
    }
    
    const file = currentVault?.files.find(f => f.id === fileId);
    if (file) {
      setCurrentFileId(fileId);
      setFileContent(file.content);
    }
    
    setIsSidebarOpen(false);
  };

  const currentVault = vaults.find(v => v.id === currentVaultId);
  const currentFile = currentVault?.files.find(f => f.id === currentFileId);

  useEffect(() => {
    if (currentFileId && fileContent !== currentFile?.content) {
      const timer = setTimeout(() => {
        saveCurrentFile();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [fileContent]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-gray-600 dark:text-gray-400">Loading your vault...</div>
      </div>
    );
  }

  // Parse markdown for preview
  const parsedContent = viewMode === 'preview' ? parseMarkdown(fileContent) : null;

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* HEADER */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between shadow-sm">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        
        <div className="flex items-center gap-2">
          <Folder size={20} className="text-purple-600 dark:text-purple-400" />
          <select
            value={currentVaultId || ''}
            onChange={(e) => {
              setCurrentVaultId(e.target.value);
              const vault = vaults.find(v => v.id === e.target.value);
              if (vault && vault.files.length > 0) {
                setCurrentFileId(vault.files[0].id);
                setFileContent(vault.files[0].content);
              } else {
                setCurrentFileId(null);
                setFileContent('');
              }
            }}
            className="px-3 py-1.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
          >
            {vaults.map(vault => (
              <option key={vault.id} value={vault.id}>
                {vault.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={createVault}
            className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm transition-colors shadow-sm"
            title="Create new vault"
          >
            <FolderPlus size={16} />
            <span className="hidden sm:inline">New Vault</span>
          </button>
          
          {vaults.length > 1 && (
            <button
              onClick={deleteCurrentVault}
              className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
              title="Delete current vault"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* SIDEBAR */}
        <aside 
          className={`
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            lg:translate-x-0 fixed lg:relative z-30 w-64 bg-white dark:bg-gray-800 
            border-r border-gray-200 dark:border-gray-700 h-full transition-transform duration-300 shadow-lg lg:shadow-none
          `}
        >
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h2 className="font-semibold text-gray-700 dark:text-gray-300">Files</h2>
            <button
              onClick={createFile}
              className="p-1.5 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded transition-colors"
              title="Create new file"
            >
              <Plus size={18} className="text-purple-600 dark:text-purple-400" />
            </button>
          </div>
          
          <div className="overflow-y-auto h-[calc(100%-60px)]">
            {currentVault?.files.length === 0 ? (
              <div className="p-4 text-sm text-gray-500 dark:text-gray-400 text-center">
                No files yet.<br/>Click + to create one!
              </div>
            ) : (
              <div className="p-2">
                {currentVault?.files.map(file => (
                  <button
                    key={file.id}
                    onClick={() => selectFile(file.id)}
                    className={`
                      w-full flex items-center gap-2 px-3 py-2 rounded text-left text-sm
                      transition-all duration-200
                      ${file.id === currentFileId 
                        ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 shadow-sm' 
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }
                    `}
                  >
                    <FileText size={16} />
                    <span className="truncate">{file.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </aside>

        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* MAIN EDITOR */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {currentFile ? (
            <>
              <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-2 flex items-center justify-between shadow-sm">
                <h3 className="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <FileText size={18} className="text-purple-600 dark:text-purple-400" />
                  {currentFile.name}
                </h3>
                
                <div className="flex items-center gap-2">
                  <div className="flex bg-gray-100 dark:bg-gray-700 rounded p-1">
                    <button
                      onClick={() => setViewMode('edit')}
                      className={`px-3 py-1 text-sm rounded transition-all ${
                        viewMode === 'edit'
                          ? 'bg-white dark:bg-gray-600 shadow text-purple-600 dark:text-purple-300 font-medium'
                          : 'text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setViewMode('preview')}
                      className={`px-3 py-1 text-sm rounded transition-all ${
                        viewMode === 'preview'
                          ? 'bg-white dark:bg-gray-600 shadow text-purple-600 dark:text-purple-300 font-medium'
                          : 'text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      Preview
                    </button>
                  </div>
                  
                  <button
                    onClick={deleteCurrentFile}
                    className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                    title="Delete file"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-hidden">
                {viewMode === 'edit' ? (
                  <textarea
                    value={fileContent}
                    onChange={(e) => setFileContent(e.target.value)}
                    className="w-full h-full p-6 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 resize-none focus:outline-none font-mono text-sm leading-relaxed"
                    placeholder="Start writing in markdown..."
                    spellCheck="false"
                  />
                ) : (
                  <div className="h-full overflow-y-auto p-8 bg-white dark:bg-gray-800">
                    <div className="prose prose-lg dark:prose-invert max-w-4xl mx-auto">
                      {/* Render callouts as React components */}
                      {parsedContent && (
                        <div>
                          {(() => {
                            let contentWithCallouts = parsedContent.html;
                            const components = [];
                            
                            // Replace callout placeholders with actual components
                            parsedContent.callouts.forEach((callout, index) => {
                              const placeholder = `__CALLOUT_${index}__`;
                              const parts = contentWithCallouts.split(placeholder);
                              
                              if (parts.length > 1) {
                                components.push(
                                  <div key={`before-${index}`} dangerouslySetInnerHTML={{ __html: parts[0] }} />
                                );
                                components.push(
                                  <Callout
                                    key={`callout-${index}`}
                                    config={callout.config}
                                    title={callout.displayTitle}
                                    content={callout.content}
                                    type={callout.type}
                                  />
                                );
                                contentWithCallouts = parts.slice(1).join(placeholder);
                              }
                            });
                            
                            // Add remaining content
                            if (contentWithCallouts) {
                              components.push(
                                <div key="remaining" dangerouslySetInnerHTML={{ __html: contentWithCallouts }} />
                              );
                            }
                            
                            return components;
                          })()}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
              <div className="text-center">
                <FileText size={64} className="mx-auto mb-4 opacity-30" />
                <p className="text-lg">Select a file or create a new one</p>
                <p className="text-sm mt-2">Click the + button in the sidebar to get started</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}