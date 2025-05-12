import React, { useState, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import workspaceSvg from '../Svg/svg workspace.svg';
import { useAuth } from '../context/AuthContext';
import { useTheme } from './ThemeProvider';

// Note component
const Note: React.FC<{ onClose: () => void }> = () => {
    const [title, setTitle] = useState('Untitled');

    const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value || 'Untitled');
    };

    return (
        <div className="flex-1 overflow-auto">
            <div className="max-w-4xl mx-auto px-8 py-6">
                {/* Top bar */}
                <div className="flex items-center justify-between mb-8">
                    <input
                        type="text"
                        value={title}
                        onChange={handleTitleChange}
                        className="text-4xl font-bold outline-none bg-transparent text-gray-900 dark:text-white flex-1"
                        placeholder="Untitled"
                    />
                    <div className="flex items-center gap-2 ml-4">
                        <button className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">
                            Publish
                        </button>
                        <button className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">
                            •••
                        </button>
                    </div>
                </div>
                {/* Add icon and cover buttons */}
                <div className="flex items-center gap-4 mb-8 text-sm text-gray-500">
                    <button className="flex items-center gap-2 hover:text-gray-900">
                        <span>🎯</span>
                        Add icon
                    </button>
                    <button className="flex items-center gap-2 hover:text-gray-900">
                        <span>🖼️</span>
                        Add cover
                    </button>
                </div>
                {/* Content area */}
                <textarea
                    placeholder="Type '/' for commands"
                    className="w-full min-h-[500px] outline-none resize-none bg-transparent text-gray-800 dark:text-gray-200 placeholder-gray-400"
                />
            </div>
        </div>
    );
};

export default function Workspace() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { user } = useAuth();
    const { theme } = useTheme();
    const navigate = useNavigate();

    const handleCreateNote = () => navigate('/note');

    return (
        <div className="flex h-screen bg-white dark:bg-gray-900">
            <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
            <main className="flex-1 overflow-auto">
                <section className="max-w-2xl mx-auto text-center mt-4">
                    <div className={`mb-6 transition-opacity duration-200 ${theme === 'dark' ? 'opacity-90' : 'opacity-100'}`}>
                        <img 
                            src={workspaceSvg} 
                            alt="Workspace Welcome" 
                            className="w-64 h-64 mx-auto"
                        />
                    </div>
                    <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                        Welcome to {user?.name || 'your'}'s Notion
                    </h1>
                    <button
                        onClick={handleCreateNote}
                        className="bg-black hover:bg-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 mx-auto transition-colors duration-200 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-gray-600 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                    >
                        <span className="material-icons text-lg">add</span>
                        <span className="font-medium">Create a note</span>
                    </button>
                </section>
            </main>
        </div>
    );
}
