import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './Components/ThemeProvider';
import ConvexClientProvider from './Components/Providers/Convex-provider';
import Header from './Components/Header';
import Heroes from './Components/Heroes';
import Footer from './Components/Footer';

function App() {
  return (
    <ConvexClientProvider>
      <ThemeProvider>
        <div className="min-h-screen bg-background text-foreground flex flex-col">
          <Header />
          <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Heroes />
          </main>
          <Footer />
        </div>
      </ThemeProvider>
    </ConvexClientProvider>
  );
}

export default App; 