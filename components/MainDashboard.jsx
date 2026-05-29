import React from 'react';
import { useAppState } from '../context/AppState';
import dynamic from 'next/dynamic';

// Import page components
import DashboardPage from './pages/DashboardPage';
import MyNotesPage from './pages/MyNotesPage';
import SharedNotesPage from './pages/SharedNotesPage';
import StarredNotesPage from './pages/StarredNotesPage';
import RecentNotesPage from './pages/RecentNotesPage';
import AllNotesPage from './pages/AllNotesPage';
import ProjectsPage from './pages/ProjectsPage';
import TagsPage from './pages/TagsPage';
import ArchivedPage from './pages/ArchivedPage';
import TrashPage from './pages/TrashPage';
import QRGeneratorPage from './pages/QRGeneratorPage';
import ExportPage from './pages/ExportPage';
import HistoryPage from './pages/HistoryPage';
import PreferencesPage from './pages/PreferencesPage';
import SecurityPage from './pages/SecurityPage';
import TeamPage from './pages/TeamPage';
import HelpPage from './pages/HelpPage';
import EditorOnlyPage from './pages/EditorOnlyPage';
import TodoPage from './pages/TodoPage';
import KanbanPage from './pages/KanbanPage';

export default function MainDashboard(){
  const { activeView } = useAppState();

  // Render the appropriate page based on activeView
  const renderPage = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardPage />;
      case 'notes':
      case 'my-notes':
        return <MyNotesPage />;
      case 'shared':
        return <SharedNotesPage />;
      case 'starred':
        return <StarredNotesPage />;
      case 'recent':
        return <RecentNotesPage />;
      case 'all-notes':
        return <AllNotesPage />;
      case 'projects':
        return <ProjectsPage />;
      case 'tags':
        return <TagsPage />;
      case 'archived':
        return <ArchivedPage />;
      case 'trash':
        return <TrashPage />;
      case 'qr-generator':
        return <QRGeneratorPage />;
      case 'export':
        return <ExportPage />;
      case 'history':
        return <HistoryPage />;
      case 'preferences':
        return <PreferencesPage />;
      case 'security':
        return <SecurityPage />;
      case 'team':
        return <TeamPage />;
      case 'help':
        return <HelpPage />;
      case 'editor':
        return <EditorOnlyPage />;
      case 'todo':
        return <TodoPage />;
      case 'kanban':
        return <KanbanPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="w-full">
      {renderPage()}
    </div>
  );
}
