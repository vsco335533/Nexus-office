// pages/[code].js — public viewer page. Anyone with the URL can read this paste.
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export default function PasteViewer({ paste, error: serverError, code }) {
  const [password, setPassword] = useState('');
  const [pwError, setPwError] = useState('');
  const [unlocked, setUnlocked] = useState(paste && !paste.passwordProtected ? paste : null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const isPasswordProtected = paste?.passwordProtected || false;
  const notFound = serverError === 'not_found';
  const expired = serverError === 'expired';

  const tryPassword = async () => {
    setPwError('');
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/paste/${code}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const json = await res.json();
      if (!res.ok) { setPwError(json.message || 'Wrong password'); setLoading(false); return; }
      setUnlocked(json);
    } catch {
      setPwError('Could not reach server');
    }
    setLoading(false);
  };

  const copyContent = () => {
    navigator.clipboard.writeText(unlocked?.content || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const content = unlocked?.content || '';
  const title = unlocked?.title || paste?.title || code;
  const viewCount = unlocked?.viewCount ?? paste?.viewCount ?? 0;
  const createdAt = unlocked?.createdAt || paste?.createdAt;

  return (
    <>
      <Head>
        <title>{title} — Nexus</title>
        <meta name="description" content={`Shared paste: ${title}`} />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-zinc-900 to-neutral-950 text-white flex flex-col">
        {/* Nav */}
        <nav className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-black/20 backdrop-blur-md">
          <Link href="/" className="flex items-center gap-2 font-black text-xl tracking-tight">
            <span className="w-8 h-8 bg-gradient-to-br from-red-500 to-rose-600 rounded-lg flex items-center justify-center text-white text-sm font-black">N</span>
            <span className="bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">Nexus</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/publish" className="text-sm bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              New Paste
            </Link>
            <Link href="/signin" className="text-sm text-zinc-400 hover:text-white transition-colors px-3 py-1.5">Sign In</Link>
          </div>
        </nav>

        <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-4 py-8">

          {/* NOT FOUND */}
          {notFound && (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <div className="text-7xl mb-6">🔍</div>
              <h1 className="text-3xl font-bold mb-3">Paste not found</h1>
              <p className="text-zinc-400 mb-8">The code <code className="bg-white/10 px-2 py-0.5 rounded text-red-400">/{code}</code> doesn't exist or has been deleted.</p>
              <Link href="/publish" className="px-6 py-3 bg-red-500 hover:bg-red-600 rounded-xl font-semibold transition-colors">
                Create a new paste
              </Link>
            </div>
          )}

          {/* EXPIRED */}
          {expired && (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <div className="text-7xl mb-6">⏰</div>
              <h1 className="text-3xl font-bold mb-3">This paste has expired</h1>
              <p className="text-zinc-400 mb-8">The owner set an expiry date and this paste is no longer available.</p>
              <Link href="/publish" className="px-6 py-3 bg-red-500 hover:bg-red-600 rounded-xl font-semibold transition-colors">
                Create a new paste
              </Link>
            </div>
          )}

          {/* PASSWORD GATE */}
          {isPasswordProtected && !unlocked && !notFound && !expired && (
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl">
                <div className="w-14 h-14 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-5">
                  <svg className="w-7 h-7 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold mb-1">{paste?.title || 'Protected Paste'}</h2>
                <p className="text-zinc-500 text-sm mb-6">This paste is password protected.</p>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && tryPassword()}
                  placeholder="Enter password…"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-zinc-600 outline-none focus:border-yellow-500/60 transition-colors text-sm mb-3"
                />
                {pwError && <p className="text-red-400 text-xs mb-3">{pwError}</p>}
                <button onClick={tryPassword} disabled={loading || !password}
                  className="w-full py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl transition-colors disabled:opacity-40">
                  {loading ? 'Checking…' : 'Unlock'}
                </button>
              </div>
            </div>
          )}

          {/* CONTENT */}
          {unlocked && (
            <>
              {/* Header */}
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-white mb-1">{title}</h1>
                  <div className="flex items-center gap-4 text-xs text-zinc-500">
                    {createdAt && (
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        {new Date(createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      {viewCount} views
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      {content.length} chars
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={copyContent}
                    className="flex items-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg text-xs font-medium transition-colors">
                    {copied ? (
                      <><svg className="w-3.5 h-3.5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Copied!</>
                    ) : (
                      <><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg> Copy</>
                    )}
                  </button>
                  <a href={`data:text/plain;charset=utf-8,${encodeURIComponent(content)}`} download={`${code}.txt`}
                    className="flex items-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg text-xs font-medium transition-colors">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    Download
                  </a>
                  <Link href="/publish"
                    className="flex items-center gap-1.5 px-3 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-xs font-medium transition-colors">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    New Paste
                  </Link>
                </div>
              </div>

              {/* Content Box */}
              <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5 bg-black/20">
                  <span className="text-xs text-zinc-500 font-mono">/{code}</span>
                  <span className="text-xs text-zinc-600">{content.split('\n').length} lines</span>
                </div>
                <div className="relative">
                  {/* Line numbers */}
                  <div className="flex">
                    <div className="hidden sm:block select-none border-r border-white/5 bg-black/20 px-3 py-4 text-right font-mono text-xs text-zinc-700 leading-6 min-w-[50px]">
                      {content.split('\n').map((_, i) => (
                        <div key={i}>{i + 1}</div>
                      ))}
                    </div>
                    <pre className="flex-1 px-5 py-4 text-zinc-200 font-mono text-sm leading-6 whitespace-pre-wrap break-words overflow-auto max-h-[65vh]">
                      {content}
                    </pre>
                  </div>
                </div>
              </div>

              {/* Footer CTA */}
              <div className="mt-6 text-center text-sm text-zinc-600">
                Want to share your own text?{' '}
                <Link href="/publish" className="text-red-400 hover:text-red-300 font-medium">Create a free paste →</Link>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps({ params }) {
  const { code } = params;

  // Skip Next.js internal routes
  const reserved = ['_next', 'api', 'favicon.ico', 'signin', 'signup', 'publish', 'tools', 'dashboard'];
  if (reserved.includes(code)) {
    return { notFound: true };
  }

  try {
    const res = await fetch(`${API}/api/paste/${code}`);
    const json = await res.json();

    if (res.status === 404) return { props: { paste: null, error: 'not_found', code } };
    if (res.status === 410) return { props: { paste: null, error: 'expired', code } };

    return { props: { paste: json, error: null, code } };
  } catch {
    return { props: { paste: null, error: 'not_found', code } };
  }
}
