// frontend/components/pages/ProjectsPage.jsx
'use client';

import { useAppState } from '../../context/AppState';
import * as Icons from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function ProjectsPage() {
  const { notes, setSelectedNoteId, setActive, moveToTrash } = useAppState();
  const [searchQuery, setSearchQuery] = useState('');

  // Get unique projects
  const projects = Array.from(new Set(notes.filter(n => n.project && !n.trashed).map(n => n.project)));
  const filtered = projects.filter(p => p.toLowerCase().includes(searchQuery.toLowerCase()));

  const getProjectNotes = (projectName) => {
    return notes.filter(n => n.project === projectName && !n.trashed);
  };

  const handleNoteClick = (noteId) => {
    setSelectedNoteId(noteId);
    setActive('projects');
  };

  const handleDelete = (noteId) => {
    moveToTrash(noteId);
    toast.success('Note moved to trash');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white dark:bg-ash-800 rounded-xl p-6 border border-ash-200 dark:border-ash-700">
        <h1 className="text-3xl font-bold text-ash-900 dark:text-white">Projects</h1>
        <p className="text-ash-600 dark:text-ash-400 mt-1">Organize your notes by project</p>
        <p className="text-sm text-ash-500 dark:text-ash-400 mt-2">{filtered.length} project{filtered.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-ash-800 rounded-xl p-4 border border-ash-200 dark:border-ash-700">
        <div className="flex items-center gap-3 bg-ash-50 dark:bg-ash-700 rounded-lg px-4 py-2">
          <Icons.Search className="w-5 h-5 text-ash-400" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-ash-900 dark:text-white placeholder-ash-400"
          />
        </div>
      </div>

      {/* Projects Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-ash-800 rounded-xl p-12 border border-ash-200 dark:border-ash-700 text-center">
          <Icons.Network className="w-16 h-16 text-ash-300 dark:text-ash-600 mx-auto mb-4" />
          <p className="text-ash-500 dark:text-ash-400">No projects found</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filtered.map((project) => {
            const projectNotes = getProjectNotes(project);
            return (
              <div key={project} className="bg-white dark:bg-ash-800 rounded-xl border border-ash-200 dark:border-ash-700 overflow-hidden">
                {/* Project Header */}
                <div className="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 p-6 border-b border-ash-200 dark:border-ash-700">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center text-white">
                      <Icons.Network className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-ash-900 dark:text-white">{project}</h3>
                      <p className="text-sm text-ash-600 dark:text-ash-400">{projectNotes.length} note{projectNotes.length !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                </div>

                {/* Notes in Project */}
                <div className="p-4 space-y-2">
                  {projectNotes.map((note) => (
                    <div
                      key={note.id}
                      onClick={() => handleNoteClick(note.id)}
                      className="p-4 rounded-lg bg-ash-50 dark:bg-ash-700 hover:bg-ash-100 dark:hover:bg-ash-600 transition-colors cursor-pointer group flex justify-between items-start"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-ash-900 dark:text-white truncate">
                          {note.title}
                        </p>
                        <p className="text-sm text-ash-600 dark:text-ash-400 truncate line-clamp-2">
                          {note.content}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(note.id);
                        }}
                        className="text-ash-400 hover:text-red-500 transition-colors ml-2 opacity-0 group-hover:opacity-100"
                      >
                        <Icons.Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
