import { MapPin } from 'lucide-react'
import SectionHeading from './SectionHeading'
import Reveal from './Reveal'
import PSGlyph from './PSGlyph'
import { experience } from '../data/content'

export default function Experience() {
  return (
    <section id="experience" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading number="03" label="Experience" title="Experience" />

        <div className="mt-14 relative border-l border-line pl-8 sm:pl-12 space-y-10">
          {experience.map((item, i) => (
            <Reveal key={item.org} delay={i * 0.1}>
              <div className="relative">
                {/* Dot is 10px (h-2.5 w-2.5) — centering it on the border-l line means
                    its left edge sits at half that width past the line, not at the
                    padding offset itself (which was the bug: dot visibly off-line). */}
                <span className="absolute -left-[37px] sm:-left-[53px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-ink bg-cyan" />
                <div
                  className={`rainbow-card relative overflow-hidden rounded-xl border p-7 sm:p-8 ${
                    item.featured ? 'border-cyan/30 bg-surface/50' : 'border-line bg-surface/30'
                  }`}
                >
                  <span className="font-mono text-xs text-cyan tracking-wide">{item.date}</span>
                  <h3 className="mt-2 font-display text-xl sm:text-2xl font-semibold text-text">{item.org}</h3>
                  <p className="mt-1 text-emerald text-sm font-medium">{item.role}</p>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-muted">
                    <MapPin size={12} />
                    {item.location}
                  </p>
                  <ul className="mt-5 grid sm:grid-cols-2 gap-x-6 gap-y-2">
                    {item.highlights.map((h, hi) => (
                      <li key={h} className="flex items-center gap-2 text-sm text-muted">
                        <PSGlyph index={hi} size={8} />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
