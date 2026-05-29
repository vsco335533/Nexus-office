// components/Header.jsx
"use client";
import React from 'react';
import * as Icons from 'lucide-react';
import Link from 'next/link';
import { useAppState } from '../context/AppState';

export default function Header({ onMenuClick, darkMode, onThemeToggle }) {
  const { user, signOut } = useAppState();

  return (
    <header className="bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-xl">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-xl hover:bg-primary-400/20 transition-colors"
            >
              <Icons.Menu className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold" >Nexus - Advanced Note Sharing</h1>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            <button
              onClick={onThemeToggle}
              className="p-3 rounded-xl hover:bg-primary-400/20 transition-all duration-300 hover:scale-110"
            >
              {darkMode ? (
                <Icons.Sun className="w-5 h-5" />
              ) : (
                <Icons.Moon className="w-5 h-5" />
              )}
            </button>

            {!user ? (
              <>
                <Link href="/signin" className="btn-outline flex items-center gap-2">
                  <Icons.User className="w-4 h-4" />
                  Sign In
                </Link>

                <Link href="/signup" className="btn-primary flex items-center gap-2">
                  <Icons.UserPlus className="w-4 h-4" />
                  Sign Up
                </Link>
              </>
            ) : (
              <button onClick={() => signOut()} className="btn-outline flex items-center gap-2 text-sm">
                <Icons.LogOut className="w-4 h-4" />
                Sign out
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}