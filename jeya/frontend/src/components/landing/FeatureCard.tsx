import { LucideIcon } from 'lucide-react'

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  gradient: string
}

export default function FeatureCard({ icon: Icon, title, description, gradient }: FeatureCardProps) {
  return (
    <div className="glass rounded-2xl p-6 group hover:border-jeya-accent/50 hover:shadow-[0_0_30px_rgba(99,102,241,0.1)] transition-all duration-300">
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
        <Icon size={22} className="text-white" />
      </div>
      <h3 className="text-lg font-bold text-jeya-text mb-2">{title}</h3>
      <p className="text-jeya-muted text-sm leading-relaxed">{description}</p>
    </div>
  )
}
