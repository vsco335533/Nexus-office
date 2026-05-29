// frontend/components/pages/ArchivedPage.jsx
'use client';

import { useAppState } from '../../context/AppState';
import NotesListPage from './NotesListPage';

export default function ArchivedPage() {
  const { notes } = useAppState();

  const getFilteredNotes = () => {
    return notes.filter(n => n.archived);
  };

  return (
    <NotesListPage
      title="Archived Notes"
      subtitle="Notes you've archived"
      getFilteredNotes={getFilteredNotes}
      emptyMessage="No archived notes yet"
    />
  );
}
