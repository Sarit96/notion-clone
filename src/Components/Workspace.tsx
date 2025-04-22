import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { ChevronLeft, ChevronRight } from './Icons';
import workspaceSvg from '../Svg/svg workspace.svg';
import { useAuth } from '../context/AuthContext';
import { useTheme } from './ThemeProvider';

export default function Workspace() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { user } = useAuth();
    const { theme } = useTheme();

    return (
        <div className="flex h-screen bg-white dark:bg-gray-900">
            {/* Sidebar */}
            <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

            {/* Main content */}
            <div className="flex-1 overflow-auto">
                <div className="max-w-2xl mx-auto text-center mt-4"> {/* Adjusted the margin-top here */}
                    <div className={`mb-6 transition-opacity duration-200 ${
                        theme === 'dark' ? 'opacity-90' : 'opacity-100'
                    }`}>
                        <img 
                            src={workspaceSvg} 
                            alt="Workspace Welcome" 
                            className="w-64 h-64 mx-auto"
                        />
                    </div>
                    <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white"> {/* Reduced margin-bottom */}
                        Welcome to {user?.name || 'your'}'s Notion
                    </h1>
                    <button
                        className="bg-black hover:bg-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 mx-auto transition-colors duration-200 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-gray-600 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                    >
                        <span className="material-icons text-lg">add</span>
                        <span className="font-medium">Create a note</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
