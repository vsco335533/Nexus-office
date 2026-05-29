// frontend/components/pages/QRGeneratorPage.jsx
'use client';

import { useState } from 'react';
import * as Icons from 'lucide-react';
import { useAppState } from '../../context/AppState';
import toast from 'react-hot-toast';

export default function QRGeneratorPage() {
  const { notes, generateQRCodeForNote } = useAppState();
  const [selectedNote, setSelectedNote] = useState(null);
  const [qrCode, setQrCode] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateQR = async (noteId) => {
    setIsGenerating(true);
    try {
      const qr = await generateQRCodeForNote(noteId);
      setQrCode(qr);
      setSelectedNote(noteId);
      toast.success('QR Code generated!');
    } catch (err) {
      toast.error('Failed to generate QR code');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadQR = () => {
    if (!qrCode) return;
    const link = document.createElement('a');
    link.href = qrCode;
    link.download = `qr-code-${selectedNote}.png`;
    link.click();
    toast.success('QR Code downloaded!');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white dark:bg-ash-800 rounded-xl p-6 border border-ash-200 dark:border-ash-700">
        <h1 className="text-3xl font-bold text-ash-900 dark:text-white">QR Code Generator</h1>
        <p className="text-ash-600 dark:text-ash-400 mt-1">Generate QR codes for your notes</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notes List */}
        <div className="lg:col-span-1 bg-white dark:bg-ash-800 rounded-xl border border-ash-200 dark:border-ash-700 overflow-hidden">
          <div className="p-4 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 border-b border-ash-200 dark:border-ash-700">
            <h2 className="font-bold text-ash-900 dark:text-white">Select a Note</h2>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notes.filter(n => !n.trashed).map((note) => (
              <button
                key={note.id}
                onClick={() => handleGenerateQR(note.id)}
                disabled={isGenerating}
                className={`w-full text-left p-4 border-b border-ash-100 dark:border-ash-700 hover:bg-ash-50 dark:hover:bg-ash-700 transition-colors ${
                  selectedNote === note.id ? 'bg-primary-50 dark:bg-primary-900/10' : ''
                }`}
              >
                <p className="font-semibold text-ash-900 dark:text-white truncate text-sm">
                  {note.title}
                </p>
                <p className="text-xs text-ash-600 dark:text-ash-400 truncate line-clamp-1">
                  {note.content}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* QR Display */}
        <div className="lg:col-span-2 bg-white dark:bg-ash-800 rounded-xl border border-ash-200 dark:border-ash-700 p-8 flex flex-col items-center justify-center min-h-96">
          {qrCode ? (
            <div className="space-y-6 text-center">
              <img src={qrCode} alt="QR Code" className="w-64 h-64 mx-auto border-4 border-ash-200 dark:border-ash-700 rounded-lg" />
              <div className="space-y-3">
                <p className="text-sm text-ash-600 dark:text-ash-400">
                  QR Code for: <span className="font-semibold text-ash-900 dark:text-white">{notes.find(n => n.id === selectedNote)?.title}</span>
                </p>
                <button
                  onClick={handleDownloadQR}
                  className="btn-primary w-full"
                >
                  <Icons.Download className="w-4 h-4 inline mr-2" />
                  Download QR Code
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <Icons.QrCode className="w-16 h-16 text-ash-300 dark:text-ash-600 mx-auto" />
              <p className="text-ash-500 dark:text-ash-400">Select a note to generate a QR code</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
