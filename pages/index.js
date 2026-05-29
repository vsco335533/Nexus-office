// pages/index.js
import { useState } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import MainDashboard from '../components/MainDashboard';
import { Toaster } from 'react-hot-toast';

// Dynamically import the entire Editor component with no SSR
// This prevents CKEditor from being loaded on the server
const Editor = dynamic(
  () => import('../components/Editor'),
  { 
    ssr: false,
    loading: () => (
      <div className="bg-white dark:bg-ash-800 rounded-3xl shadow-glossy overflow-hidden border border-ash-200 dark:border-ash-700 p-6">
        <div className="flex items-center justify-center h-96">
          <p className="text-ash-500 dark:text-ash-400">Loading editor...</p>
        </div>
      </div>
    )
  }
);

export default function Home() {
  const [activeNote, setActiveNote] = useState(null);

  return (
    <>
      <Head>
        <title>Nexus - Advanced Note Sharing</title>
        <meta name="description" content="Share notes with advanced features like QR codes, media support, and real-time collaboration" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MainDashboard />

      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#1f2937',
            borderRadius: '1rem',
            border: '1px solid #e5e5e5',
          },
          success: {
            iconTheme: {
              primary: '#dc2626',
              secondary: '#fff',
            },
          },
        }}
      />
    </>
  );
}