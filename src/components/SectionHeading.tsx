import Reveal from './Reveal'
import PSGlyph from './PSGlyph'

interface SectionHeadingProps {
  number?: string
  label?: string
  title: string
  subtitle?: string
  align?: 'left' | 'center'
}

export default function SectionHeading({ number, label, title, subtitle, align = 'left' }: SectionHeadingProps) {
  return (
    <Reveal className={align === 'center' ? 'text-center mx-auto max-w-2xl' : 'max-w-2xl'}>
      {label && (
        <p className={`eyebrow mb-4 flex items-center gap-2.5 ${align === 'center' ? 'justify-center' : ''}`}>
          {number && <span className="text-muted">{number}</span>}
          {number && <PSGlyph index={parseInt(number, 10) - 1} size={10} />}
          {label}
        </p>
      )}
      <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight text-text">
        {title}
      </h2>
      {subtitle && <p className="mt-4 text-muted text-base sm:text-lg leading-relaxed">{subtitle}</p>}
    </Reveal>
  )
}
