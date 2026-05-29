'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';

const CKEditorComponent = dynamic(
  async () => {
    const { CKEditor } = await import('@ckeditor/ckeditor5-react');
    const ClassicEditor = (await import('@ckeditor/ckeditor5-build-classic')).default;
    return {
      default: (props) => <CKEditor editor={ClassicEditor} {...props} />
    };
  },
  { ssr: false, loading: () => <div className="min-h-[300px] p-6">Loading editor...</div> }
);

export default function EditorFixedMinimal(){
  const [editor, setEditor] = useState(null);
  return (
    <div className="bg-white dark:bg-ash-900 rounded-xl p-4">
      <CKEditorComponent
        data="<p>Start typing...</p>"
        onReady={(ed) => setEditor(ed)}
      />
    </div>
  );
}
