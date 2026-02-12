"use client";

import React, { useState, useEffect } from 'react';
import { Upload, Plus, Trash2, Edit2, Save, X, ExternalLink, LogOut, Github, Folder, Code, BookOpen, FileText, FolderPlus, Menu, ChevronRight, ChevronDown, Download, FolderOpen } from 'lucide-react';

// Load KaTeX for math rendering
if (typeof document !== 'undefined') {
  if (!document.querySelector('link[href*="katex"]')) {
    const katexLink = document.createElement('link');
    katexLink.rel = 'stylesheet';
    katexLink.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css';
    document.head.appendChild(katexLink);
  }
  
  if (!window.katex) {
    const katexScript = document.createElement('script');
    katexScript.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js';
    katexScript.async = true;
    document.head.appendChild(katexScript);
  }
}

const generateId = () => `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const escapeHtml = (text) => {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return text.replace(/[&<>"']/g, m => map[m]);
};

const renderMath = (latex, displayMode = false) => {
  try {
    if (typeof window !== 'undefined' && window.katex) {
      return window.katex.renderToString(latex, {
        displayMode: displayMode,
        throwOnError: false,
        output: 'html',
        strict: false,
      });
    }
  } catch (e) {
    console.error('KaTeX error:', e);
  }
  return `<code>${latex}</code>`;
};

const parseMarkdown = (markdown) => {
  if (!markdown) return '';
  
  let html = markdown;
  
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
    return `<pre class="bg-gray-900 text-gray-100 p-4 rounded-lg my-4 overflow-x-auto"><code>${escapeHtml(code.trim())}</code></pre>`;
  });
  
  html = html.replace(/\$\$([\s\S]*?)\$\$/g, (match, equation) => {
    const rendered = renderMath(equation.trim(), true);
    return `<div class="math-display my-6 overflow-x-auto flex justify-center">${rendered}</div>`;
  });
  
  html = html.replace(/\$([^\$\n]+?)\$/g, (match, equation) => {
    const rendered = renderMath(equation.trim(), false);
    return `<span class="math-inline">${rendered}</span>`;
  });
  
  html = html.replace(/^##### (.*$)/gim, '<h5 class="text-lg font-bold mt-4 mb-2">$1</h5>');
  html = html.replace(/^#### (.*$)/gim, '<h4 class="text-xl font-bold mt-4 mb-2">$1</h4>');
  html = html.replace(/^### (.*$)/gim, '<h3 class="text-2xl font-bold mt-6 mb-3 border-b pb-2">$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2 class="text-3xl font-bold mt-8 mb-4 border-b-2 pb-2">$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1 class="text-4xl font-bold mt-8 mb-4">$1</h1>');
  
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');
  html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded text-sm">$1</code>');
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:underline">$1</a>');
  
  html = html.replace(/^\- (.+)$/gm, '<li class="ml-4 my-1">$1</li>');
  html = html.replace(/(<li class="ml-4 my-1">.*<\/li>\s*)+/g, '<ul class="list-disc list-inside my-4">$&</ul>');
  
  html = html.replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-gray-400 pl-4 italic my-4">$1</blockquote>');
  
  html = html.replace(/\n\n/g, '</p><p class="my-4">');
  html = '<p class="my-4">' + html + '</p>';
  html = html.replace(/\n/g, '<br/>');
  
  return html;
};

const TreeItem = ({ item, level, isSelected, onSelect, onContextMenu, theme }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const isFolder = item.type === 'folder';
  
  return (
    <div>
      <div
        onContextMenu={(e) => onContextMenu(e, item)}
        onClick={() => {
          if (isFolder) setIsExpanded(!isExpanded);
          else onSelect(item.id);
        }}
        className={`flex items-center gap-2 px-3 py-2 rounded text-sm cursor-pointer transition-all ${
          !isFolder && isSelected 
            ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' 
            : 'hover:bg-gray-100 dark:hover:bg-gray-700'
        }`}
        style={{ paddingLeft: `${level * 12 + 12}px` }}
      >
        {isFolder ? (
          <>
            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            {isExpanded ? <FolderOpen size={16} className="text-purple-500" /> : <Folder size={16} className="text-purple-500" />}
          </>
        ) : (
          <FileText size={16} />
        )}
        <span className="truncate flex-1">{item.name}</span>
      </div>
      {isFolder && isExpanded && item.children && (
        <div>
          {item.children.map(child => (
            <TreeItem
              key={child.id}
              item={child}
              level={level + 1}
              isSelected={isSelected}
              onSelect={onSelect}
              onContextMenu={onContextMenu}
              theme={theme}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const ContextMenu = ({ x, y, items, onClose }) => {
  useEffect(() => {
    const handleClick = () => onClose();
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [onClose]);
  
  return (
    <div 
      className="fixed bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 z-50 min-w-48"
      style={{ left: x, top: y }}
    >
      {items.map((item, idx) => (
        <button
          key={idx}
          onClick={(e) => {
            e.stopPropagation();
            item.action();
            onClose();
          }}
          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
        >
          {item.icon && <item.icon size={16} />}
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );
};

const NotesEditor = ({ onClose, theme }) => {
  const [vaults, setVaults] = useState([]);
  const [currentVaultId, setCurrentVaultId] = useState(null);
  const [currentFileId, setCurrentFileId] = useState(null);
  const [fileContent, setFileContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState('edit');
  const [contextMenu, setContextMenu] = useState(null);

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
            try {
              const result = await window.storage.get(`vault-${id}`);
              return result ? JSON.parse(result.value) : null;
            } catch {
              return null;
            }
          })
        );
        
        const validVaults = loadedVaults.filter(v => v !== null);
        setVaults(validVaults);
        
        if (validVaults.length > 0) {
          setCurrentVaultId(validVaults[0].id);
          const firstFile = findFirstFile(validVaults[0].items);
          if (firstFile) {
            setCurrentFileId(firstFile.id);
            setFileContent(firstFile.content);
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

  const findFirstFile = (items) => {
    for (const item of items) {
      if (item.type === 'file') return item;
      if (item.type === 'folder' && item.children) {
        const found = findFirstFile(item.children);
        if (found) return found;
      }
    }
    return null;
  };

  const findItemById = (items, id) => {
    for (const item of items) {
      if (item.id === id) return item;
      if (item.type === 'folder' && item.children) {
        const found = findItemById(item.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const createDefaultVault = async () => {
    const defaultVault = {
      id: generateId(),
      name: 'My Notes',
      items: [{
        id: generateId(),
        name: 'Welcome.md',
        type: 'file',
        content: `# Welcome to Notes

This is your personal markdown notes editor!

## Features
- **Markdown** formatting
- Math equations: $E = mc^2$
- Code blocks
- And more!

Start writing your notes here.`
      }]
    };
    
    setVaults([defaultVault]);
    setCurrentVaultId(defaultVault.id);
    setCurrentFileId(defaultVault.items[0].id);
    setFileContent(defaultVault.items[0].content);
    
    await saveVaultToStorage(defaultVault);
    await window.storage.set('vault-list', JSON.stringify([defaultVault.id]));
  };

  const saveVaultToStorage = async (vault) => {
    try {
      await window.storage.set(`vault-${vault.id}`, JSON.stringify(vault));
      const vaultIds = vaults.map(v => v.id);
      if (!vaultIds.includes(vault.id)) vaultIds.push(vault.id);
      await window.storage.set('vault-list', JSON.stringify(vaultIds));
    } catch (error) {
      console.error('Error saving vault:', error);
    }
  };

  const createVault = async () => {
    const vaultName = prompt('Enter vault name:');
    if (!vaultName) return;
    
    const newVault = { id: generateId(), name: vaultName, items: [] };
    const updatedVaults = [...vaults, newVault];
    setVaults(updatedVaults);
    setCurrentVaultId(newVault.id);
    
    await saveVaultToStorage(newVault);
  };

  const createItem = (parentId = null, type = 'file') => {
    const name = prompt(`Enter ${type} name:`, type === 'file' ? 'New File.md' : 'New Folder');
    if (!name) return;
    
    const newItem = {
      id: generateId(),
      name: type === 'file' && !name.endsWith('.md') ? `${name}.md` : name,
      type,
      ...(type === 'file' ? { content: '' } : { children: [] })
    };
    
    const updatedVaults = vaults.map(vault => {
      if (vault.id === currentVaultId) {
        if (!parentId) {
          return { ...vault, items: [...vault.items, newItem] };
        } else {
          const addToFolder = (items) => {
            return items.map(item => {
              if (item.id === parentId && item.type === 'folder') {
                return { ...item, children: [...(item.children || []), newItem] };
              }
              if (item.type === 'folder' && item.children) {
                return { ...item, children: addToFolder(item.children) };
              }
              return item;
            });
          };
          return { ...vault, items: addToFolder(vault.items) };
        }
      }
      return vault;
    });
    
    setVaults(updatedVaults);
    if (type === 'file') {
      setCurrentFileId(newItem.id);
      setFileContent('');
    }
    
    const updatedVault = updatedVaults.find(v => v.id === currentVaultId);
    saveVaultToStorage(updatedVault);
  };

  const deleteItem = (itemId) => {
    if (!window.confirm('Delete this item?')) return;
    
    const updatedVaults = vaults.map(vault => {
      if (vault.id === currentVaultId) {
        const removeItem = (items) => {
          return items.filter(item => {
            if (item.id === itemId) return false;
            if (item.type === 'folder' && item.children) {
              item.children = removeItem(item.children);
            }
            return true;
          });
        };
        return { ...vault, items: removeItem(vault.items) };
      }
      return vault;
    });
    
    setVaults(updatedVaults);
    if (currentFileId === itemId) {
      setCurrentFileId(null);
      setFileContent('');
    }
    
    const updatedVault = updatedVaults.find(v => v.id === currentVaultId);
    saveVaultToStorage(updatedVault);
  };

  const renameItem = (itemId) => {
    const vault = vaults.find(v => v.id === currentVaultId);
    const item = findItemById(vault.items, itemId);
    if (!item) return;
    
    const newName = prompt(`Rename ${item.type}:`, item.name);
    if (!newName || newName === item.name) return;
    
    const updatedVaults = vaults.map(v => {
      if (v.id === currentVaultId) {
        const renameInItems = (items) => {
          return items.map(i => {
            if (i.id === itemId) return { ...i, name: newName };
            if (i.type === 'folder' && i.children) {
              return { ...i, children: renameInItems(i.children) };
            }
            return i;
          });
        };
        return { ...v, items: renameInItems(v.items) };
      }
      return v;
    });
    
    setVaults(updatedVaults);
    const updatedVault = updatedVaults.find(v => v.id === currentVaultId);
    saveVaultToStorage(updatedVault);
  };

  const saveCurrentFile = async () => {
    if (!currentFileId) return;
    
    const updatedVaults = vaults.map(vault => {
      if (vault.id === currentVaultId) {
        const updateContent = (items) => {
          return items.map(item => {
            if (item.id === currentFileId && item.type === 'file') {
              return { ...item, content: fileContent };
            }
            if (item.type === 'folder' && item.children) {
              return { ...item, children: updateContent(item.children) };
            }
            return item;
          });
        };
        return { ...vault, items: updateContent(vault.items) };
      }
      return vault;
    });
    
    setVaults(updatedVaults);
    const updatedVault = updatedVaults.find(v => v.id === currentVaultId);
    await saveVaultToStorage(updatedVault);
  };

  const selectFile = (fileId) => {
    if (currentFileId) saveCurrentFile();
    
    const vault = vaults.find(v => v.id === currentVaultId);
    const file = findItemById(vault.items, fileId);
    if (file && file.type === 'file') {
      setCurrentFileId(fileId);
      setFileContent(file.content);
    }
    setIsSidebarOpen(false);
  };

  const handleContextMenu = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    
    const items = item.type === 'folder' ? [
      { label: 'New File', icon: FileText, action: () => createItem(item.id, 'file') },
      { label: 'New Folder', icon: FolderPlus, action: () => createItem(item.id, 'folder') },
      { label: 'Rename', icon: Edit2, action: () => renameItem(item.id) },
      { label: 'Delete', icon: Trash2, action: () => deleteItem(item.id) },
    ] : [
      { label: 'Rename', icon: Edit2, action: () => renameItem(item.id) },
      { label: 'Delete', icon: Trash2, action: () => deleteItem(item.id) },
    ];
    
    setContextMenu({ x: e.clientX, y: e.clientY, items });
  };

  const exportMarkdown = () => {
    if (!currentFileId) return;
    const vault = vaults.find(v => v.id === currentVaultId);
    const file = findItemById(vault.items, currentFileId);
    if (!file) return;
    
    const blob = new Blob([file.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  const currentVault = vaults.find(v => v.id === currentVaultId);
  const currentFile = currentVault ? findItemById(currentVault.items, currentFileId) : null;

  useEffect(() => {
    if (currentFileId && fileContent !== currentFile?.content) {
      const timer = setTimeout(() => saveCurrentFile(), 1000);
      return () => clearTimeout(timer);
    }
  }, [fileContent]);

  const bgColor = theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50';
  const cardBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const textColor = theme === 'dark' ? 'text-gray-100' : 'text-gray-900';
  const textSecondary = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';

  if (isLoading) {
    return (
      <div className={`fixed inset-0 z-50 ${bgColor} flex items-center justify-center`}>
        <div className={textSecondary}>Loading notes...</div>
      </div>
    );
  }

  return (
    <div className={`fixed inset-0 z-50 ${bgColor} flex flex-col`}>
      <header className={`${cardBg} border-b ${borderColor} px-4 py-3 flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
            <X size={20} />
          </button>
          <BookOpen size={20} className="text-purple-600" />
          <select 
            value={currentVaultId || ''} 
            onChange={(e) => {
              setCurrentVaultId(e.target.value);
              const vault = vaults.find(v => v.id === e.target.value);
              const firstFile = vault ? findFirstFile(vault.items) : null;
              if (firstFile) {
                setCurrentFileId(firstFile.id);
                setFileContent(firstFile.content);
              }
            }}
            className={`px-3 py-1.5 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} border ${borderColor} rounded text-sm`}
          >
            {vaults.map(vault => (
              <option key={vault.id} value={vault.id}>{vault.name}</option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center gap-2">
          {currentFile && (
            <button onClick={exportMarkdown} className="px-3 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 text-sm flex items-center gap-1">
              <Download size={16} />
              <span className="hidden sm:inline">Export</span>
            </button>
          )}
          <button onClick={createVault} className="px-3 py-1.5 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm flex items-center gap-1">
            <FolderPlus size={16} />
            <span className="hidden sm:inline">New Vault</span>
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <aside className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:relative z-30 w-64 ${cardBg} border-r ${borderColor} h-full transition-transform`}>
          <div className={`p-4 border-b ${borderColor} flex items-center justify-between`}>
            <h2 className={`font-semibold ${textColor}`}>Files</h2>
            <div className="flex gap-1">
              <button onClick={() => createItem(null, 'file')} className="p-1.5 hover:bg-purple-100 dark:hover:bg-purple-900/20 rounded">
                <Plus size={16} className="text-purple-600" />
              </button>
              <button onClick={() => createItem(null, 'folder')} className="p-1.5 hover:bg-purple-100 dark:hover:bg-purple-900/20 rounded">
                <FolderPlus size={16} className="text-purple-600" />
              </button>
            </div>
          </div>
          
          <div className="overflow-y-auto h-[calc(100%-60px)] p-2">
            {currentVault?.items.length === 0 ? (
              <div className={`p-4 text-sm ${textSecondary} text-center`}>
                No files yet. Create one to get started!
              </div>
            ) : (
              currentVault?.items.map(item => (
                <TreeItem
                  key={item.id}
                  item={item}
                  level={0}
                  isSelected={currentFileId === item.id}
                  onSelect={selectFile}
                  onContextMenu={handleContextMenu}
                  theme={theme}
                />
              ))
            )}
          </div>
        </aside>

        {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={() => setIsSidebarOpen(false)} />}

        <main className="flex-1 flex flex-col overflow-hidden">
          {currentFile ? (
            <>
              <div className={`${cardBg} border-b ${borderColor} px-4 py-2 flex items-center justify-between`}>
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                  <Menu size={20} />
                </button>
                <h3 className={`font-medium ${textColor} flex items-center gap-2`}>
                  <FileText size={18} className="text-purple-600" />
                  {currentFile.name}
                </h3>
                
                <div className="flex bg-gray-100 dark:bg-gray-700 rounded p-1">
                  <button 
                    onClick={() => setViewMode('edit')} 
                    className={`px-3 py-1 text-sm rounded ${viewMode === 'edit' ? 'bg-white dark:bg-gray-600 shadow text-purple-600' : textSecondary}`}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => setViewMode('preview')} 
                    className={`px-3 py-1 text-sm rounded ${viewMode === 'preview' ? 'bg-white dark:bg-gray-600 shadow text-purple-600' : textSecondary}`}
                  >
                    Preview
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-hidden">
                {viewMode === 'edit' ? (
                  <textarea 
                    value={fileContent} 
                    onChange={(e) => setFileContent(e.target.value)} 
                    className={`w-full h-full p-6 ${cardBg} ${textColor} resize-none focus:outline-none font-mono text-sm`}
                    placeholder="Start writing..."
                  />
                ) : (
                  <div className={`h-full overflow-y-auto p-8 ${cardBg}`}>
                    <div className="prose prose-lg dark:prose-invert max-w-4xl mx-auto" dangerouslySetInnerHTML={{ __html: parseMarkdown(fileContent) }} />
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className={`flex-1 flex items-center justify-center ${textSecondary}`}>
              <div className="text-center">
                <FileText size={64} className="mx-auto mb-4 opacity-30" />
                <p className="text-lg">Select a file or create a new one</p>
              </div>
            </div>
          )}
        </main>
      </div>

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          items={contextMenu.items}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
};

const PortfolioAdmin = () => {
  const [projects, setProjects] = useState([]);
  const [currentView, setCurrentView] = useState('home');
  const [editingProject, setEditingProject] = useState(null);
  const [showNotes, setShowNotes] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authView, setAuthView] = useState('login');
  const [theme, setTheme] = useState('light');
  const [uploadMethod, setUploadMethod] = useState('zip');
  const [isProcessing, setIsProcessing] = useState(false);
  const [authForm, setAuthForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    projectType: 'nextjs',
    demoType: 'image',
    demoUrl: '',
    githubUrl: '',
    zipFile: null,
    projectFiles: null
  });

  useEffect(() => {
    checkAuth();
    detectTheme();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadProjects();
    }
  }, [isAuthenticated]);

  const detectTheme = () => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
    
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      setTheme(e.matches ? 'dark' : 'light');
    });
  };

  const checkAuth = async () => {
    // No session checking for hardcoded testing
    setIsAuthenticated(false);
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    
    // HARDCODED LOGIN FOR TESTING
    const ADMIN_EMAIL = 'admin@test.com';
    const ADMIN_PASSWORD = 'admin123';
    
    if (authView === 'signup') {
      alert('Sign up is disabled for testing. Use:\nEmail: admin@test.com\nPassword: admin123');
      setAuthView('login');
      return;
    }
    
    // Check hardcoded credentials
    if (authForm.email === ADMIN_EMAIL && authForm.password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      resetAuthForm();
      alert('✅ Logged in successfully!');
    } else {
      alert('❌ Invalid credentials!\n\nUse:\nEmail: admin@test.com\nPassword: admin123');
    }
  };

  const createSession = async (email) => {
    const session = {
      email,
      expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000)
    };
    await window.storage.set('user_session', JSON.stringify(session));
  };

  const handleLogout = async () => {
    setIsAuthenticated(false);
    setProjects([]);
    setCurrentView('home');
    alert('Logged out successfully!');
  };

  const resetAuthForm = () => {
    setAuthForm({
      email: '',
      password: '',
      confirmPassword: '',
      name: ''
    });
  };

  const loadProjects = async () => {
    try {
      const stored = await window.storage.list('project:');
      if (stored && stored.keys) {
        const loadedProjects = await Promise.all(
          stored.keys.map(async (key) => {
            try {
              const result = await window.storage.get(key);
              return result ? JSON.parse(result.value) : null;
            } catch {
              return null;
            }
          })
        );
        setProjects(loadedProjects.filter(p => p !== null));
      }
    } catch (err) {
      console.log('No existing projects found');
    }
  };

  const generateSlug = (name) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'name' && !editingProject ? { slug: generateSlug(value) } : {})
    }));
  };

  const handleAuthInputChange = (e) => {
    const { name, value } = e.target;
    setAuthForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (type === 'zipFile') {
        setFormData(prev => ({
          ...prev,
          zipFile: file
        }));
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({
          ...prev,
          [type]: event.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const extractZipFile = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const uint8Array = new Uint8Array(e.target.result);
          resolve({
            name: file.name,
            size: file.size,
            data: btoa(String.fromCharCode.apply(null, uint8Array))
          });
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  const fetchFromGithub = async (githubUrl) => {
    try {
      setIsProcessing(true);
      
      let owner, repo, branch = 'main';
      const urlParts = githubUrl.replace('https://github.com/', '').split('/');
      
      if (urlParts.length >= 2) {
        owner = urlParts[0];
        repo = urlParts[1];
        
        if (urlParts.includes('tree') && urlParts.length >= 4) {
          branch = urlParts[3];
        }
      } else {
        throw new Error('Invalid GitHub URL format');
      }

      const apiUrl = `https://api.github.com/repos/${owner}/${repo}/zipball/${branch}`;
      
      return {
        source: 'github',
        url: githubUrl,
        downloadUrl: apiUrl,
        owner,
        repo,
        branch
      };
    } catch (err) {
      throw new Error('Failed to fetch from GitHub: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      let projectFilesData = null;

      if (uploadMethod === 'zip' && formData.zipFile) {
        projectFilesData = await extractZipFile(formData.zipFile);
      } else if (uploadMethod === 'github' && formData.githubUrl) {
        projectFilesData = await fetchFromGithub(formData.githubUrl);
      }

      const project = {
        id: editingProject?.id || Date.now().toString(),
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        projectType: formData.projectType,
        demoType: formData.demoType,
        demoUrl: formData.demoUrl,
        uploadMethod,
        projectFiles: projectFilesData,
        createdAt: editingProject?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await window.storage.set(`project:${project.slug}`, JSON.stringify(project));
      await loadProjects();
      resetForm();
      setCurrentView('projects');
    } catch (err) {
      alert('Error saving project: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      slug: project.slug,
      description: project.description,
      projectType: project.projectType,
      demoType: project.demoType,
      demoUrl: project.demoUrl,
      githubUrl: project.projectFiles?.url || '',
      zipFile: null,
      projectFiles: project.projectFiles
    });
    setUploadMethod(project.uploadMethod || 'zip');
    setCurrentView('admin');
  };

  const handleDelete = async (project) => {
    if (window.confirm(`Delete "${project.name}"?`)) {
      try {
        await window.storage.delete(`project:${project.slug}`);
        await loadProjects();
      } catch (err) {
        alert('Error deleting project: ' + err.message);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      projectType: 'nextjs',
      demoType: 'image',
      demoUrl: '',
      githubUrl: '',
      zipFile: null,
      projectFiles: null
    });
    setEditingProject(null);
    setUploadMethod('zip');
  };

  const getProjectTypeIcon = (type) => {
    switch(type) {
      case 'nextjs': return '⚡';
      case 'react': return '⚛️';
      case 'html': return '🌐';
      case 'expo': return '📱';
      case 'vue': return '💚';
      case 'angular': return '🅰️';
      case 'svelte': return '🔥';
      default: return '📦';
    }
  };

  const getProjectTypeName = (type) => {
    const types = {
      nextjs: 'Next.js',
      react: 'React',
      html: 'HTML/CSS/JS',
      expo: 'Expo/React Native',
      vue: 'Vue.js',
      angular: 'Angular',
      svelte: 'Svelte'
    };
    return types[type] || type;
  };

  const bgColor = theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50';
  const cardBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const textColor = theme === 'dark' ? 'text-gray-100' : 'text-gray-900';
  const textSecondary = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const inputBg = theme === 'dark' ? 'bg-gray-700' : 'bg-white';
  const inputBorder = theme === 'dark' ? 'border-gray-600' : 'border-gray-300';
  const hoverBg = theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100';

  if (showNotes) {
    return <NotesEditor onClose={() => setShowNotes(false)} theme={theme} />;
  }

  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen ${bgColor} flex items-center justify-center px-4`}>
        <div className={`${cardBg} rounded-lg shadow-xl p-8 w-full max-w-md`}>
          <div className="text-center mb-8">
            <h1 className={`text-3xl font-bold ${textColor} mb-2`}>
              Admin Login
            </h1>
            <p className={textSecondary}>
              Test Credentials
            </p>
            <div className={`mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg`}>
              <p className="text-sm font-mono text-blue-900 dark:text-blue-100">
                <strong>Email:</strong> admin@test.com<br/>
                <strong>Password:</strong> admin123
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium ${textSecondary} mb-2`}>
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={authForm.email}
                onChange={handleAuthInputChange}
                required
                className={`w-full px-4 py-3 ${inputBg} border ${inputBorder} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${textColor}`}
                placeholder="admin@test.com"
              />
            </div>

            <div>
              <label className={`block text-sm font-medium ${textSecondary} mb-2`}>
                Password
              </label>
              <input
                type="password"
                name="password"
                value={authForm.password}
                onChange={handleAuthInputChange}
                required
                className={`w-full px-4 py-3 ${inputBg} border ${inputBorder} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${textColor}`}
                placeholder="admin123"
              />
            </div>

            <button
              onClick={handleAuthSubmit}
              className="w-full bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 font-medium transition-colors"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  const ProjectCard = ({ project }) => (
    <div className={`${cardBg} rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow`}>
      <div className={`aspect-video ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} relative`}>
        {project.demoType === 'image' && project.demoUrl && (
          <img src={project.demoUrl} alt={project.name} className="w-full h-full object-cover" />
        )}
        {project.demoType === 'gif' && project.demoUrl && (
          <img src={project.demoUrl} alt={project.name} className="w-full h-full object-cover" />
        )}
        {project.demoType === 'video' && project.demoUrl && (
          <video src={project.demoUrl} autoPlay loop muted className="w-full h-full object-cover" />
        )}
        {!project.demoUrl && (
          <div className={`flex items-center justify-center h-full ${textSecondary}`}>
            No preview available
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className={`${theme === 'dark' ? 'bg-gray-900/80' : 'bg-white/90'} px-3 py-1 rounded-full text-sm font-medium ${textColor} flex items-center gap-1`}>
            <span>{getProjectTypeIcon(project.projectType)}</span>
            {getProjectTypeName(project.projectType)}
          </span>
        </div>
        {project.uploadMethod === 'github' && (
          <div className="absolute top-3 right-3">
            <Github className={`${theme === 'dark' ? 'text-white' : 'text-gray-700'} bg-white/90 dark:bg-gray-900/80 rounded-full p-1`} size={24} />
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className={`text-xl font-bold mb-2 ${textColor}`}>{project.name}</h3>
        <p className={`${textSecondary} text-sm mb-4 line-clamp-2`}>{project.description}</p>
        <div className="flex gap-2">
          <button
            onClick={() => window.open(`/projects/${project.slug}`, '_blank')}
            className="flex-1 bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 flex items-center justify-center gap-2 text-sm"
          >
            <ExternalLink size={16} />
            View Live
          </button>
          <button
            onClick={() => handleEdit(project)}
            className={`${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} ${textColor} px-3 py-2 rounded`}
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => handleDelete(project)}
            className={`${theme === 'dark' ? 'bg-red-900/30 hover:bg-red-900/50' : 'bg-red-100 hover:bg-red-200'} text-red-600 px-3 py-2 rounded`}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen ${bgColor}`}>
      <nav className={`${cardBg} shadow-sm border-b ${borderColor}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <button
                onClick={() => setCurrentView('home')}
                className={`text-xl font-bold ${textColor} hover:opacity-70`}
              >
                Portfolio
              </button>
              <button
                onClick={() => setCurrentView('projects')}
                className={`${textSecondary} ${hoverBg} px-3 py-2 rounded`}
              >
                Projects
              </button>
              <button
                onClick={() => setShowNotes(true)}
                className={`${textSecondary} ${hoverBg} px-3 py-2 rounded flex items-center gap-2`}
              >
                <BookOpen size={18} />
                Notes
              </button>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  resetForm();
                  setCurrentView('admin');
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2"
              >
                <Plus size={20} />
                New Project
              </button>
              <button
                onClick={handleLogout}
                className={`${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} ${textColor} px-4 py-2 rounded-lg flex items-center gap-2`}
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'home' && (
          <div className="text-center py-20">
            <h1 className={`text-4xl font-bold ${textColor} mb-4`}>Welcome to My Portfolio</h1>
            <p className={`${textSecondary} mb-8`}>This is your home page - customize it as you like!</p>
            <button
              onClick={() => setCurrentView('projects')}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
            >
              View My Projects
            </button>
          </div>
        )}

        {currentView === 'projects' && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h1 className={`text-3xl font-bold ${textColor}`}>My Projects</h1>
              <span className={textSecondary}>{projects.length} project{projects.length !== 1 ? 's' : ''}</span>
            </div>
            {projects.length === 0 ? (
              <div className={`text-center py-20 ${cardBg} rounded-lg`}>
                <Upload size={48} className={`mx-auto ${textSecondary} mb-4`} />
                <h3 className={`text-xl font-semibold ${textColor} mb-2`}>No projects yet</h3>
                <p className={`${textSecondary} mb-6`}>Start by creating your first project</p>
                <button
                  onClick={() => {
                    resetForm();
                    setCurrentView('admin');
                  }}
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
                >
                  Create Project
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map(project => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            )}
          </div>
        )}

        {currentView === 'admin' && (
          <div className="max-w-2xl mx-auto">
            <div className={`${cardBg} rounded-lg shadow-md p-6`}>
              <div className="flex justify-between items-center mb-6">
                <h2 className={`text-2xl font-bold ${textColor}`}>
                  {editingProject ? 'Edit Project' : 'Create New Project'}
                </h2>
                {editingProject && (
                  <button onClick={resetForm} className={textSecondary}>
                    <X size={24} />
                  </button>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <label className={`block text-sm font-medium ${textSecondary} mb-2`}>
                    Project Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-2 ${inputBg} border ${inputBorder} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${textColor}`}
                    placeholder="My Awesome Project"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium ${textSecondary} mb-2`}>
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-2 ${inputBg} border ${inputBorder} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${textColor}`}
                    placeholder="my-awesome-project"
                  />
                  <p className={`text-sm ${textSecondary} mt-1`}>
                    Will be available at: projects.domain.co.za/{formData.slug || 'project-name'}
                  </p>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${textSecondary} mb-2`}>
                    Project Type *
                  </label>
                  <select
                    name="projectType"
                    value={formData.projectType}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 ${inputBg} border ${inputBorder} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${textColor}`}
                  >
                    <option value="nextjs">⚡ Next.js</option>
                    <option value="react">⚛️ React</option>
                    <option value="html">🌐 HTML/CSS/JS</option>
                    <option value="expo">📱 Expo/React Native</option>
                    <option value="vue">💚 Vue.js</option>
                    <option value="angular">🅰️ Angular</option>
                    <option value="svelte">🔥 Svelte</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${textSecondary} mb-2`}>
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className={`w-full px-4 py-2 ${inputBg} border ${inputBorder} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${textColor}`}
                    placeholder="Describe your project..."
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium ${textSecondary} mb-2`}>
                    Demo Type
                  </label>
                  <select
                    name="demoType"
                    value={formData.demoType}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 ${inputBg} border ${inputBorder} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${textColor}`}
                  >
                    <option value="image">Image</option>
                    <option value="gif">GIF</option>
                    <option value="video">Video</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${textSecondary} mb-2`}>
                    Upload Demo {formData.demoType === 'image' ? 'Image' : formData.demoType === 'gif' ? 'GIF' : 'Video'}
                  </label>
                  <input
                    type="file"
                    accept={formData.demoType === 'video' ? 'video/*' : 'image/*'}
                    onChange={(e) => handleFileUpload(e, 'demoUrl')}
                    className={`w-full ${textColor}`}
                  />
                  {formData.demoUrl && (
                    <div className={`mt-3 border ${borderColor} rounded-lg overflow-hidden`}>
                      {formData.demoType === 'video' ? (
                        <video src={formData.demoUrl} controls className="w-full" />
                      ) : (
                        <img src={formData.demoUrl} alt="Preview" className="w-full" />
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label className={`block text-sm font-medium ${textSecondary} mb-2`}>
                    Upload Method
                  </label>
                  <div className="flex gap-3 mb-4">
                    <button
                      type="button"
                      onClick={() => setUploadMethod('zip')}
                      className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${
                        uploadMethod === 'zip'
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : `${borderColor} ${hoverBg}`
                      }`}
                    >
                      <Folder size={24} className="mx-auto mb-1" />
                      <span className={`text-sm font-medium ${textColor}`}>ZIP File</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setUploadMethod('github')}
                      className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${
                        uploadMethod === 'github'
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : `${borderColor} ${hoverBg}`
                      }`}
                    >
                      <Github size={24} className="mx-auto mb-1" />
                      <span className={`text-sm font-medium ${textColor}`}>GitHub</span>
                    </button>
                  </div>

                  {uploadMethod === 'zip' ? (
                    <div>
                      <label className={`block text-sm font-medium ${textSecondary} mb-2`}>
                        Upload Project ZIP *
                      </label>
                      <input
                        type="file"
                        accept=".zip"
                        onChange={(e) => handleFileUpload(e, 'zipFile')}
                        className={`w-full ${textColor}`}
                      />
                      {formData.zipFile && (
                        <p className={`text-sm ${textSecondary} mt-2`}>
                          ✓ Selected: {formData.zipFile.name} ({(formData.zipFile.size / 1024 / 1024).toFixed(2)} MB)
                        </p>
                      )}
                      <p className={`text-sm ${textSecondary} mt-1`}>
                        Upload your project as a ZIP file. The ZIP will be automatically extracted and deployed.
                      </p>
                    </div>
                  ) : (
                    <div>
                      <label className={`block text-sm font-medium ${textSecondary} mb-2`}>
                        GitHub Repository URL *
                      </label>
                      <input
                        type="url"
                        name="githubUrl"
                        value={formData.githubUrl}
                        onChange={handleInputChange}
                        placeholder="https://github.com/username/repository"
                        className={`w-full px-4 py-2 ${inputBg} border ${inputBorder} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${textColor}`}
                      />
                      <p className={`text-sm ${textSecondary} mt-1`}>
                        Enter the full GitHub repository URL. The repository will be cloned and deployed automatically.
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isProcessing}
                    className={`flex-1 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 flex items-center justify-center gap-2 font-medium ${
                      isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <Save size={20} />
                        {editingProject ? 'Update Project' : 'Create Project'}
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentView('projects')}
                    disabled={isProcessing}
                    className={`px-6 py-3 border ${inputBorder} rounded-lg ${hoverBg} ${textColor} font-medium`}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default PortfolioAdmin;