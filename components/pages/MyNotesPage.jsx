// frontend/components/pages/MyNotesPage.jsx
'use client';

import { useAppState } from '../../context/AppState';
import NotesListPage from './NotesListPage';
import dynamic from 'next/dynamic';

const Editor = dynamic(() => import('../Editor'), {
  ssr: false,
  loading: () => <div className="bg-white dark:bg-ash-800 rounded-3xl p-6">Loading editor...</div>
});

export default function MyNotesPage() {
  const { notes } = useAppState();

  const getFilteredNotes = () => {
    return notes.filter(n => !n.trashed && !n.archived);
  };

  return (
    <div className="space-y-6">
      {/* Notes list (full width) */}
      <div>
        <NotesListPage
          title="My Notes"
          subtitle="All your personal notes in one place"
          getFilteredNotes={getFilteredNotes}
          emptyMessage="No notes yet. Create your first note!"
        />
      </div>

      {/* Editor (full width, below notes) */}
      <div>
        <Editor />
      </div>
    </div>
  );
}
