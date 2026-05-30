"use client";
import React, { createContext, useContext, useMemo, useState } from 'react';

const AppStateContext = createContext(null);

export function useAppState() {
  return useContext(AppStateContext);
}

export function AppStateProvider({ children }) {
  // Sample notes dataset
  const [notes, setNotes] = useState([
    { id: 1, title: 'Project Ideas', content: 'A collection of innovative project ideas...', starred: false, shared: false, project: 'Ideas', tags: ['ideas'], archived: false, trashed: false },
    { id: 2, title: 'Meeting Notes', content: 'Key takeaways from the team meeting...', starred: true, shared: true, project: 'Work', tags: ['meetings'], archived: false, trashed: false },
    { id: 3, title: 'Travel Plans', content: 'Itinerary and packing list for vacation...', starred: false, shared: false, project: 'Personal', tags: ['travel'], archived: false, trashed: false },
    { id: 4, title: 'Recipe Collection', content: 'My favorite recipes including the secret family pasta sauce...', starred: false, shared: false, project: 'Hobbies', tags: ['cooking'], archived: true, trashed: false },
    { id: 5, title: 'Old Note', content: 'This note was deleted', starred: false, shared: false, project: null, tags: [], archived: false, trashed: true },
  ]);

  const [activeView, setActiveView] = useState('dashboard');
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [newNoteDrawerOpen, setNewNoteDrawerOpen] = useState(false);

  const counts = useMemo(() => ({
    myNotes: notes.filter(n => !n.trashed && !n.archived).length,
    shared: notes.filter(n => n.shared && !n.trashed).length,
    starred: notes.filter(n => n.starred && !n.trashed).length,
    archived: notes.filter(n => n.archived).length,
    projects: Array.from(new Set(notes.filter(n => n.project && !n.trashed).map(n => n.project))).length,
    trashed: notes.filter(n => n.trashed).length,
    allNotes: notes.filter(n => !n.trashed).length,
  }), [notes]);

  const setActive = (view, opts = {}) => {
    setActiveView(view);
    if (opts.selectNoteId) setSelectedNoteId(opts.selectNoteId);
  };

  const exportNotes = async (format = 'json') => {
    const data = notes.filter(n => !n.trashed);
    if (format === 'json') {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const mod = await import('file-saver');
      mod.saveAs(blob, `nexus-notes-export.json`);
      return;
    }

    if (format === 'docx') {
      // create a simple HTML representation of notes and convert to docx
      const html = `<!doctype html><html><head><meta charset="utf-8"></head><body>${data.map(n=>`<h2>${n.title}</h2>${n.content}<hr/>`).join('')}</body></html>`;
      const { htmlToDocBlob } = await import('../utils/htmlToDocx');
      const blob = htmlToDocBlob(html);
      const mod = await import('file-saver');
      mod.saveAs(blob, `nexus-notes-export.doc`);
      return;
    }

    // fallback: save HTML
    const blob = new Blob([data.map(n=>`<h2>${n.title}</h2>${n.content}`).join('\n')], { type: 'text/html' });
    const mod = await import('file-saver');
    mod.saveAs(blob, `nexus-notes-export.html`);
  };

  const setNoteContent = (noteId, html) => {
    setNotes(prev => prev.map(n => n.id === noteId ? { ...n, content: html } : n));
  };

  const createNewNote = (opts = {}) => {
    const id = Date.now();
    const newNote = {
      id,
      title: opts.title || 'Untitled',
      content: opts.content || '<p></p>',
      starred: false,
      shared: false,
      project: opts.project || null,
      tags: opts.tags || [],
      archived: false,
      trashed: false,
    };
    setNotes(prev => [newNote, ...prev]);
    setSelectedNoteId(id);
    setActiveView('editor');
    return id;
  };

  // Simple client-side auth helpers. In production wire these to your backend.
  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  const signIn = async ({ email, password }) => {
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) {
        const err = await res.json();
        return { ok: false, error: err.message || 'Sign in failed' };
      }
      const json = await res.json();
      setUser(json.user);
      return { ok: true };
    } catch (err) {
      console.error('SignIn error', err);
      return { ok: false, error: err.message };
    }
  };

  const signUp = async ({ email, password, name, recaptchaToken }) => {
    try {
      const res = await fetch(`${API}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password, username: name, recaptchaToken })
      });
      if (!res.ok) {
        const err = await res.json();
        return { ok: false, error: err.message || 'Sign up failed' };
      }
      const json = await res.json();
      return { ok: true };
    } catch (err) {
      console.error('SignUp error', err);
      return { ok: false, error: err.message };
    }
  };

  const signOut = async () => {
    try {
      await fetch(`${API}/api/auth/logout`, { method: 'POST', credentials: 'include' });
      setUser(null);
      return { ok: true };
    } catch (err) {
      console.error('SignOut error', err);
      setUser(null); // fallback to clearing state anyway
      return { ok: false };
    }
  };

  const signInWithGoogle = async (idToken) => {
    try {
      const res = await fetch(`${API}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ idToken })
      });
      if (!res.ok) {
        const err = await res.json();
        return { ok: false, error: err.message };
      }
      const json = await res.json();
      setUser(json.user);
      return { ok: true };
    } catch (err) {
      console.error('Google sign-in error', err);
      return { ok: false, error: err.message };
    }
  };

  // Try to get current profile on mount (if cookie/session exists)
  React.useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/api/auth/profile`, { credentials: 'include' });
        if (res.ok) {
          const json = await res.json();
          setUser(json.user);
        }
      } catch (err) {
        // ignore
      } finally {
        setAuthLoading(false);
      }
    })();
  }, []);

  const moveToTrash = (noteId) => {
    setNotes(prev => prev.map(n => n.id === noteId ? { ...n, trashed: true } : n));
  };

  const restoreFromTrash = (noteId) => {
    setNotes(prev => prev.map(n => n.id === noteId ? { ...n, trashed: false } : n));
  };

  const generateQRCodeForNote = async (noteId) => {
    const note = notes.find(n => n.id === noteId) || { title: 'Nexus' };
    try {
      const QR = await import('qrcode');
      const text = `note:${note.id}:${note.title}`;
      const dataUrl = await QR.toDataURL(text, { margin: 1, width: 300 });
      return dataUrl;
    } catch (err) {
      // fallback to basic SVG
      const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><rect width='100%' height='100%' fill='#ffffff'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='14'>QR:${note.title}</text></svg>`;
      return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
    }
  };

  const value = {
    notes,
    setNotes,
    counts,
    activeView,
    setActive,
    selectedNoteId,
    setSelectedNoteId,
    exportNotes,
    setNoteContent,
    moveToTrash,
    restoreFromTrash,
    generateQRCodeForNote,
    createNewNote,
    newNoteDrawerOpen,
    setNewNoteDrawerOpen,
    user,
    authLoading,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
  };

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
}
