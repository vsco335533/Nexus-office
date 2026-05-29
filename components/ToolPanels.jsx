import { useState } from 'react';
import * as Icons from 'lucide-react';
import { useAppState } from '../context/AppState';

export default function ToolPanels() {
  const { activeView, notes, exportNotes, generateQRCodeForNote } = useAppState();
  const [qrFor, setQrFor] = useState(null);
  const [qrData, setQrData] = useState(null);

  if (activeView === 'qr-generator') {
    return (
      <div className="bg-white dark:bg-ash-800 rounded-2xl p-4 border border-ash-200 dark:border-ash-700">
        <h3 className="font-semibold mb-3">QR Generator</h3>
        <p className="text-sm text-ash-500 mb-3">Select a note to generate a QR code (data-URL placeholder).</p>
        <div className="grid gap-2">
          {notes.filter(n => !n.trashed).map(n => (
            <button key={n.id} onClick={() => setQrFor(n.id)} className="p-3 rounded-lg hover:bg-ash-100 dark:hover:bg-ash-700 text-left">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{n.title}</div>
                  <div className="text-xs text-ash-500">{n.project || 'No project'}</div>
                </div>
                <Icons.QrCode className="w-6 h-6 text-ash-400" />
              </div>
            </button>
          ))}
        </div>

        {qrFor && (
          <div className="mt-4 bg-ash-50 dark:bg-ash-900 p-4 rounded">
            <h4 className="font-semibold mb-2">QR for note</h4>
            {qrData ? (
              <img src={qrData} alt="qr" className="w-40 h-40" />
            ) : (
              <div className="w-40 h-40 bg-ash-200 dark:bg-ash-700 rounded flex items-center justify-center">Loading...</div>
            )}
            <div className="mt-3 flex gap-2">
              <button onClick={async () => {
                const data = await generateQRCodeForNote(qrFor);
                setQrData(data);
              }} className="btn-primary">Generate</button>
              {qrData && <a className="btn-outline" href={qrData} download={`note-${qrFor}-qr.png`}>Download</a>}
            </div>
          </div>
        )}
      </div>
    );
  }

    if (activeView === 'export') {
    return (
      <div className="bg-white dark:bg-ash-800 rounded-2xl p-4 border border-ash-200 dark:border-ash-700">
        <h3 className="font-semibold mb-3">Export Notes</h3>
        <p className="text-sm text-ash-500 mb-3">Export all active notes as JSON or DOCX.</p>
        <div className="flex gap-2">
          <button onClick={() => exportNotes('json')} className="btn-primary">Download JSON</button>
          <button onClick={() => exportNotes('docx')} className="btn-secondary">Download DOCX</button>
        </div>
      </div>
    );
  }

  if (activeView === 'history' || activeView === 'version-history' || activeView === 'history') {
    return (
      <div className="bg-white dark:bg-ash-800 rounded-2xl p-4 border border-ash-200 dark:border-ash-700">
        <h3 className="font-semibold mb-3">Version History</h3>
        <p className="text-sm text-ash-500">Version history is not implemented yet. This is a placeholder for future integration.</p>
      </div>
    );
  }

  if (activeView === 'trash') {
    return (
      <div className="bg-white dark:bg-ash-800 rounded-2xl p-4 border border-ash-200 dark:border-ash-700">
        <h3 className="font-semibold mb-3">Trash</h3>
        <p className="text-sm text-ash-500 mb-3">Notes in the trash.</p>
        <div className="space-y-2">
          {notes.filter(n => n.trashed).map(n => (
            <div key={n.id} className="p-3 rounded-lg bg-ash-50 dark:bg-ash-900 flex items-center justify-between">
              <div>
                <div className="font-medium">{n.title}</div>
                <div className="text-xs text-ash-500">{n.content}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
}
