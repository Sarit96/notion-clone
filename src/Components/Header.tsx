import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from "./ThemeProvider";
import { Moon, Sun } from "./Icons";
import logo from "../Svg/Logo.svg";
import LoginModal from './LoginModal';
import SignUpModal from './SignUpModal';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Menu, X, User, LogOut } from 'lucide-react';

interface HeaderProps {
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Header({ isLoginModalOpen, setIsLoginModalOpen }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <header className="h-14 px-4 sm:px-6 flex items-center justify-between border-b border-border">
        <Link to="/" className="flex items-center">
          <img src={logo} width={24} height={24} alt="Notion Logo" className="h-6 w-6" />
          <span className="font-semibold text-xl ml-2 hidden sm:inline">Notion</span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <div className="relative" ref={profileRef}>
                  <button 
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg p-2 transition-colors duration-200"
                  >
                    {user?.picture && (
                      <img 
                        src={user.picture} 
                        alt="Profile" 
                        className="w-8 h-8 rounded-full"
                      />
                    )}
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {user?.name || user?.username || user?.email}
                    </span>
                    <svg 
                      className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isProfileOpen ? 'transform rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown menu */}
                  {isProfileOpen && (
                    <div className="absolute right-0 top-full mt-1 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                        <div className="text-xs text-gray-500 dark:text-gray-400">Email</div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100 break-all">
                          {user?.email}
                        </div>
                      </div>
                      <button 
                        onClick={logout}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <button 
                  onClick={() => setIsLoginModalOpen(true)}
                  className="border border-gray-300 bg-transparent px-4 py-2 text-sm font-medium text-gray-700 dark:border-gray-600 dark:bg-transparent dark:text-gray-300 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out rounded-md"
                >
                  Log in
                </button>
                <button 
                  onClick={() => setIsSignUpModalOpen(true)}
                  className="bg-black hover:bg-gray-800 text-white px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-gray-800 dark:hover:bg-black dark:text-white"
                >
                  Sign up
                </button>
              </>
            )}
          </div>
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="p-1.5 sm:p-2 rounded-full transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Toggle theme"
          >
            {theme === "light" ?
              <Moon className="h-4 w-4 sm:h-5 sm:w-5 text-foreground" /> :
              <Sun className="h-4 w-4 sm:h-5 sm:w-5 text-foreground" />
            }
          </button>
        </div>
      </header>
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
      <SignUpModal 
        isOpen={isSignUpModalOpen} 
        onClose={() => setIsSignUpModalOpen(false)} 
      />
    </>
  );
}
