import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './Components/ThemeProvider';
import Header from './Components/Header';
import Heroes from './Components/Heroes';
import Footer from './Components/Footer';

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <Heroes />
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App; 