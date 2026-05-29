// frontend/components/NewNoteDrawer.jsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import * as Icons from 'lucide-react';
import dynamic from 'next/dynamic';
import toast from 'react-hot-toast';
import { useAppState } from '../context/AppState';

const CKEditorComponent = dynamic(
  async () => {
    const { CKEditor } = await import('@ckeditor/ckeditor5-react');
    const ClassicEditor = (await import('@ckeditor/ckeditor5-build-classic')).default;
    
    return {
      default: ({ config, data, onReady, onChange, onBlur }) => (
        <CKEditor
          editor={ClassicEditor}
          config={config}
          data={data}
          onReady={onReady}
          onChange={onChange}
          onBlur={onBlur}
        />
      ),
    };
  },
  { ssr: false, loading: () => <div className="h-[300px] flex items-center justify-center text-ash-400">Loading editor...</div> }
);

export default function NewNoteDrawer({ isOpen, onClose }) {
  const [title, setTitle] = useState('Untitled Note');
  const [editorInstance, setEditorInstance] = useState(null);
  const [content, setContent] = useState('<p></p>');
  const [isSaving, setIsSaving] = useState(false);

  const { createNewNote } = useAppState();

  const editorConfig = {
    toolbar: ['bold', 'italic', 'underline', '|', 'bulletedList', 'numberedList', '|', 'blockQuote', 'link', 'undo', 'redo'],
    image: {
      toolbar: ['imageTextAlternative']
    }
  };

  const handleEditorReady = (editor) => {
    setEditorInstance(editor);
  };

  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    setContent(data);
  };

  const handleCreateNote = async () => {
    setIsSaving(true);
    try {
      const noteId = createNewNote({
        title: title.trim() || 'Untitled Note',
        content: content,
      });
      toast.success(`Note "${title}" created!`);
      handleClose();
    } catch (error) {
      toast.error('Failed to create note');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    // Reset form
    setTitle('Untitled Note');
    setContent('<p></p>');
    setEditorInstance(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-200"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-white dark:bg-ash-800 shadow-2xl z-50 flex flex-col transition-transform duration-200 overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <Icons.FileText className="w-5 h-5" />
            <h2 className="text-xl font-semibold">Create New Note</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-primary-400/20 transition-colors"
            title="Close"
          >
            <Icons.X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Title Input */}
          <div>
            <label className="block text-sm font-semibold text-ash-700 dark:text-ash-300 mb-2">
              Note Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter note title..."
              className="w-full px-4 py-2 rounded-lg border border-ash-200 dark:border-ash-600 bg-white dark:bg-ash-700 text-ash-900 dark:text-white placeholder-ash-400 dark:placeholder-ash-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Editor */}
          <div>
            <label className="block text-sm font-semibold text-ash-700 dark:text-ash-300 mb-2">
              Click on "Create Note" Botton to Create New Note
            </label>
            {/* <div className="bg-white dark:bg-ash-700 rounded-lg border border-ash-200 dark:border-ash-600 overflow-hidden">
              <CKEditorComponent
                config={editorConfig}
                data={content}
                onReady={handleEditorReady}
                onChange={handleEditorChange}
              />
            </div> */}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-ash-200 dark:border-ash-700 bg-ash-50 dark:bg-ash-800 px-6 py-4 flex items-center justify-between sticky bottom-0">
          <button
            onClick={handleClose}
            className="px-4 py-2 rounded-lg border border-ash-200 dark:border-ash-600 text-ash-700 dark:text-ash-300 hover:bg-ash-100 dark:hover:bg-ash-700 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateNote}
            disabled={isSaving}
            className="px-6 py-2 rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold hover:shadow-lg hover:scale-[1.02] transform transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <Icons.Loader2 className="w-4 h-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Icons.Plus className="w-4 h-4" />
                Create Note
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
