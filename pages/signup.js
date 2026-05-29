'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAppState } from '../context/AppState';

export default function SignUpPage() {
  const { signUp, user } = useAppState();
  const router = useRouter();
  const canvasRef = useRef(null);
  const formRef = useRef(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) router.push('/');
  }, [user]);

  // Google reCAPTCHA v3 script insertion
  useEffect(() => {
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    if (!siteKey) return;
    if (typeof window === 'undefined') return;
    if (window.grecaptcha) return;
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
    script.async = true;
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Interactive High-Tech Canvas Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Node particle system
    const particleCount = Math.min(60, Math.floor((width * height) / 25000));
    const particles = [];
    const mouse = { x: null, y: null, radius: 180 };

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 1,
        pulseSpeed: Math.random() * 0.02 + 0.005,
        pulseVal: Math.random() * Math.PI
      });
    }

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    const drawGrid = () => {
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.03)';
      ctx.lineWidth = 1;
      const gridSize = 45;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      drawGrid();

      // Update and draw particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // Bounce walls
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Pulse size slightly
        p.pulseVal += p.pulseSpeed;
        const currentSize = p.size + Math.sin(p.pulseVal) * 0.5;

        // Draw particle node
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(239, 68, 68, 0.45)';
        ctx.fill();
        
        // Minor glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentSize * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(239, 68, 68, 0.08)';
        ctx.fill();
      });

      // Draw connection lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            const alpha = (1 - dist / 130) * 0.15;
            ctx.strokeStyle = `rgba(239, 68, 68, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw mouse interactive lines
      if (mouse.x !== null && mouse.y !== null) {
        particles.forEach((p) => {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.radius) {
            const alpha = (1 - dist / mouse.radius) * 0.25;
            ctx.strokeStyle = `rgba(59, 130, 246, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        });
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const fd = new FormData(formRef.current);
    const name = fd.get('name');
    const email = fd.get('email');
    const password = fd.get('password');

    let recaptchaToken = null;
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    if (siteKey && typeof window !== 'undefined' && window.grecaptcha) {
      try {
        recaptchaToken = await window.grecaptcha.execute(siteKey, { action: 'signup' });
      } catch (err) {
        console.warn('reCAPTCHA execute failed', err);
      }
    }

    try {
      const res = await signUp({ email, password, name, recaptchaToken });
      setLoading(false);
      if (res.ok) {
        router.push('/signin');
      } else {
        setErrorMsg(res.error || 'Registry request rejected by database server.');
      }
    } catch (err) {
      setLoading(false);
      setErrorMsg('Failed to dispatch registry handshake payload.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden select-none">
      
      {/* Interactive High-Tech Canvas Layer */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />

      {/* Cyber Workstation CSS Styling & CRT Scanline Effects */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scanline-sweep {
          0% { transform: translateY(-100vh); }
          100% { transform: translateY(100vh); }
        }
        @keyframes crt-flicker {
          0% { opacity: 0.98; }
          50% { opacity: 1; }
          100% { opacity: 0.99; }
        }
        @keyframes led-glow {
          0%, 100% { opacity: 0.4; filter: drop-shadow(0 0 1px rgba(16, 185, 129, 0.2)); }
          50% { opacity: 1; filter: drop-shadow(0 0 8px rgba(16, 185, 129, 0.8)); }
        }
        @keyframes panel-in {
          from { opacity: 0; transform: translateY(20px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .scanline-overlay {
          background: linear-gradient(
            rgba(18, 16, 16, 0) 50%, 
            rgba(0, 0, 0, 0.25) 50%
          );
          background-size: 100% 4px;
        }
        .scanline-bar {
          animation: scanline-sweep 7s linear infinite;
        }
        .animate-led {
          animation: led-glow 1.8s ease-in-out infinite;
        }
        .animate-panel {
          animation: panel-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .crt-screen {
          animation: crt-flicker 0.15s infinite;
        }
      ` }} />

      {/* CRT Scanline & Ambient Filter layers */}
      <div className="absolute inset-0 scanline-overlay pointer-events-none z-1"></div>
      <div className="absolute w-full h-[6px] bg-red-500/10 scanline-bar pointer-events-none z-1"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/92 to-slate-900 pointer-events-none z-0"></div>

      {/* Glowing atmospheric neon grids */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none z-0"></div>

      {/* Corporate High-Security Console Interface */}
      <div className="bg-slate-950/70 border border-red-500/15 p-8 md:p-10 rounded-3xl shadow-[0_0_50px_-12px_rgba(239,68,68,0.2)] flex flex-col max-w-md w-full relative z-10 animate-panel crt-screen backdrop-blur-xl transition-all duration-300">
        
        {/* Top Operational Status Bar */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-8 text-[9px] font-mono tracking-widest text-neutral-400">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-led"></span>
            <span>SECURE WORKSPACE SYSTEM // REQ-5002</span>
          </div>
          <span className="text-red-500 font-bold bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">REGISTRY</span>
        </div>

        {/* Corporate Workspace Identity */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/25 mb-4 transform hover:scale-105 hover:rotate-6 transition-all duration-300">
            <span className="text-white text-3xl font-black tracking-widest font-mono">N</span>
          </div>
          <h2 className="text-white text-2xl font-bold tracking-wider font-mono text-center">NEXUS ENTERPRISE</h2>
          <p className="text-neutral-500 text-[10px] mt-2 font-mono tracking-widest uppercase">NEW PERSONNEL REGISTRATION</p>
        </div>

        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3.5 rounded-xl text-xs font-mono mb-6 animate-pulse flex items-start gap-2.5">
            <span className="font-bold">[ERR]</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Console Input Form */}
        <form ref={formRef} onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-2 ml-1 font-mono">FULL NAME</label>
            <div className="relative">
              <input 
                name="name" 
                type="text" 
                placeholder="Alex Mercer" 
                className="w-full px-4 py-3.5 rounded-xl bg-black/50 border border-white/10 focus:border-red-500 text-white placeholder-neutral-700 focus:outline-none transition-all duration-200 focus:ring-1 focus:ring-red-500/50 font-mono text-xs shadow-inner" 
                required 
                disabled={loading}
              />
              <span className="absolute right-3.5 top-3.5 text-neutral-600 text-xs font-mono pointer-events-none">[NAME]</span>
            </div>
          </div>

          <div>
            <label className="block text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-2 ml-1 font-mono">CORPORATE IDENTIFICATION (EMAIL)</label>
            <div className="relative">
              <input 
                name="email" 
                type="email" 
                placeholder="employee@nexus.corp" 
                className="w-full px-4 py-3.5 rounded-xl bg-black/50 border border-white/10 focus:border-red-500 text-white placeholder-neutral-700 focus:outline-none transition-all duration-200 focus:ring-1 focus:ring-red-500/50 font-mono text-xs shadow-inner" 
                required 
                disabled={loading}
              />
              <span className="absolute right-3.5 top-3.5 text-neutral-600 text-xs font-mono pointer-events-none">[UID]</span>
            </div>
          </div>
          
          <div>
            <label className="block text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-2 ml-1 font-mono">ACCESS KEY GENERATION (PASSWORD)</label>
            <div className="relative">
              <input 
                name="password" 
                type="password" 
                placeholder="••••••••••••" 
                className="w-full px-4 py-3.5 rounded-xl bg-black/50 border border-white/10 focus:border-red-500 text-white placeholder-neutral-700 focus:outline-none transition-all duration-200 focus:ring-1 focus:ring-red-500/50 font-mono text-xs shadow-inner" 
                required 
                disabled={loading}
              />
              <span className="absolute right-3.5 top-3.5 text-neutral-600 text-xs font-mono pointer-events-none">[KEY]</span>
            </div>
          </div>

          <div className="flex flex-col gap-4 pt-4">
            <button 
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-bold font-mono tracking-widest shadow-lg shadow-red-500/10 active:scale-[0.98] focus:outline-none transition-all duration-200 text-xs flex items-center justify-center gap-2 border border-red-500/30"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>GENERATING VAULT KEY...</span>
                </>
              ) : (
                <span>INITIATE VAULT REQUEST</span>
              )}
            </button>
          </div>
        </form>

        {/* Workstation Links & Terminal Identifiers */}
        <div className="mt-8 pt-5 border-t border-white/10 text-[9px] text-neutral-500 font-mono flex items-center justify-between">
          <Link href="/signin" className="text-red-500 hover:text-red-400 hover:underline tracking-wider transition-colors duration-150">[LOGIN TO EXISTENT VAULT]</Link>
          <span className="text-neutral-600">SYS.VER_2.5.0</span>
        </div>
      </div>
    </div>
  );
}
