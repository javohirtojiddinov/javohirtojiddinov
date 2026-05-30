'use client'

export default function OrbAnimation() {
  return (
    <div className="relative w-[600px] h-[600px] flex items-center justify-center">
      {/* Outer ring */}
      <div className="absolute w-[600px] h-[600px] rounded-full border border-jeya-accent/10 animate-pulse-slow" />
      <div className="absolute w-[480px] h-[480px] rounded-full border border-jeya-accent/15 animate-pulse-slow" style={{ animationDelay: '0.5s' }} />
      <div className="absolute w-[360px] h-[360px] rounded-full border border-jeya-accent/20 animate-pulse-slow" style={{ animationDelay: '1s' }} />

      {/* Core orb */}
      <div className="relative w-[200px] h-[200px] animate-float">
        {/* Glow layers */}
        <div className="absolute inset-0 rounded-full bg-jeya-accent/30 blur-3xl animate-pulse-slow" />
        <div className="absolute inset-4 rounded-full bg-jeya-accent/20 blur-2xl" />
        <div
          className="absolute inset-0 rounded-full animate-glow"
          style={{
            background: 'radial-gradient(ellipse at 30% 30%, #818cf8 0%, #6366f1 40%, #4338ca 70%, #1e1b4b 100%)',
          }}
        />
        {/* Shine */}
        <div
          className="absolute top-6 left-8 w-12 h-6 rounded-full bg-white/20 blur-sm"
          style={{ transform: 'rotate(-30deg)' }}
        />
        {/* Inner glow */}
        <div className="absolute inset-8 rounded-full bg-white/5 blur-md" />
      </div>

      {/* Orbiting dots */}
      {[0, 60, 120, 180, 240, 300].map((deg, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-jeya-accent"
          style={{
            top: '50%',
            left: '50%',
            transform: `rotate(${deg}deg) translateX(220px) translateY(-50%)`,
            opacity: 0.4 + (i % 3) * 0.2,
            boxShadow: '0 0 8px #6366f1',
          }}
        />
      ))}
    </div>
  )
}
