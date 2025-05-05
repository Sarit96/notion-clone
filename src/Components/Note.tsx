import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Command {
    id: string;
    title: string;
    description: string;
    icon: string;
    action: () => void;
}

interface Icon {
    emoji: string;
    name: string;
}

interface Cover {
    url: string;
    name: string;
}

const icons: Icon[] = [
    { emoji: '📝', name: 'Note' },
    { emoji: '📚', name: 'Book' },
    { emoji: '🎯', name: 'Target' },
    { emoji: '💡', name: 'Idea' },
    { emoji: '📊', name: 'Chart' },
    { emoji: '📅', name: 'Calendar' },
    { emoji: '📌', name: 'Pin' },
    { emoji: '🔍', name: 'Search' },
    { emoji: '📱', name: 'Phone' },
    { emoji: '💻', name: 'Laptop' },
];

const covers: Cover[] = [
    { url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085', name: 'Code' },
    { url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa', name: 'Space' },
    { url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb', name: 'Mountain' },
    { url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba', name: 'Ocean' },
    { url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b', name: 'Forest' },
];

export default function Note() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [title, setTitle] = useState('Untitled');
    const [content, setContent] = useState('');
    const [hasContent, setHasContent] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [showCommandMenu, setShowCommandMenu] = useState(false);
    const [commandSearch, setCommandSearch] = useState('');
    const [showIconModal, setShowIconModal] = useState(false);
    const [showCoverModal, setShowCoverModal] = useState(false);
    const [selectedIcon, setSelectedIcon] = useState<Icon | null>(null);
    const [selectedCover, setSelectedCover] = useState<Cover | null>(null);
    const { user } = useAuth();
    const saveTimeoutRef = useRef<NodeJS.Timeout>();
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const navigate = useNavigate();

    // Load note data from API
    // Load note data when component mounts
    useEffect(() => {
        const loadNote = async () => {
            try {
                // Check if user is authenticated (token or Google user)
                const token = localStorage.getItem('token');
                const googleUser = localStorage.getItem('googleUser');
                
                if (!token && !googleUser) {
                    // Redirect to login if not authenticated
                    console.error('No authentication found');
                    navigate('/login');
                    return;
                }

                // Fetch note data from API
                console.log('Loading note data...');
                const response = await axios.get('/api/notes');
                console.log('Note data received:', response.data);
                
                const note = response.data;
                if (note) {
                    // Set note title, content, and last saved time
                    setTitle(note.title || 'Untitled');
                    setContent(note.content || '');
                    setHasContent((note.content || '').length > 0);
                    setLastSaved(note.last_saved ? new Date(note.last_saved) : null);
                    // Parse and set icon if present
                    if (note.icon) {
                        try {
                            setSelectedIcon(JSON.parse(note.icon));
                        } catch (e) {
                            console.error('Error parsing icon:', e);
                        }
                    }
                    // Set cover if present
                    if (note.cover_url) {
                        setSelectedCover({ url: note.cover_url, name: 'Cover' });
                    }
                }
            } catch (error: any) {
                // Handle errors and redirect to login if unauthorized
                console.error('Error loading note:', error);
                if (error.response?.status === 401) {
                    navigate('/login');
                }
            }
        };

        loadNote();
    }, [navigate]);

    const commands: Command[] = [
        {
            id: 'heading1',
            title: 'Heading 1',
            description: 'Big section heading',
            icon: 'H1',
            action: () => insertText('# '),
        },
        {
            id: 'heading2',
            title: 'Heading 2',
            description: 'Medium section heading',
            icon: 'H2',
            action: () => insertText('## '),
        },
        {
            id: 'heading3',
            title: 'Heading 3',
            description: 'Small section heading',
            icon: 'H3',
            action: () => insertText('### '),
        },
        {
            id: 'bullet',
            title: 'Bullet List',
            description: 'Create a simple bullet list',
            icon: '•',
            action: () => insertText('- '),
        },
        {
            id: 'number',
            title: 'Numbered List',
            description: 'Create a numbered list',
            icon: '1.',
            action: () => insertText('1. '),
        },
        {
            id: 'todo',
            title: 'To-do List',
            description: 'Track tasks with a to-do list',
            icon: '☐',
            action: () => insertText('- [ ] '),
        },
        {
            id: 'quote',
            title: 'Quote',
            description: 'Capture a quote',
            icon: '"',
            action: () => insertText('> '),
        },
        {
            id: 'code',
            title: 'Code',
            description: 'Capture a code snippet',
            icon: '</>',
            action: () => insertText('```\n\n```'),
        },
    ];

    const filteredCommands = commands.filter(cmd => 
        cmd.title.toLowerCase().includes(commandSearch.toLowerCase()) ||
        cmd.description.toLowerCase().includes(commandSearch.toLowerCase())
    );

    const insertText = (text: string) => {
        if (textareaRef.current) {
            const start = textareaRef.current.selectionStart;
            const end = textareaRef.current.selectionEnd;
            const newContent = content.substring(0, start) + text + content.substring(end);
            setContent(newContent);
            setShowCommandMenu(false);
            setCommandSearch('');
            
            // Move cursor after inserted text
            setTimeout(() => {
                if (textareaRef.current) {
                    const newCursorPos = start + text.length;
                    textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
                }
            }, 0);
        }
    };

    // Update document title when note title changes
    useEffect(() => {
        document.title = `${title} | Notion`;
    }, [title]);

    // Auto-save functionality
    // Auto-save note when title, content, icon, or cover changes
    useEffect(() => {
        // Clear previous save timeout if any
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }

        // Skip saving if nothing to save
        if (!title && !content && !selectedIcon && !selectedCover) {
            return;
        }

        // Set a timeout to save after 1 second of inactivity
        saveTimeoutRef.current = setTimeout(async () => {
            setIsSaving(true);
            try {
                // Save note to API
                const response = await axios.put('/api/notes', {
                    title,
                    content,
                    icon: selectedIcon ? JSON.stringify(selectedIcon) : null,
                    cover_url: selectedCover?.url || null
                });
                setLastSaved(new Date());
            } catch (error: any) {
                // Redirect to login if unauthorized
                if (error.response?.status === 401) {
                    navigate('/login');
                }
            } finally {
                setIsSaving(false);
            }
        }, 1000);

        // Cleanup timeout on unmount or before next effect
        return () => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
        };
    }, [title, content, selectedIcon, selectedCover, navigate]);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    };

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newContent = e.target.value;
        setContent(newContent);
        setHasContent(newContent.length > 0);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        const target = e.target as HTMLTextAreaElement;
        
        // Open command menu if '/' is pressed at start of textarea
        if (e.key === '/' && target.selectionStart === 0) {
            e.preventDefault();
            setShowCommandMenu(true);
        } 
        // Handle commands when menu is open
        else if (showCommandMenu) {
            // Close menu on Escape
            if (e.key === 'Escape') {
                e.preventDefault();
                setShowCommandMenu(false);
                setCommandSearch('');
            } 
            // Execute first command on Enter
            else if (e.key === 'Enter' && filteredCommands.length > 0) {
                e.preventDefault();
                filteredCommands[0].action();
            } 
            // Close menu on Backspace if search is empty
            else if (e.key === 'Backspace' && commandSearch === '') {
                e.preventDefault();
                setShowCommandMenu(false);
            }
        }
    };

    const handleCommandSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCommandSearch(e.target.value);
    };

    const handleIconSelect = (icon: Icon) => {
        setSelectedIcon(icon);
        setShowIconModal(false);
    };

    const handleCoverSelect = (cover: Cover) => {
        setSelectedCover(cover);
        setShowCoverModal(false);
    };

    return (
        <div className="flex h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
            <Sidebar 
                isCollapsed={isCollapsed} 
                setIsCollapsed={setIsCollapsed}
                currentPageTitle={title}
            />
            
            <div className="flex-1 overflow-auto scroll-smooth">
                <div className={`max-w-4xl mx-auto px-8 py-8 ${!hasContent ? 'h-full flex flex-col' : ''}`}>
                    {/* Status bar */}
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-6">
                        <div className="flex items-center gap-2">
                            {isSaving ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                    <span>Saving...</span>
                                </div>
                            ) : lastSaved ? (
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-400">Last saved</span>
                                    <span className="font-medium">{lastSaved.toLocaleTimeString()}</span>
                                </div>
                            ) : null}
                        </div>
                    </div>
                    
                    <div className={`${!hasContent ? 'flex-1 flex flex-col items-center justify-center -mt-20' : ''}`}>
                        {/* Cover image */}
                        {selectedCover && (
                            <div className="w-full h-56 mb-8 rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl">
                                <img
                                    src={selectedCover.url}
                                    alt={selectedCover.name}
                                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                        )}

                        {/* Title input with icon */}
                        <div className="flex items-center gap-4 mb-8">
                            {selectedIcon && (
                                <div className="text-4xl transform hover:scale-110 transition-transform duration-200">
                                    {selectedIcon.emoji}
                                </div>
                            )}
                            <input
                                type="text"
                                value={title}
                                onChange={handleTitleChange}
                                className="text-4xl font-bold outline-none bg-transparent text-gray-900 dark:text-white text-center hover:bg-gray-50 dark:hover:bg-gray-800 px-4 py-2 rounded-lg cursor-text transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                                placeholder="Untitled"
                                spellCheck={false}
                                onClick={(e) => e.currentTarget.select()}
                            />
                        </div>

                        {/* Add icon and cover buttons */}
                        <div className="flex items-center gap-4 mb-8 text-sm">
                            <button 
                                onClick={() => setShowIconModal(true)}
                                className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                            >
                                <span className="text-xl">{selectedIcon?.emoji || '🎯'}</span>
                                {selectedIcon ? 'Change icon' : 'Add icon'}
                            </button>
                            <button 
                                onClick={() => setShowCoverModal(true)}
                                className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                            >
                                <span className="text-xl">{selectedCover ? '🖼️' : '🖼️'}</span>
                                {selectedCover ? 'Change cover' : 'Add cover'}
                            </button>
                        </div>

                        {/* Content area */}
                        <div className="w-full relative">
                            <textarea
                                ref={textareaRef}
                                value={content}
                                placeholder="Type '/' for commands"
                                onChange={handleContentChange}
                                onKeyDown={handleKeyDown}
                                className={`w-full outline-none resize-none bg-transparent text-gray-800 dark:text-gray-200 placeholder-gray-400 text-center transition-all duration-200 ${
                                    !hasContent 
                                        ? 'min-h-[100px]' 
                                        : 'min-h-[500px] text-left px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'
                                }`}
                            />
                            
                            {/* Command menu */}
                            {showCommandMenu && (
                                <div className="absolute top-0 left-0 w-80 bg-white dark:bg-gray-800 shadow-xl rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden transform transition-all duration-200">
                                    <input
                                        type="text"
                                        value={commandSearch}
                                        onChange={handleCommandSearch}
                                        placeholder="Search commands..."
                                        className="w-full px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                                        autoFocus
                                    />
                                    <div className="max-h-64 overflow-y-auto">
                                        {filteredCommands.map((cmd) => (
                                            <button
                                                key={cmd.id}
                                                onClick={() => cmd.action()}
                                                className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 transition-colors duration-200"
                                            >
                                                <span className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg">
                                                    {cmd.icon}
                                                </span>
                                                <div>
                                                    <div className="font-medium text-gray-900 dark:text-white">
                                                        {cmd.title}
                                                    </div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                        {cmd.description}
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                        {filteredCommands.length === 0 && (
                                            <div className="px-4 py-3 text-gray-500 dark:text-gray-400">
                                                No commands found
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action buttons - only show when there's content */}
                    {hasContent && (
                        <div className="flex items-center gap-2 justify-end mt-6">
                            <button className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200">
                                Share
                            </button>
                            <button className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200">
                                ••• 
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Icon selection modal */}
            {showIconModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-96 max-h-[80vh] overflow-hidden transform transition-all duration-300">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Choose an icon</h2>
                        </div>
                        <div className="p-6 grid grid-cols-5 gap-4 max-h-[60vh] overflow-y-auto">
                            {icons.map((icon) => (
                                <button
                                    key={icon.emoji}
                                    onClick={() => handleIconSelect(icon)}
                                    className="w-12 h-12 flex items-center justify-center text-2xl hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 transform hover:scale-110"
                                >
                                    {icon.emoji}
                                </button>
                            ))}
                        </div>
                        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                            <button
                                onClick={() => setShowIconModal(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Cover selection modal */}
            {showCoverModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-96 max-h-[80vh] overflow-hidden transform transition-all duration-300">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Choose a cover</h2>
                        </div>
                        <div className="p-6 grid grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto">
                            {covers.map((cover) => (
                                <button
                                    key={cover.url}
                                    onClick={() => handleCoverSelect(cover)}
                                    className="aspect-video rounded-lg overflow-hidden hover:ring-2 hover:ring-blue-500 transition-all duration-200 transform hover:scale-105"
                                >
                                    <img
                                        src={cover.url}
                                        alt={cover.name}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                            <button
                                onClick={() => setShowCoverModal(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
} 