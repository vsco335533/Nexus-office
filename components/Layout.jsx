// components/Layout.jsx
"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAppState } from '../context/AppState';
import Sidebar from './Sidebar';
import Header from './Header';
import NewNoteDrawer from './NewNoteDrawer';

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const { newNoteDrawerOpen, setNewNoteDrawerOpen } = useAppState();

  useEffect(() => {
    // Check system preference or saved theme
    const isDark = localStorage.getItem('theme') === 'dark' || 
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setDarkMode(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    document.documentElement.classList.toggle('dark', newDarkMode);
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
  };

  const router = useRouter();
  const { user, authLoading } = useAppState();

  // Auth pages (signin/signup) show full-screen without chrome
  const isAuthPage = ['/signin', '/signup'].includes(router.pathname);
  // Public pages accessible without login (write.cx-style sharing & tools)
  const isPublicPage = router.pathname === '/publish' || router.pathname === '/tools' || router.pathname === '/[code]';

  // If user not authenticated and not on auth/public page, redirect to signin
  useEffect(() => {
    if (!authLoading && !user && !isAuthPage && !isPublicPage) {
      router.push('/signin');
    }
  }, [user, authLoading, isAuthPage, isPublicPage]);

  // Public pages render without auth loading screen
  if (isPublicPage) {
    return <>{children}</>;
  }

  // Gorgeous, premium glassmorphism loading animation page
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-tr from-slate-950 via-zinc-900 to-neutral-950 flex items-center justify-center p-6 relative overflow-hidden select-none">
        {/* Soft background glowing circles */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl animate-pulse duration-[6000ms]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl animate-pulse duration-[4000ms]"></div>
        
        {/* Glass card container */}
        <div className="bg-white/5 dark:bg-black/20 backdrop-blur-xl border border-white/10 dark:border-white/5 p-10 rounded-[2.5rem] shadow-2xl flex flex-col items-center max-w-sm w-full text-center transition-all duration-500 scale-95 hover:scale-100">
          <div className="relative mb-8 w-24 h-24">
            {/* Pulsing outer ring */}
            <div className="absolute inset-0 rounded-full border-2 border-red-500/20 animate-ping"></div>
            {/* Spinning gradient ring */}
            <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-red-500 animate-spin"></div>
            {/* Elegant inner logo/core */}
            <div className="absolute inset-2 bg-gradient-to-br from-red-500 to-rose-600 rounded-full flex items-center justify-center shadow-lg shadow-red-500/30">
              <span className="text-white text-3xl font-extrabold tracking-widest select-none">N</span>
            </div>
          </div>
          <h2 className="text-white text-2xl font-semibold tracking-wide mb-2">Nexus Notes</h2>
          <p className="text-neutral-400 text-sm tracking-normal max-w-[250px] animate-pulse">Securing session...</p>
        </div>
      </div>
    );
  }

  // Prevent flash of dashboard while redirecting unauthenticated users
  if (!user && !isAuthPage && !isPublicPage) {
    return null;
  }

  if (isAuthPage) {
    // let the page render full-screen (signin/signup)
    return <div className="min-h-screen bg-ash-50 dark:bg-ash-900">{children}</div>;
  }

  return (
      <div className="flex h-screen bg-gradient-polished">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-80 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header 
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          darkMode={darkMode}
          onThemeToggle={toggleDarkMode}
        />
        
        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* New Note Drawer Overlay */}
      <NewNoteDrawer 
        isOpen={newNoteDrawerOpen}
        onClose={() => setNewNoteDrawerOpen(false)}
      />
      </div>
  );
}