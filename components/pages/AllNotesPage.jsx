// frontend/components/pages/AllNotesPage.jsx
'use client';

import { useAppState } from '../../context/AppState';
import NotesListPage from './NotesListPage';

export default function AllNotesPage() {
  const { notes } = useAppState();

  const getFilteredNotes = () => {
    return notes.filter(n => !n.trashed);
  };

  return (
    <NotesListPage
      title="All Notes"
      subtitle="Your complete note library"
      getFilteredNotes={getFilteredNotes}
      emptyMessage="No notes found"
    />
  );
}
