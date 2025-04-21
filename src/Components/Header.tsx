import React, { useState } from 'react';
import { useTheme } from "./ThemeProvider"
import { Moon, Sun } from "./Icons"
import logo from "../Svg/Logo.svg"
import LoginModal from './LoginModal';
import SignUpModal from './SignUpModal';
import { useAuth } from '../context/AuthContext';

function Header() {
  const { theme, setTheme } = useTheme()
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <>
      <header className="h-14 px-4 sm:px-6 flex items-center justify-between border-b border-border">
        <a
          href="#"
          className="flex items-center"
        >
          <img src={logo} width={24} height={24} alt="Notion Logo" className="h-6 w-6" />
          <span className="font-semibold text-xl ml-2 hidden sm:inline">Notion</span>
        </a>
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {user?.username}
                </span>
                <button 
                  onClick={logout}
                  className="border border-gray-300 bg-transparent px-4 py-2 text-sm font-medium text-gray-700 dark:border-gray-600 dark:bg-transparent dark:text-gray-300 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out rounded-md"
                >
                  Sign out
                </button>
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
  )
}

export default Header
