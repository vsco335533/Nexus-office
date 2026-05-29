// frontend/components/pages/SharedNotesPage.jsx
'use client';

import { useAppState } from '../../context/AppState';
import NotesListPage from './NotesListPage';

export default function SharedNotesPage() {
  const { notes } = useAppState();

  const getFilteredNotes = () => {
    return notes.filter(n => n.shared && !n.trashed);
  };

  return (
    <NotesListPage
      title="Shared Notes"
      subtitle="Notes that have been shared with you"
      getFilteredNotes={getFilteredNotes}
      emptyMessage="No shared notes yet"
    />
  );
}
