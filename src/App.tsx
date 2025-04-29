import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ThemeProvider } from './Components/ThemeProvider';
import { AuthProvider } from './context/AuthContext';
import Header from './Components/Header';
import Heroes from './Components/Heroes';
import Footer from './Components/Footer';
import Workspace from './Components/Workspace';

// Your Google Client ID
const GOOGLE_CLIENT_ID = "986510645662-btr3t579jc3i971352thh4de6fo5770c.apps.googleusercontent.com";

function App() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
  };

  return (
    <GoogleOAuthProvider 
      clientId={GOOGLE_CLIENT_ID}
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
