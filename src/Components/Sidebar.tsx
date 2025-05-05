import React, { useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "./Icons";

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (isCollapsed: boolean) => void;
  currentPageTitle?: string;
}

export default function Sidebar({
  isCollapsed,
  setIsCollapsed,
  currentPageTitle,
}: SidebarProps) {
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Function to handle clicks outside the sidebar
    function handleClickOutside(event: MouseEvent) {
      // If click is outside sidebar AND sidebar is expanded
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        !isCollapsed
      ) {
        setIsCollapsed(true);
      }
    }

    // Add click listener when component mounts
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCollapsed, setIsCollapsed]);

  return (
    <div
      ref={sidebarRef}
      className={`relative bg-gray-100 dark:bg-gray-800 transition-all duration-300 ease-in-out h-full border-r border-gray-200 dark:border-gray-800 ${
        isCollapsed ? "w-20" : "w-72"
      }`}
    >
      {/* Toggle button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-md transition-all duration-200 hover:scale-110 z-10"
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4 text-gray-600 dark:text-gray-300" />
        ) : (
          <ChevronLeft className="h-4 w-4 text-gray-600 dark:text-gray-300" />
        )}
      </button>

      {/* Sidebar content */}
      <div className="p-4">
        {/* Current Page Title */}
        {currentPageTitle && !isCollapsed && (
          <div className="mb-6">
            <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              CURRENT PAGE
            </h2>
            <div className="mt-2 text-base font-medium text-gray-900 dark:text-white">
              {currentPageTitle}
            </div>
          </div>
        )}

        <div className="space-y-6">
          {/* Search */}
          <div className="group">
            <div className="flex items-center gap-3 p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800/80 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-sm">
              <div className="p-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg group-hover:bg-gray-200 dark:group-hover:bg-gray-700 transition-colors duration-200">
                <svg
                  className="w-5 h-5 text-gray-600 dark:text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              {!isCollapsed && (
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-200">
                  Search
                </span>
              )}
            </div>
          </div>

          {/* New Page */}
          <div className="group">
            <div className="flex items-center gap-3 p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800/80 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-sm">
              <div className="p-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 transition-colors duration-200">
                <svg
                  className="w-5 h-5 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
              {!isCollapsed && (
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-200">
                  New Page
                </span>
              )}
            </div>
          </div>

          {/* Settings */}
          <div className="group">
            <div className="flex items-center gap-3 p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800/80 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-sm">
              <div className="p-1.5 bg-purple-50 dark:bg-purple-900/20 rounded-lg group-hover:bg-purple-100 dark:group-hover:bg-purple-900/40 transition-colors duration-200">
                <svg
                  className="w-5 h-5 text-purple-600 dark:text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              {!isCollapsed && (
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-200">
                  Settings
                </span>
              )}
            </div>
          </div>

          {/* Trash */}
          <div className="group">
            <div className="flex items-center gap-3 p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800/80 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-sm">
              <div className="p-1.5 bg-red-50 dark:bg-red-900/20 rounded-lg group-hover:bg-red-100 dark:group-hover:bg-red-900/40 transition-colors duration-200">
                <svg
                  className="w-5 h-5 text-red-600 dark:text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </div>
              {!isCollapsed && (
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-200">
                  Trash
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
