// frontend/components/pages/StarredNotesPage.jsx
'use client';

import { useAppState } from '../../context/AppState';
import NotesListPage from './NotesListPage';

export default function StarredNotesPage() {
  const { notes } = useAppState();

  const getFilteredNotes = () => {
    return notes.filter(n => n.starred && !n.trashed);
  };

  return (
    <NotesListPage
      title="Starred Notes"
      subtitle="Your favorite notes"
      getFilteredNotes={getFilteredNotes}
      emptyMessage="No starred notes yet. Star a note to save it here!"
    />
  );
}
