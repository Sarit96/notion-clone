import React from 'react';
import { useTheme } from "./ThemeProvider"
import { Moon, Sun } from "./Icons"
import logo from "../Svg/Logo.svg"

function Header() {
  const { theme, setTheme } = useTheme()

  return (
    <header className="h-14 px-4 sm:px-6 flex items-center justify-between border-b border-border">
      <a 
        href="#" 
        className="flex items-center"
      >
        <img src={logo} width={24} height={24} alt="Notion Logo" />
        <span className="font-semibold text-xl ml-2">Notion</span>
      </a>
      <button
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        className="p-2 rounded-full transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary"
        aria-label="Toggle theme"
      >
        {theme === "light" ? 
          <Moon className="h-5 w-5 text-foreground" /> : 
          <Sun className="h-5 w-5 text-foreground" />
        }
      </button>
    </header>
  )
}

export default Header
