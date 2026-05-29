// frontend/components/EditorFixed.jsx
'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useAppState } from '../context/AppState';
import * as Icons from 'lucide-react';
import toast from 'react-hot-toast';
import { saveAs } from 'file-saver';

// Dynamically import CKEditor (client-only)
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
  { ssr: false, loading: () => <div className="min-h-[400px] p-6 text-ash-400 dark:text-ash-300 flex items-center justify-center">Loading editor...</div> }
);

export default function Editor() {
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const openFileInputRef = useRef(null);
  const recognitionRef = useRef(null);

  const [editorInstance, setEditorInstance] = useState(null);
  const [title, setTitle] = useState('Welcome to Nexus!');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState('Just now');
  const [attachments, setAttachments] = useState([]);
  const [activeTab, setActiveTab] = useState('Home');
  const [recognizing, setRecognizing] = useState(false);
  const [wordCount, setWordCount] = useState(0);

  const { selectedNoteId, notes, setNoteContent } = useAppState();

  const editorConfig = {
    toolbar: [],
    image: {
      toolbar: ['imageTextAlternative']
    }
  };

  const exec = (cmd, value) => {
    if (!editorInstance) return;
    try {
      editorInstance.execute(cmd, value);
      editorInstance.editing.view.focus();
    } catch (err) {
      console.warn('Command not available:', cmd);
    }
  };

  const calculateWordCount = () => {
    if (!editorInstance) return 0;
    const html = editorInstance.getData();
    const text = html.replace(/<[^>]*>/g, '').trim();
    const count = text ? text.split(/\s+/).length : 0;
    setWordCount(count);
    return count;
  };

  const handleSave = async () => {
    if (!editorInstance) return;
    setIsSaving(true);
    const data = editorInstance.getData();
    if (selectedNoteId) {
      setNoteContent(selectedNoteId, data);
      setLastSaved(new Date().toLocaleTimeString());
      toast.success('Saved to workspace');
      setIsSaving(false);
      return;
    }
    const blob = new Blob([data], { type: 'text/html;charset=utf-8' });
    saveAs(blob, `${(title || 'document').replace(/\s+/g, '_')}.html`);
    setIsSaving(false);
    setLastSaved(new Date().toLocaleTimeString());
    toast.success('Saved as HTML');
  };

  const handleNew = () => {
    if (editorInstance) {
      editorInstance.setData('<p></p>');
      setTitle('Welcome to Nexus!');
      toast.success('New document');
    }
  };

  const handleOpen = () => {
    openFileInputRef.current && openFileInputRef.current.click();
  };

  const handleFileOpen = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    const text = await file.text();
    if (editorInstance) {
      editorInstance.setData(text);
      setTitle(file.name);
      toast.success(`Opened ${file.name}`);
    }
    e.target.value = '';
  };

  const handleImageSelect = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onload = () => {
        const imgSrc = reader.result;
        if (editorInstance) {
          editorInstance?.model.change((writer) => {
            const imageElement = writer.createElement('image', { src: imgSrc });
            editorInstance.model.insertContent(imageElement);
          });
        }
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (!files) return;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const link = `[${file.name}](file://${file.name})`;
      editorInstance?.model.change((writer) => {
        const viewFragment = editorInstance.data.processor.toView(link);
        const modelFragment = editorInstance.data.toModel(viewFragment);
        editorInstance.model.insertContent(modelFragment);
      });
    }
    e.target.value = '';
  };

  const startRecognition = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error('Speech recognition not supported');
      return;
    }
    try {
      const rec = new SpeechRecognition();
      rec.lang = 'en-US';
      rec.interimResults = false;
      rec.onresult = (event) => {
        let final = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          }
        }
        if (final) {
          editorInstance?.model.change((writer) => {
            const text = writer.createText(final + ' ');
            editorInstance.model.insertContent(text);
          });
        }
      };
      rec.onerror = (err) => {
      }
    }
  }