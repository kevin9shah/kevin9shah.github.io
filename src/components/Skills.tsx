import SectionHeading from './SectionHeading'
import Reveal from './Reveal'
import PSGlyph from './PSGlyph'
import { skillCategories } from '../data/content'

export default function Skills() {
  return (
    <section id="skills" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          number="02"
          label="Expertise"
          title="Technical Stack"
          subtitle="Tools and technologies I use to build intelligent, production-ready systems."
        />

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:[grid-auto-flow:dense] gap-4">
          {skillCategories.map((cat, i) => (
            <Reveal key={cat.id} delay={i * 0.06} className={cat.featured ? 'sm:col-span-2' : ''}>
              <div className="rainbow-card group relative h-full overflow-hidden rounded-xl border border-line bg-surface/40 p-6 sm:p-7 transition-transform hover:-translate-y-0.5">
                <span
                  className="absolute inset-x-0 top-0 h-px scale-x-0 origin-left bg-gradient-to-r from-cyan to-emerald transition-transform duration-300 group-hover:scale-x-100"
                  aria-hidden
                />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <PSGlyph index={i} size={9} />
                    <span className="font-mono text-[11px] tracking-[0.15em] text-muted uppercase">// {cat.tag}</span>
                  </div>
                  <span className="font-mono text-[11px] text-muted/60 tabular-nums">
                    {String(cat.skills.length).padStart(2, '0')}
                  </span>
                </div>

                <h3 className="mt-3 font-display font-semibold text-text">{cat.label}</h3>

                <div className="mt-5 flex flex-wrap gap-2">
                  {cat.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-md border border-line bg-ink/50 px-2.5 py-1.5 font-mono text-[12px] text-muted transition-colors hover:border-cyan/50 hover:text-text"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
