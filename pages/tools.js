// pages/tools.js — public free tools page, no login needed
import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';

/* ─── Password Generator ─── */
function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = () => {
    const up = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lo = 'abcdefghijklmnopqrstuvwxyz';
    const nu = '0123456789';
    const sy = '!@#$%^&*()-_=+[]{}|;:,.<>?';
    let chars = '';
    if (upper) chars += up;
    if (lower) chars += lo;
    if (numbers) chars += nu;
    if (symbols) chars += sy;
    if (!chars) chars = lo;
    let pw = '';
    for (let i = 0; i < length; i++) pw += chars[Math.floor(Math.random() * chars.length)];
    setPassword(pw);
  };

  useEffect(() => { generate(); }, [length, upper, lower, numbers, symbols]);

  const copy = () => { navigator.clipboard.writeText(password); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  const strength = () => {
    let s = 0;
    if (upper && password) s++;
    if (lower && password) s++;
    if (numbers && password) s++;
    if (symbols && password) s++;
    if (length >= 12) s++;
    if (length >= 20) s++;
    if (s <= 2) return { label: 'Weak', color: 'bg-red-500', w: '33%' };
    if (s <= 4) return { label: 'Medium', color: 'bg-yellow-500', w: '66%' };
    return { label: 'Strong', color: 'bg-green-500', w: '100%' };
  };
  const str = strength();

  return (
    <div className="space-y-4">
      <div className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 flex items-center gap-2">
        <code className="flex-1 text-green-400 font-mono text-sm break-all">{password || '…'}</code>
        <button onClick={copy} className="flex-shrink-0 bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors">
          {copied ? '✓' : 'Copy'}
        </button>
      </div>
      <div>
        <div className="flex justify-between text-xs text-zinc-500 mb-1"><span>Strength</span><span>{str.label}</span></div>
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden"><div className={`h-full ${str.color} transition-all duration-300 rounded-full`} style={{ width: str.w }} /></div>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm text-zinc-400">Length: {length}</label>
          <input type="range" min={6} max={64} value={length} onChange={e => setLength(+e.target.value)} className="w-32 accent-red-500" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[['Uppercase', upper, setUpper], ['Lowercase', lower, setLower], ['Numbers', numbers, setNumbers], ['Symbols', symbols, setSymbols]].map(([label, val, setter]) => (
            <label key={label} className="flex items-center gap-2 text-sm text-zinc-400 cursor-pointer">
              <input type="checkbox" checked={val} onChange={e => setter(e.target.checked)} className="accent-red-500 w-4 h-4" />
              {label}
            </label>
          ))}
        </div>
      </div>
      <button onClick={generate} className="w-full py-2.5 bg-red-500 hover:bg-red-600 rounded-xl text-sm font-semibold transition-colors">Regenerate</button>
    </div>
  );
}

/* ─── Color Picker ─── */
function ColorPicker() {
  const [color, setColor] = useState('#ef4444');
  const [copied, setCopied] = useState('');

  const hex = color;
  const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
  const rgb = `rgb(${r}, ${g}, ${b})`;
  const hsl = (() => {
    const r1 = r / 255, g1 = g / 255, b1 = b / 255;
    const max = Math.max(r1, g1, b1), min = Math.min(r1, g1, b1);
    let h, s, l = (max + min) / 2;
    if (max === min) { h = s = 0; } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r1: h = ((g1 - b1) / d + (g1 < b1 ? 6 : 0)) / 6; break;
        case g1: h = ((b1 - r1) / d + 2) / 6; break;
        default: h = ((r1 - g1) / d + 4) / 6;
      }
    }
    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
  })();

  const copy = (val) => { navigator.clipboard.writeText(val); setCopied(val); setTimeout(() => setCopied(''), 2000); };

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="w-full h-24 rounded-xl border border-white/10" style={{ backgroundColor: color }} />
        <input type="color" value={color} onChange={e => setColor(e.target.value)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full font-mono">{hex}</span>
        </div>
      </div>
      <div className="space-y-2">
        {[['HEX', hex], ['RGB', rgb], ['HSL', hsl]].map(([label, val]) => (
          <div key={label} className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-xl px-3 py-2">
            <span className="text-xs font-bold text-zinc-500 w-8">{label}</span>
            <code className="flex-1 text-sm text-zinc-200 font-mono">{val}</code>
            <button onClick={() => copy(val)} className="text-xs bg-white/10 hover:bg-white/20 px-2 py-1 rounded-lg transition-colors">
              {copied === val ? '✓' : 'Copy'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Focus Timer (Pomodoro) ─── */
function FocusTimer() {
  const [mode, setMode] = useState('focus'); // focus | short | long
  const modes = { focus: 25 * 60, short: 5 * 60, long: 15 * 60 };
  const [time, setTime] = useState(modes.focus);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  const reset = (m = mode) => { clearInterval(intervalRef.current); setRunning(false); setTime(modes[m]); };
  const switchMode = (m) => { setMode(m); reset(m); setTime(modes[m]); };

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => setTime(t => { if (t <= 1) { clearInterval(intervalRef.current); setRunning(false); return 0; } return t - 1; }), 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const mm = String(Math.floor(time / 60)).padStart(2, '0');
  const ss = String(time % 60).padStart(2, '0');
  const total = modes[mode];
  const pct = ((total - time) / total) * 100;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-2">
        {[['focus', 'Focus'], ['short', 'Short Break'], ['long', 'Long Break']].map(([m, label]) => (
          <button key={m} onClick={() => switchMode(m)}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${mode === m ? 'bg-red-500 text-white' : 'bg-white/10 text-zinc-400 hover:bg-white/20'}`}>
            {label}
          </button>
        ))}
      </div>
      <div className="relative w-40 h-40">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
          <circle cx="50" cy="50" r="44" fill="none" stroke="#ef4444" strokeWidth="8"
            strokeDasharray={`${pct * 2.765} ${276.5}`} strokeLinecap="round" className="transition-all duration-1000" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl font-bold font-mono text-white">{mm}:{ss}</span>
        </div>
      </div>
      <div className="flex gap-3">
        <button onClick={() => setRunning(r => !r)}
          className="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-colors">
          {running ? 'Pause' : 'Start'}
        </button>
        <button onClick={() => reset()} className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors text-sm">Reset</button>
      </div>
    </div>
  );
}

/* ─── Text Case Converter ─── */
function TextCaseConverter() {
  const [text, setText] = useState('');
  const [result, setResult] = useState('');
  const [active, setActive] = useState('');
  const [copied, setCopied] = useState(false);

  const convert = (type) => {
    setActive(type);
    if (type === 'upper') setResult(text.toUpperCase());
    else if (type === 'lower') setResult(text.toLowerCase());
    else if (type === 'title') setResult(text.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()));
    else if (type === 'sentence') setResult(text.charAt(0).toUpperCase() + text.slice(1).toLowerCase());
    else if (type === 'camel') setResult(text.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase()));
    else if (type === 'snake') setResult(text.toLowerCase().replace(/\s+/g, '_'));
    else if (type === 'kebab') setResult(text.toLowerCase().replace(/\s+/g, '-'));
    else if (type === 'toggle') setResult(text.split('').map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join(''));
  };

  const copy = () => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div className="space-y-3">
      <textarea value={text} onChange={e => { setText(e.target.value); if (active) convert(active); }}
        placeholder="Paste your text here…" rows={4}
        className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 outline-none resize-none font-mono" />
      <div className="grid grid-cols-2 gap-2">
        {[['upper', 'UPPERCASE'], ['lower', 'lowercase'], ['title', 'Title Case'], ['sentence', 'Sentence case'], ['camel', 'camelCase'], ['snake', 'snake_case'], ['kebab', 'kebab-case'], ['toggle', 'tOGGLE cASE']].map(([type, label]) => (
          <button key={type} onClick={() => convert(type)}
            className={`text-xs py-2 rounded-lg font-medium transition-colors ${active === type ? 'bg-red-500 text-white' : 'bg-white/10 text-zinc-400 hover:bg-white/20'}`}>
            {label}
          </button>
        ))}
      </div>
      {result && (
        <div className="relative bg-black/40 border border-white/10 rounded-xl px-3 py-2.5">
          <pre className="text-sm text-zinc-200 font-mono whitespace-pre-wrap break-words">{result}</pre>
          <button onClick={copy} className="absolute top-2 right-2 text-xs bg-white/10 hover:bg-white/20 px-2 py-1 rounded-lg transition-colors">
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>
      )}
    </div>
  );
}

/* ─── Duplicate Line Remover ─── */
function DuplicateRemover() {
  const [input, setInput] = useState('');
  const [ignoreCase, setIgnoreCase] = useState(false);
  const [trimLines, setTrimLines] = useState(true);
  const [removeEmpty, setRemoveEmpty] = useState(false);
  const [copied, setCopied] = useState(false);

  const process = () => {
    let lines = input.split('\n');
    if (trimLines) lines = lines.map(l => l.trim());
    if (removeEmpty) lines = lines.filter(l => l.length > 0);
    const seen = new Set();
    return lines.filter(line => {
      const key = ignoreCase ? line.toLowerCase() : line;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }).join('\n');
  };

  const result = input ? process() : '';
  const removed = input ? input.split('\n').length - result.split('\n').filter(Boolean).length : 0;
  const copy = () => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div className="space-y-3">
      <textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Paste lines here (one per line)…" rows={6}
        className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 outline-none resize-none font-mono" />
      <div className="flex flex-wrap gap-3 text-sm">
        {[['ignoreCase', 'Ignore case', ignoreCase, setIgnoreCase], ['trim', 'Trim whitespace', trimLines, setTrimLines], ['empty', 'Remove empty lines', removeEmpty, setRemoveEmpty]].map(([id, label, val, setter]) => (
          <label key={id} className="flex items-center gap-2 text-zinc-400 cursor-pointer">
            <input type="checkbox" checked={val} onChange={e => setter(e.target.checked)} className="accent-red-500" />
            {label}
          </label>
        ))}
      </div>
      {result && (
        <div className="relative">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-zinc-500">{removed} duplicate{removed !== 1 ? 's' : ''} removed</span>
            <button onClick={copy} className="text-xs bg-white/10 hover:bg-white/20 px-2 py-1 rounded-lg transition-colors">{copied ? '✓ Copied' : 'Copy'}</button>
          </div>
          <pre className="bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-zinc-200 font-mono whitespace-pre-wrap break-words max-h-48 overflow-auto">{result}</pre>
        </div>
      )}
    </div>
  );
}

/* ─── World Timezones ─── */
function WorldTimezones() {
  const [now, setNow] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);

  const zones = [
    { city: 'New York', tz: 'America/New_York', flag: '🇺🇸' },
    { city: 'London', tz: 'Europe/London', flag: '🇬🇧' },
    { city: 'Paris', tz: 'Europe/Paris', flag: '🇫🇷' },
    { city: 'Dubai', tz: 'Asia/Dubai', flag: '🇦🇪' },
    { city: 'Mumbai', tz: 'Asia/Kolkata', flag: '🇮🇳' },
    { city: 'Singapore', tz: 'Asia/Singapore', flag: '🇸🇬' },
    { city: 'Tokyo', tz: 'Asia/Tokyo', flag: '🇯🇵' },
    { city: 'Sydney', tz: 'Australia/Sydney', flag: '🇦🇺' },
    { city: 'Los Angeles', tz: 'America/Los_Angeles', flag: '🇺🇸' },
  ];

  const fmt = (tz) => now.toLocaleTimeString('en-US', { timeZone: tz, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  const fmtDate = (tz) => now.toLocaleDateString('en-US', { timeZone: tz, weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <div className="space-y-2 max-h-80 overflow-auto pr-1">
      {zones.map(({ city, tz, flag }) => (
        <div key={tz} className="flex items-center justify-between bg-black/30 border border-white/5 rounded-xl px-3 py-2.5 hover:bg-white/5 transition-colors">
          <div className="flex items-center gap-2">
            <span className="text-xl">{flag}</span>
            <div>
              <div className="text-sm font-medium text-white">{city}</div>
              <div className="text-xs text-zinc-500">{fmtDate(tz)}</div>
            </div>
          </div>
          <span className="font-mono text-sm text-red-400 font-semibold">{fmt(tz)}</span>
        </div>
      ))}
    </div>
  );
}

/* ─── Main Tools Page ─── */
const TOOLS = [
  { id: 'password', title: 'Password Generator', icon: '🔐', desc: 'Create strong, secure passwords instantly', component: PasswordGenerator },
  { id: 'color', title: 'Color Picker', icon: '🎨', desc: 'Choose and convert colors with ease', component: ColorPicker },
  { id: 'timer', title: 'Focus Timer', icon: '⏱', desc: 'Pomodoro timer to boost your productivity', component: FocusTimer },
  { id: 'case', title: 'Text Case Converter', icon: '🔤', desc: 'UPPERCASE, lowercase, camelCase, snake_case and more', component: TextCaseConverter },
  { id: 'dedup', title: 'Duplicate Line Remover', icon: '🧹', desc: 'Remove duplicate lines from any text', component: DuplicateRemover },
  { id: 'tz', title: 'World Timezones', icon: '🌍', desc: 'See current time across different timezones', component: WorldTimezones },
];

export default function ToolsPage() {
  const [active, setActive] = useState(null);

  const ActiveTool = active ? TOOLS.find(t => t.id === active)?.component : null;
  const activeMeta = active ? TOOLS.find(t => t.id === active) : null;

  return (
    <>
      <Head>
        <title>Free Online Tools — Nexus</title>
        <meta name="description" content="Free online tools for productivity: password generator, color picker, focus timer, text converter and more." />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-zinc-900 to-neutral-950 text-white">
        {/* Nav */}
        <nav className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-black/20 backdrop-blur-md sticky top-0 z-40">
          <Link href="/" className="flex items-center gap-2 font-black text-xl tracking-tight">
            <span className="w-8 h-8 bg-gradient-to-br from-red-500 to-rose-600 rounded-lg flex items-center justify-center text-white text-sm font-black">N</span>
            <span className="bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">Nexus</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/publish" className="text-sm text-zinc-400 hover:text-white transition-colors px-3 py-1.5">Share Text</Link>
            <Link href="/signin" className="text-sm text-zinc-400 hover:text-white transition-colors px-3 py-1.5">Sign In</Link>
            <Link href="/signup" className="text-sm bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg font-medium transition-colors">Sign Up Free</Link>
          </div>
        </nav>

        <div className="max-w-5xl mx-auto px-4 py-10">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold mb-2">Free Online Tools</h1>
            <p className="text-zinc-400 text-lg">Helpful utilities for everyday tasks — all free, no login needed</p>
          </div>

          {!active ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {TOOLS.map(tool => (
                <button key={tool.id} onClick={() => setActive(tool.id)}
                  className="text-left bg-white/5 hover:bg-white/10 border border-white/10 hover:border-red-500/30 rounded-2xl p-6 transition-all duration-200 group hover:shadow-lg hover:shadow-red-500/10 hover:-translate-y-0.5">
                  <div className="text-4xl mb-4">{tool.icon}</div>
                  <h3 className="font-semibold text-white text-lg mb-1 group-hover:text-red-300 transition-colors">{tool.title}</h3>
                  <p className="text-zinc-500 text-sm">{tool.desc}</p>
                  <div className="mt-4 text-xs text-red-400 font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Open tool →
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="max-w-2xl mx-auto">
              <button onClick={() => setActive(null)}
                className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-6 text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                All Tools
              </button>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl">{activeMeta.icon}</span>
                  <div>
                    <h2 className="text-xl font-bold text-white">{activeMeta.title}</h2>
                    <p className="text-zinc-500 text-sm">{activeMeta.desc}</p>
                  </div>
                </div>
                <ActiveTool />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
