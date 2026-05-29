// frontend/components/pages/RecentNotesPage.jsx
'use client';

import { useAppState } from '../../context/AppState';
import NotesListPage from './NotesListPage';

export default function RecentNotesPage() {
  const { notes } = useAppState();

  const getFilteredNotes = () => {
    return notes.filter(n => !n.trashed).slice(0, 10);
  };

  return (
    <NotesListPage
      title="Recent Notes"
      subtitle="Your recently accessed notes"
      getFilteredNotes={getFilteredNotes}
      emptyMessage="No recent notes"
    />
  );
}
