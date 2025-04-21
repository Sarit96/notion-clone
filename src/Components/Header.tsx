import React from 'react';
import { useTheme } from "./ThemeProvider"
import { Moon, Sun } from "./Icons"
import logo from "../Svg/Logo.svg"
import { SignInButton, SignOutButton, useUser } from "@clerk/clerk-react";

function Header() {
  const { theme, setTheme } = useTheme()
  const { user, isSignedIn, isLoaded } = useUser();

  return (
    <header className="h-14 px-4 sm:px-6 flex items-center justify-between border-b border-border">
      <a
        href="#"
        className="flex items-center"
      >
        <img src={logo} width={24} height={24} alt="Notion Logo" className="h-6 w-6" />
        <span className="font-semibold text-xl ml-2 hidden sm:inline">Notion</span>
      </a>
      <div className="flex items-center gap-2 sm:gap-4">
        {!isLoaded ? (
          <div className="h-8 w-20 bg-secondary/20 rounded-md animate-pulse"></div>
        ) : !isSignedIn ? (
          <div className="flex items-center gap-2">
            <SignInButton mode="modal">
              <button className="border border-gray-300 bg-transparent px-4 py-2 text-sm font-medium text-gray-700 dark:border-gray-600 dark:bg-transparent dark:text-gray-300 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out rounded-md">
                Log in
              </button>
            </SignInButton>
            <SignInButton mode="modal">
              <button className="bg-black hover:bg-gray-800 text-white px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-gray-800 dark:hover:bg-black dark:text-white">
                Get Notion Free
              </button>
            </SignInButton>

          </div>
        ) : (
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
              {user.imageUrl && (
                <img
                  src={user.imageUrl}
                  alt={user.firstName || user.username || "User"}
                  className="h-8 w-8 rounded-full"
                />
              )}
              <span className="text-sm text-foreground hidden sm:inline">
                {user.firstName || user.username}
              </span>
            </div>
            <SignOutButton>
              <button className="rounded-md bg-secondary px-3 py-1.5 sm:px-4 sm:py-2 text-sm font-medium text-foreground hover:bg-secondary/80 transition-colors">
                Sign Out
              </button>
            </SignOutButton>
          </div>
        )}
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
  )
}

export default Header
