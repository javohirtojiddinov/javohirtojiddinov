'use client'

// Markaziy yorug' AI globusi — aylanuvchi halqalar, tarmoq shari va yadro.
export default function JeyaGlobe() {
  return (
    <div className="relative w-[440px] h-[440px] flex items-center justify-center select-none">
      {/* tashqi nur halosi */}
      <div className="absolute w-[440px] h-[440px] rounded-full bg-[radial-gradient(circle,rgba(0,229,255,0.18),transparent_60%)] blur-2xl" />

      {/* aylanuvchi halqalar */}
      <div className="orbit-ring w-[420px] h-[420px] animate-spin-slow" style={{ borderColor: 'rgba(0,229,255,0.18)' }} />
      <div className="orbit-ring w-[360px] h-[360px] animate-spin-rev" style={{ borderColor: 'rgba(0,255,157,0.18)', borderStyle: 'dashed' }} />
      <div className="orbit-ring w-[300px] h-[300px] animate-spin-med" style={{ borderColor: 'rgba(0,229,255,0.25)' }} />

      {/* tarmoq shari */}
      <div className="absolute w-[300px] h-[300px] rounded-full animate-spin-slow"
        style={{
          background: 'radial-gradient(circle at 38% 32%, rgba(0,229,255,0.35), rgba(8,30,50,0.85) 60%, rgba(4,7,13,0.95))',
          boxShadow: '0 0 80px rgba(0,229,255,0.35), inset 0 0 60px rgba(0,229,255,0.25)',
        }}
      >
        {/* meridian chiziqlari */}
        {[...Array(6)].map((_, i) => (
          <div key={i} className="absolute inset-0 rounded-full border border-jeya-cyan/15"
            style={{ transform: `rotateY(${i * 30}deg) scaleX(${Math.cos((i * 30 * Math.PI) / 180)})` }} />
        ))}
        {[...Array(4)].map((_, i) => (
          <div key={`h${i}`} className="absolute left-0 right-0 mx-auto rounded-[50%] border border-jeya-cyan/15"
            style={{ top: `${15 + i * 20}%`, height: `${70 - i * 10}%`, width: '100%' }} />
        ))}
      </div>

      {/* orbitadagi sayyoralar */}
      <div className="absolute w-[360px] h-[360px] animate-spin-med">
        <div className="absolute -top-1 left-1/2 w-3 h-3 rounded-full bg-jeya-emerald shadow-[0_0_14px_#00ff9d]" />
      </div>
      <div className="absolute w-[420px] h-[420px] animate-spin-rev">
        <div className="absolute top-1/2 -right-1 w-2.5 h-2.5 rounded-full bg-jeya-cyan shadow-[0_0_14px_#00e5ff]" />
      </div>

      {/* markaziy yadro */}
      <div className="absolute flex items-center justify-center">
        <div className="absolute w-28 h-28 rounded-full border border-jeya-cyan/40 animate-pulse-slow" />
        <div className="absolute w-20 h-20 rounded-full border-2 border-jeya-cyan/60" />
        <div className="w-10 h-10 rounded-full bg-jeya-cyan animate-pulse"
          style={{ boxShadow: '0 0 30px #00e5ff, 0 0 60px #00e5ff88' }} />
      </div>
    </div>
  )
}
