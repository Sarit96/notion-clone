/// <reference types="react-scripts" />
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ThemeProvider } from './Components/ThemeProvider';
import { AuthProvider } from './context/AuthContext';
import Header from './Components/Header';
import Heroes from './Components/Heroes';
import Footer from './Components/Footer';
import Workspace from './Components/Workspace';
import Note from './Components/Note';

//  Google Client ID
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

function App() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
  };

  return (
    <GoogleOAuthProvider 
      clientId={GOOGLE_CLIENT_ID!}
    >
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <div className="min-h-screen bg-background text-foreground flex flex-col">
              <Header isLoginModalOpen={isLoginModalOpen} setIsLoginModalOpen={setIsLoginModalOpen} />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Heroes onLoginClick={handleLoginClick} />} />
                  <Route path="/workspace" element={<Workspace />} />
                  <Route path="/note" element={<Note />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
