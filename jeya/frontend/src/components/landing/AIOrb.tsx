'use client'
import { useEffect, useRef } from 'react'

export default function AIOrb() {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 480, height: 480 }}>
      {/* Outer scan rings */}
      {[480, 400, 320].map((size, i) => (
        <div key={size} className="absolute rounded-full border"
          style={{
            width: size, height: size,
            borderColor: `rgba(0,245,255,${0.06 + i * 0.04})`,
            animation: `${i % 2 === 0 ? 'orb-rotate' : 'orb-rotate-rev'} ${12 + i * 4}s linear infinite`,
            boxShadow: `0 0 ${20 + i * 10}px rgba(0,245,255,0.05)`,
          }}
        />
      ))}

      {/* Dashed orbit */}
      <div className="absolute rounded-full border border-dashed"
        style={{
          width: 300, height: 300,
          borderColor: 'rgba(0,255,135,0.15)',
          animation: 'orb-rotate-rev 20s linear infinite',
        }}
      />

      {/* Orbiting node — cyan */}
      <div className="absolute" style={{ width: 300, height: 300, animation: 'orb-rotate 10s linear infinite' }}>
        <div className="absolute w-3 h-3 rounded-full bg-jeya-cyan top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ boxShadow: '0 0 12px #00f5ff, 0 0 24px #00f5ff88' }} />
      </div>

      {/* Orbiting node — emerald */}
      <div className="absolute" style={{ width: 260, height: 260, animation: 'orb-rotate-rev 14s linear infinite' }}>
        <div className="absolute w-2.5 h-2.5 rounded-full bg-jeya-emerald bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2"
          style={{ boxShadow: '0 0 12px #00ff87, 0 0 24px #00ff8788' }} />
      </div>

      {/* Core */}
      <div className="relative flex items-center justify-center" style={{ width: 180, height: 180 }}>
        {/* Core glow */}
        <div className="absolute inset-0 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(0,245,255,0.15) 0%, rgba(0,255,135,0.05) 50%, transparent 70%)' }} />
        {/* Core sphere */}
        <div className="absolute inset-4 rounded-full animate-pulse-cyan"
          style={{
            background: 'radial-gradient(ellipse at 35% 25%, #00f5ff44 0%, #00c4cc22 30%, #003344 60%, #020408 100%)',
            border: '1px solid rgba(0,245,255,0.4)',
          }}
        />
        {/* Inner hexagon glow */}
        <div className="absolute inset-8 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(0,245,255,0.2) 0%, transparent 70%)' }} />
        {/* JEYA text */}
        <div className="relative z-10 text-center">
          <div className="text-2xl font-black tracking-[0.3em] neon-text-cyan">JEYA</div>
          <div className="text-xs tracking-[0.2em] text-jeya-emerald/80 mt-0.5">AI CORE</div>
        </div>
      </div>

      {/* Corner brackets */}
      {[['top-0 left-0', 'border-t border-l'],['top-0 right-0', 'border-t border-r'],
        ['bottom-0 left-0', 'border-b border-l'],['bottom-0 right-0', 'border-b border-r']].map(([pos, border]) => (
        <div key={pos} className={`absolute ${pos} w-6 h-6 ${border} border-jeya-cyan/40`} />
      ))}
    </div>
  )
}
