// frontend/components/pages/ExportPage.jsx
'use client';

import * as Icons from 'lucide-react';
import { useAppState } from '../../context/AppState';
import toast from 'react-hot-toast';

export default function ExportPage() {
  const { exportNotes } = useAppState();

  const handleExport = (format) => {
    toast.promise(
      exportNotes(format),
      {
        loading: `Exporting as ${format.toUpperCase()}...`,
        success: `Exported as ${format.toUpperCase()}!`,
        error: 'Export failed',
      }
    );
  };

  const exportOptions = [
    {
      format: 'json',
      title: 'JSON Format',
      description: 'Export all notes as a structured JSON file',
      icon: Icons.Code,
      color: 'primary'
    },
    {
      format: 'docx',
      title: 'Word Document',
      description: 'Export as a Microsoft Word document',
      icon: Icons.FileText,
      color: 'blue'
    },
    {
      format: 'html',
      title: 'HTML Format',
      description: 'Export as an HTML file',
      icon: Icons.Globe,
      color: 'green'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white dark:bg-ash-800 rounded-xl p-6 border border-ash-200 dark:border-ash-700">
        <h1 className="text-3xl font-bold text-ash-900 dark:text-white">Export Notes</h1>
        <p className="text-ash-600 dark:text-ash-400 mt-1">Download your notes in various formats</p>
      </div>

      {/* Export Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {exportOptions.map((option) => {
          const Icon = option.icon;
          const colorClass = {
            primary: 'from-primary-500 to-primary-600',
            blue: 'from-blue-500 to-blue-600',
            green: 'from-green-500 to-green-600',
          }[option.color];

          return (
            <button
              key={option.format}
              onClick={() => handleExport(option.format)}
              className="bg-white dark:bg-ash-800 rounded-xl p-8 border border-ash-200 dark:border-ash-700 hover:shadow-lg transition-all text-left hover:border-primary-500 dark:hover:border-primary-400"
            >
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${colorClass} flex items-center justify-center text-white mb-4`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-ash-900 dark:text-white mb-2">{option.title}</h3>
              <p className="text-sm text-ash-600 dark:text-ash-400">{option.description}</p>
            </button>
          );
        })}
      </div>

      {/* Info Box */}
      <div className="bg-primary-50 dark:bg-primary-900/10 border border-primary-200 dark:border-primary-800 rounded-xl p-6">
        <div className="flex gap-4">
          <Icons.Info className="w-6 h-6 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-1" />
          <div>
            <h4 className="font-bold text-ash-900 dark:text-white mb-2">Export Information</h4>
            <ul className="text-sm text-ash-700 dark:text-ash-300 space-y-1">
              <li>• All non-trashed notes will be included in the export</li>
              <li>• File will be automatically downloaded to your computer</li>
              <li>• You can import this file back into Nexus anytime</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
