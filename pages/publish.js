// pages/publish.js  — public page, no login required
import { useState, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export default function PublishPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [expiry, setExpiry] = useState('never');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [published, setPublished] = useState(null);
  const [copied, setCopied] = useState(false);
  const [codeError, setCodeError] = useState('');
  const textRef = useRef(null);

  const validateCode = (val) => {
    if (!val) { setCodeError(''); return true; }
    if (!/^[a-z0-9_-]+$/.test(val)) {
      setCodeError('Only lowercase letters, numbers, hyphens and underscores');
      return false;
    }
    if (val.length < 3) { setCodeError('Minimum 3 characters'); return false; }
    if (val.length > 60) { setCodeError('Maximum 60 characters'); return false; }
    setCodeError('');
    return true;
  };

  const handleCodeChange = (e) => {
    const val = e.target.value.toLowerCase().replace(/\s+/g, '-');
    setCode(val);
    validateCode(val);
  };

  const getExpireDate = () => {
    if (expiry === 'never') return null;
    const d = new Date();
    if (expiry === '1h') d.setHours(d.getHours() + 1);
    if (expiry === '24h') d.setHours(d.getHours() + 24);
    if (expiry === '7d') d.setDate(d.getDate() + 7);
    if (expiry === '30d') d.setDate(d.getDate() + 30);
    return d.toISOString();
  };

  const handlePublish = async () => {
    setError('');
    if (!content.trim()) { setError('Please write some content first'); return; }
    if (code && !validateCode(code)) return;

    setLoading(true);
    try {
      const body = {
        title: title.trim() || 'Untitled',
        content: content.trim(),
        code: code.trim() || undefined,
        password: password.trim() || undefined,
        expiresAt: getExpireDate(),
      };
      const res = await fetch(`${API}/api/paste`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok) { setError(json.message || 'Failed to publish'); setLoading(false); return; }
      setPublished(json);
    } catch (err) {
      setError('Could not reach server. Is the backend running?');
    }
    setLoading(false);
  };

  const copyUrl = () => {
    const url = `${window.location.origin}/${published.code}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareUrl = published ? `${typeof window !== 'undefined' ? window.location.origin : ''}/${published.code}` : '';

  return (
    <>
      <Head>
        <title>Publish & Share Text — Nexus</title>
        <meta name="description" content="Write text, set a short code, share the URL. No login needed." />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-zinc-900 to-neutral-950 text-white">
        {/* Top Nav */}
        <nav className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-black/20 backdrop-blur-md sticky top-0 z-40">
          <Link href="/" className="flex items-center gap-2 font-black text-xl tracking-tight">
            <span className="w-8 h-8 bg-gradient-to-br from-red-500 to-rose-600 rounded-lg flex items-center justify-center text-white text-sm font-black">N</span>
            <span className="bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">Nexus</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/signin" className="text-sm text-zinc-400 hover:text-white transition-colors px-3 py-1.5">Sign In</Link>
            <Link href="/tools" className="text-sm text-zinc-400 hover:text-white transition-colors px-3 py-1.5">Free Tools</Link>
            <Link href="/signup" className="text-sm bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg font-medium transition-colors">Sign Up Free</Link>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-4 py-10">
          {!published ? (
            <>
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold mb-2">Share Any Text Instantly</h1>
                <p className="text-zinc-400 text-lg">Write → Set a code → Share the link. No login needed.</p>
              </div>

              {/* Main Editor Card */}
              <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                {/* Title */}
                <div className="border-b border-white/5 px-5 py-3">
                  <input
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="Title (optional)"
                    className="w-full bg-transparent text-xl font-semibold placeholder-zinc-600 outline-none text-white"
                  />
                </div>

                {/* Content */}
                <textarea
                  ref={textRef}
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder="Write or paste your text here..."
                  rows={16}
                  className="w-full bg-transparent px-5 py-4 text-zinc-200 placeholder-zinc-600 outline-none resize-none font-mono text-sm leading-relaxed"
                />

                {/* Options Bar */}
                <div className="border-t border-white/5 bg-black/20 px-5 py-4 flex flex-wrap gap-4 items-end">
                  {/* Custom Code */}
                  <div className="flex-1 min-w-[200px]">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1 block">Custom URL Code</label>
                    <div className="flex items-center bg-black/40 border border-white/10 rounded-lg overflow-hidden focus-within:border-red-500/60 transition-colors">
                      <span className="px-3 py-2 text-zinc-600 text-xs border-r border-white/10 whitespace-nowrap">nexus.app/</span>
                      <input
                        value={code}
                        onChange={handleCodeChange}
                        placeholder="my-note-2024"
                        className="flex-1 bg-transparent px-3 py-2 text-sm text-white placeholder-zinc-600 outline-none"
                      />
                    </div>
                    {codeError && <p className="text-red-400 text-xs mt-1">{codeError}</p>}
                  </div>

                  {/* Expiry */}
                  <div className="min-w-[140px]">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1 block">Expires</label>
                    <select
                      value={expiry}
                      onChange={e => setExpiry(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-red-500/60 transition-colors"
                    >
                      <option value="never">Never</option>
                      <option value="1h">In 1 hour</option>
                      <option value="24h">In 24 hours</option>
                      <option value="7d">In 7 days</option>
                      <option value="30d">In 30 days</option>
                    </select>
                  </div>

                  {/* Password */}
                  <div className="min-w-[160px]">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1 block">Password (optional)</label>
                    <input
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Leave blank = public"
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-600 outline-none focus:border-red-500/60 transition-colors"
                    />
                  </div>

                  {/* Char count */}
                  <div className="ml-auto flex items-center gap-4">
                    <span className="text-xs text-zinc-600">{content.length} chars</span>
                    <button
                      onClick={handlePublish}
                      disabled={loading || !content.trim()}
                      className="px-6 py-2 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all shadow-lg shadow-red-500/20 flex items-center gap-2"
                    >
                      {loading ? (
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                      )}
                      {loading ? 'Publishing…' : 'Publish & Share'}
                    </button>
                  </div>
                </div>
              </div>

              {error && (
                <div className="mt-4 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                  {error}
                </div>
              )}

              {/* Feature hints */}
              <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: '🔗', title: 'Custom URL', desc: 'Set your own short code like /team-notes' },
                  { icon: '🔒', title: 'Password Protect', desc: 'Optional password for private sharing' },
                  { icon: '⏱', title: 'Auto Expire', desc: 'Set expiry from 1 hour to 30 days' },
                  { icon: '⚡', title: 'No Login Needed', desc: 'Friends read it instantly, no account' },
                ].map(f => (
                  <div key={f.title} className="bg-white/5 border border-white/5 rounded-xl p-4">
                    <div className="text-2xl mb-2">{f.icon}</div>
                    <div className="font-semibold text-sm text-white">{f.title}</div>
                    <div className="text-xs text-zinc-500 mt-1">{f.desc}</div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            /* ====== SUCCESS STATE ====== */
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold mb-2">Published!</h2>
              <p className="text-zinc-400 mb-8">Share this link with anyone — they can read it without logging in.</p>

              {/* URL Card */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 max-w-lg mx-auto mb-6">
                <div className="text-xs text-zinc-500 uppercase tracking-widest mb-2 font-mono">Your shareable link</div>
                <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-xl px-4 py-3">
                  <span className="text-red-400 flex-1 text-left font-mono text-sm truncate">{shareUrl}</span>
                  <button
                    onClick={copyUrl}
                    className="flex-shrink-0 bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                  >
                    {copied ? '✓ Copied!' : 'Copy'}
                  </button>
                </div>
                {published.password && (
                  <div className="mt-3 text-xs text-zinc-500 flex items-center gap-1.5 justify-center">
                    <svg className="w-3.5 h-3.5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                    Password protected — share the password separately
                  </div>
                )}
                {published.expiresAt && (
                  <div className="mt-2 text-xs text-zinc-500 flex items-center gap-1.5 justify-center">
                    <svg className="w-3.5 h-3.5 text-orange-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" /></svg>
                    Expires: {new Date(published.expiresAt).toLocaleString()}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap justify-center gap-3">
                <a href={`/${published.code}`} target="_blank" rel="noreferrer"
                  className="px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-sm font-medium transition-colors flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                  Open Link
                </a>
                <button onClick={() => { setPublished(null); setContent(''); setTitle(''); setCode(''); setPassword(''); setExpiry('never'); }}
                  className="px-5 py-2.5 bg-red-500 hover:bg-red-600 rounded-xl text-sm font-medium transition-colors flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  Create Another
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
