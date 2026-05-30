// frontend/components/Editor.jsx
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
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);

  const { selectedNoteId, notes, setNoteContent } = useAppState();

  const editorConfig = {
    toolbar: [],
    image: {
      toolbar: ['imageTextAlternative'],
      resizeUnit: '%',
      resizeOptions: [
        {
          name: 'resizeImage:original',
          value: null,
          label: 'Original'
        },
        {
          name: 'resizeImage:50',
          value: '50',
          label: '50%'
        },
        {
          name: 'resizeImage:75',
          value: '75',
          label: '75%'
        }
      ]
    }
  };

  // Simple URL detection for pasted text
  const isLikelyURL = (text) => {
    if (!text) return false;
    const t = text.trim();
    // basic check: starts with http(s) or www. or contains a dot+TLD
    const urlRegex = /^(https?:\/\/|www\.)[\w\-@:%._+~#=]{2,256}\.[a-z]{2,6}\b([\w@:%_+.~#?&//=~-]*)$/i;
    return urlRegex.test(t);
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
    await handleDownload('html');
    setIsSaving(false);
  };

  const handleDownload = async (format) => {
    if (!editorInstance) {
      toast.error('No content to download');
      return;
    }

    setIsSaving(true);
    try {
      const htmlContent = editorInstance.getData();
      const plainText = htmlContent.replace(/<[^>]*>/g, '').trim();
      const filename = (title || 'document').replace(/\s+/g, '_');

      switch (format) {
        case 'txt':
          const txtBlob = new Blob([plainText], { type: 'text/plain;charset=utf-8' });
          saveAs(txtBlob, `${filename}.txt`);
          toast.success('Downloaded as TXT');
          break;

        case 'html':
          const htmlDocument = `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>${title}</title>\n  <style>\n    body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 900px; margin: 0 auto; padding: 20px; }\n    h1 { color: #333; }\n    img { max-width: 100%; height: auto; }\n    a { color: #0066cc; text-decoration: none; }\n    a:hover { text-decoration: underline; }\n  </style>\n</head>\n<body>\n  <h1>${title}</h1>\n  ${htmlContent}\n  <hr>\n  <small>Created on ${new Date().toLocaleString()}</small>\n</body>\n</html>`;
          const htmlBlob = new Blob([htmlDocument], { type: 'text/html;charset=utf-8' });
          saveAs(htmlBlob, `${filename}.html`);
          toast.success('Downloaded as HTML');
          break;

        case 'json':
          const jsonData = JSON.stringify({
            title: title,
            content: htmlContent,
            plainText: plainText,
            createdAt: new Date().toISOString(),
            wordCount: wordCount
          }, null, 2);
          const jsonBlob = new Blob([jsonData], { type: 'application/json;charset=utf-8' });
          saveAs(jsonBlob, `${filename}.json`);
          toast.success('Downloaded as JSON');
          break;

        case 'docx':
          const { htmlToDocBlob } = await import('../utils/htmlToDocx');
          const docContent = `<h1>${title}</h1>${htmlContent}`;
          const blob = htmlToDocBlob(docContent);
          saveAs(blob, `${filename}.doc`);
          toast.success('Downloaded as DOCX');
          break;

        default:
          toast.error('Unknown format');
      }
      setShowDownloadMenu(false);
    } catch (err) {
      console.error('Download error:', err);
      toast.error('Failed to download');
    } finally {
      setIsSaving(false);
    }
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
    if (!editorInstance) {
      toast.error('Editor not ready');
      return;
    }
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onload = () => {
        const imgSrc = reader.result;
        try {
          // Use the insertImage command if available, otherwise insert via model
          try {
            if (editorInstance.commands.get('insertImage')) {
              editorInstance.execute('insertImage', { source: imgSrc });
            } else {
              // Fallback: insert as HTML
              editorInstance.model.change((writer) => {
                const viewFragment = editorInstance.data.processor.toView(`<img src="${imgSrc}" alt="${file.name}" style="max-width: 100%; height: auto;" />`);
                const modelFragment = editorInstance.data.toModel(viewFragment);
                editorInstance.model.insertContent(modelFragment, editorInstance.model.document.selection);
              });
            }
          } catch (cmdErr) {
            // Fallback to HTML insertion
            editorInstance.model.change((writer) => {
              const viewFragment = editorInstance.data.processor.toView(`<img src="${imgSrc}" alt="${file.name}" style="max-width: 100%; height: auto;" />`);
              const modelFragment = editorInstance.data.toModel(viewFragment);
              editorInstance.model.insertContent(modelFragment, editorInstance.model.document.selection);
            });
          }
          toast.success(`Image "${file.name}" inserted`);
        } catch (err) {
          console.error('Image insertion error:', err);
          toast.error('Failed to insert image');
        }
      };
      reader.onerror = () => {
        toast.error(`Failed to read image "${file.name}"`);
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
      rec.interimResults = true;
      rec.continuous = true;  // Allow continuous recording
      rec.maxAlternatives = 1;

      rec.onstart = () => {
        setRecognizing(true);
        toast.success('Recording started - Click stop to end');
      };

      rec.onresult = (event) => {
        let final = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            final += transcript + ' ';
          }
        }
        if (final && editorInstance) {
          editorInstance.model.change((writer) => {
            const text = writer.createText(final);
            editorInstance.model.insertContent(text);
          });
        }
      };

      rec.onerror = (err) => {
        console.error('Speech error', err);
        // Don't stop on network error - let user manually stop
        if (err.error === 'network') {
          // Automatically restart on network error
          try {
            rec.start();
          } catch (e) {
            toast.error('Recording interrupted');
            setRecognizing(false);
          }
        } else {
          toast.error(`Speech error: ${err.error}`);
          setRecognizing(false);
        }
      };

      rec.onend = () => {
        setRecognizing(false);
        toast.success('Recording stopped');
      };

      rec.start();
      recognitionRef.current = rec;
      setRecognizing(true);
    } catch (err) {
      console.error('Recognition error:', err);
      toast.error('Could not start speech recognition');
    }
  };

  const stopRecognition = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        setRecognizing(false);
      } catch (err) {
        console.error('Stop recognition error:', err);
      }
    }
  };

  const exportDocx = async () => {
    if (!editorInstance) {
      toast.error('No editor instance');
      return;
    }
    try {
      const html = editorInstance.getData();
      const { htmlToDocBlob } = await import('../utils/htmlToDocx');
      const blob = htmlToDocBlob(html);
      saveAs(blob, `${(title || 'document').replace(/\s+/g, '_')}.doc`);
      toast.success('Exported as DOCX');
    } catch (err) {
      console.error('DOCX export error', err);
      toast.error('Failed to export DOCX');
    }
  };

  // Load selected note into editor
  useEffect(() => {
    if (!editorInstance) return;
    if (selectedNoteId == null) return;
    const note = notes.find(n => n.id === selectedNoteId);
    if (!note) return;
    setTitle(note.title || 'Untitled');
    try {
      editorInstance.setData(note.content || '<p></p>');
    } catch (err) {
      console.warn('Failed to set editor data', err);
    }
  }, [selectedNoteId, editorInstance, notes]);

  return (
    <div className="bg-white dark:bg-ash-900 rounded-3xl shadow-glossy overflow-hidden border border-ash-200 dark:border-ash-700 flex flex-col min-h-[60vh] md:min-h-[65vh] h-auto">
      {/* Title Bar */}
      <div className="px-6 py-4 border-b border-ash-200 dark:border-ash-700 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 flex items-center justify-between">
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-2xl font-bold bg-transparent border-none focus:outline-none text-ash-900 dark:text-white"
          />
        </div>
        <button onClick={handleSave} className={`btn-primary py-2 px-4 ${isSaving ? 'opacity-50' : ''}`}>
          <Icons.Save className="w-4 h-4 mr-2 inline" />
          Save
        </button>
      </div>

      {/* Ribbon Tabs */}
      <div className="border-b border-ash-200 dark:border-ash-700 bg-ash-50 dark:bg-ash-900/50 flex overflow-x-auto">
        {['File', 'Home', 'Insert', 'Design', 'Layout', 'Review', 'View'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 font-semibold whitespace-nowrap transition-colors ${
              activeTab === tab
                ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
                : 'text-ash-600 dark:text-ash-400 hover:text-ash-900 dark:hover:text-ash-100'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Ribbon Content - Home Tab */}
      {activeTab === 'Home' && (
        <div className="p-4 border-b border-ash-200 dark:border-ash-700 bg-ash-50 dark:bg-ash-900/50 flex gap-4 flex-wrap">
          <button onClick={handleNew} className="flex flex-col items-center gap-1 p-2 hover:bg-ash-200 dark:hover:bg-ash-700 rounded">
            <Icons.FileText className="w-6 h-6" /> New
          </button>
          <button onClick={handleOpen} className="flex flex-col items-center gap-1 p-2 hover:bg-ash-200 dark:hover:bg-ash-700 rounded">
            <Icons.FolderOpen className="w-6 h-6" /> Open
          </button>
          <input ref={openFileInputRef} type="file" onChange={handleFileOpen} className="hidden" />
          <div className="relative">
            <button 
              onClick={() => setShowDownloadMenu(!showDownloadMenu)}
              className="flex flex-col items-center gap-1 p-2 hover:bg-ash-200 dark:hover:bg-ash-700 rounded"
            >
              <Icons.Download className="w-6 h-6" /> Download
            </button>
            {showDownloadMenu && (
              <div className="absolute left-0 mt-1 w-40 bg-white dark:bg-ash-800 border border-ash-200 dark:border-ash-700 rounded-lg shadow-lg z-50">
                <button
                  onClick={() => handleDownload('txt')}
                  className="w-full text-left px-4 py-2 hover:bg-ash-100 dark:hover:bg-ash-700 flex items-center gap-2 border-b border-ash-200 dark:border-ash-700"
                >
                  <Icons.FileText className="w-4 h-4" /> Download as TXT
                </button>
                <button
                  onClick={() => handleDownload('html')}
                  className="w-full text-left px-4 py-2 hover:bg-ash-100 dark:hover:bg-ash-700 flex items-center gap-2 border-b border-ash-200 dark:border-ash-700"
                >
                  <Icons.Code className="w-4 h-4" /> Download as HTML
                </button>
                <button
                  onClick={() => handleDownload('json')}
                  className="w-full text-left px-4 py-2 hover:bg-ash-100 dark:hover:bg-ash-700 flex items-center gap-2 border-b border-ash-200 dark:border-ash-700"
                >
                  <Icons.Database className="w-4 h-4" /> Download as JSON
                </button>
                <button
                  onClick={() => handleDownload('docx')}
                  className="w-full text-left px-4 py-2 hover:bg-ash-100 dark:hover:bg-ash-700 flex items-center gap-2"
                >
                  <Icons.FileText className="w-4 h-4" /> Download as DOCX
                </button>
              </div>
            )}
          </div>
          <button onClick={() => window.print()} className="flex flex-col items-center gap-1 p-2 hover:bg-ash-200 dark:hover:bg-ash-700 rounded">
            <Icons.Printer className="w-6 h-6" /> Print
          </button>
        </div>
      )}

      {/* Ribbon Content - Insert Tab */}
      {activeTab === 'Insert' && (
        <div className="p-4 border-b border-ash-200 dark:border-ash-700 bg-ash-50 dark:bg-ash-900/50 flex gap-4 flex-wrap">
          <button onClick={() => imageInputRef.current?.click()} className="flex flex-col items-center gap-1 p-2 hover:bg-ash-200 dark:hover:bg-ash-700 rounded">
            <Icons.Image className="w-6 h-6" /> Picture
          </button>
          <input ref={imageInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
          <button onClick={() => exec('insertTable')} className="flex flex-col items-center gap-1 p-2 hover:bg-ash-200 dark:hover:bg-ash-700 rounded">
            <Icons.Table className="w-6 h-6" /> Table
          </button>
          <button onClick={() => exec('link')} className="flex flex-col items-center gap-1 p-2 hover:bg-ash-200 dark:hover:bg-ash-700 rounded">
            <Icons.Link className="w-6 h-6" /> Link
          </button>
          <button onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center gap-1 p-2 hover:bg-ash-200 dark:hover:bg-ash-700 rounded">
            <Icons.Paperclip className="w-6 h-6" /> Attach
          </button>
          <input ref={fileInputRef} type="file" multiple onChange={handleFileSelect} className="hidden" />
          <button onClick={recognizing ? stopRecognition : startRecognition} className={`flex flex-col items-center gap-1 p-2 rounded ${recognizing ? 'bg-red-200 dark:bg-red-900' : 'hover:bg-ash-200 dark:hover:bg-ash-700'}`}>
            {recognizing ? <Icons.MicOff className="w-6 h-6" /> : <Icons.Mic className="w-6 h-6" />} {recognizing ? 'Stop' : 'Record'}
          </button>
        </div>
      )}

      {/* Ribbon Content - Review Tab */}
      {activeTab === 'Review' && (
        <div className="p-4 border-b border-ash-200 dark:border-ash-700 bg-ash-50 dark:bg-ash-900/50 flex gap-4 flex-wrap">
          <button onClick={calculateWordCount} className="flex flex-col items-center gap-1 p-2 hover:bg-ash-200 dark:hover:bg-ash-700 rounded">
            <Icons.BarChart3 className="w-6 h-6" /> Word Count
          </button>
          {wordCount > 0 && <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-ash-800 rounded"><Icons.Info className="w-5 h-5" /> {wordCount} words</div>}
        </div>
      )}

      {/* Ribbon Content - View Tab */}
      {activeTab === 'View' && (
        <div className="p-4 border-b border-ash-200 dark:border-ash-700 bg-ash-50 dark:bg-ash-900/50 flex gap-4 flex-wrap">
          <button onClick={() => document.documentElement.requestFullscreen()} className="flex flex-col items-center gap-1 p-2 hover:bg-ash-200 dark:hover:bg-ash-700 rounded">
            <Icons.Maximize className="w-6 h-6" /> Full Screen
          </button>
        </div>
      )}

      {/* Editor Area */}
      <div className="flex-1 overflow-auto p-6 bg-white dark:bg-ash-900 min-h-[40vh]">
        <CKEditorComponent
          config={editorConfig}
          data="<p>Start typing here...</p>"
          onReady={(editor) => {
            setEditorInstance(editor);
            // Apply dark mode styles safely (avoid runtime errors if structure differs)
            try {
              if (document.documentElement.classList.contains('dark')) {
                // Prefer CKEditor API accessors when available
                const editableEl = (editor && editor.ui && editor.ui.view && editor.ui.view.editable && editor.ui.view.editable.editableElement)
                  || (editor && editor.ui && typeof editor.ui.getEditableElement === 'function' && editor.ui.getEditableElement())
                  || document.querySelector('.ck-editor__editable');

                if (editableEl && editableEl.style) {
                  editableEl.style.backgroundColor = '#111827';
                  editableEl.style.color = '#ffffff';
                }
              }
            } catch (err) {
              // Fallback: don't crash the app if editor internals change
              // eslint-disable-next-line no-console
              console.warn('Could not apply CKEditor dark styles', err);
            }
            // Attach paste handler to convert plain URLs into links
            try {
              const editableEl = (editor && editor.ui && editor.ui.view && editor.ui.view.editable && editor.ui.view.editable.editableElement)
                || (editor && editor.ui && typeof editor.ui.getEditableElement === 'function' && editor.ui.getEditableElement())
                || document.querySelector('.ck-editor__editable');

              const pasteHandler = (evt) => {
                try {
                  const clipboardData = evt.clipboardData || window.clipboardData;
                  const text = clipboardData && clipboardData.getData && clipboardData.getData('text/plain');
                  if (text && isLikelyURL(text)) {
                    evt.preventDefault();
                    const href = text.trim().startsWith('http') ? text.trim() : `http://${text.trim()}`;
                    editor.model.change((writer) => {
                      const viewFragment = editor.data.processor.toView(`<a href="${href}" target="_blank" rel="noopener">${text.trim()}</a>`);
                      const modelFragment = editor.data.toModel(viewFragment);
                      editor.model.insertContent(modelFragment, editor.model.document.selection);
                    });
                  }
                } catch (e) {
                  // swallow
                }
              };

              if (editableEl && typeof editableEl.addEventListener === 'function') {
                // store handler reference for potential cleanup
                editableEl.__pasteHandler = pasteHandler;
                editableEl.addEventListener('paste', pasteHandler);

                // remove on editor destroy
                if (typeof editor.on === 'function') {
                  editor.on('destroy', () => {
                    try { editableEl.removeEventListener('paste', pasteHandler); } catch (e) {}
                  });
                }
              }
            } catch (err) {
              // ignore paste handler errors
            }
          }}
          onChange={() => calculateWordCount()}
          onBlur={() => calculateWordCount()}
        />

        {/* Attachments list */}
        {attachments.length > 0 && (
          <div className="mt-6">
            <h4 className="font-semibold mb-2 text-ash-900 dark:text-ash-100">Attachments</h4>
            <ul className="list-disc pl-6">
              {attachments.map((a, i) => (
                <li key={i} className="text-ash-700 dark:text-ash-300">{a.name} ({Math.round(a.size / 1024)} KB)</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="px-6 py-3 border-t border-ash-200 dark:border-ash-700 bg-ash-50 dark:bg-ash-900/50 flex justify-between text-sm text-ash-500 dark:text-ash-400">
        <span>Last saved: {lastSaved}</span>
        <span>{wordCount} words</span>
      </div>
    </div>
  );
}
