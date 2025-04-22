import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from './Icons';
import workspaceSvg from '../Svg/svg workspace.svg';
import { useAuth } from '../context/AuthContext';
import { useTheme } from './ThemeProvider';

export default function Workspace() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { user } = useAuth();
    const { theme } = useTheme();
    const sidebarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                sidebarRef.current && 
                !sidebarRef.current.contains(event.target as Node) && 
                !isCollapsed
            ) {
                setIsCollapsed(true);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isCollapsed]);

    return (
        <div className="flex h-[calc(100vh-8rem)] bg-white dark:bg-gray-900 transition-colors duration-200">
            {/* Sidebar */}
            <div 
                ref={sidebarRef}
                className={`relative bg-gray-200 dark:bg-gray-950 transition-all duration-300 ease-in-out ${
                    isCollapsed ? 'w-16' : 'w-64'
                } border-r border-gray-200 dark:border-gray-800 shadow-sm`}
            >
                {/* Toggle button */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute -right-3 top-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm transition-colors duration-200"
                >
                    {isCollapsed ? (
                        <ChevronRight className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                    ) : (
                        <ChevronLeft className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                    )}
                </button>

                {/* Sidebar content */}
                <div className="p-4">
                    <div className="space-y-4">
                        {/* Action items section */}
                        <div>
                            <h2 className={`text-sm font-semibold text-gray-700 dark:text-gray-200 ${
                                isCollapsed ? 'text-center' : 'text-left'
                            }`}>
                                {isCollapsed ? 'AI' : 'Action items'}
                            </h2>
                            {/* Add action items here */}
                        </div>

                        {/* Documents section */}
                        <div>
                            <h2 className={`text-sm font-semibold text-gray-700 dark:text-gray-200 ${
                                isCollapsed ? 'text-center' : 'text-left'
                            }`}>
                                {isCollapsed ? 'Doc' : 'Documents'}
                            </h2>
                            {/* Add documents here */}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="flex-1 p-8 overflow-y-auto bg-gray-50 dark:bg-gray-900">
                <div className="max-w-2xl mx-auto text-center">
                    <div className={`mb-8 transition-opacity duration-200 ${
                        theme === 'dark' ? 'opacity-90' : 'opacity-100'
                    }`}>
                        <img 
                            src={workspaceSvg} 
                            alt="Workspace Welcome" 
                            className="w-64 h-64 mx-auto"
                        />
                    </div>
                    <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
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