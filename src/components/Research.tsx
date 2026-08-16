import { FileText, ShieldCheck, ExternalLink } from 'lucide-react'
import SectionHeading from './SectionHeading'
import Reveal from './Reveal'
import { research, patents } from '../data/content'

export default function Research() {
  return (
    <section id="research" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          number="04"
          label="Research"
          title="Research & Innovation"
          subtitle="Applying machine learning and data-driven systems to real-world problems."
        />

        <div className="mt-14 grid lg:grid-cols-3 gap-5">
          <Reveal delay={0.05}>
            <div className="rainbow-card h-full rounded-xl border border-cyan/30 bg-surface/40 p-7 sm:p-8 flex flex-col">
              <div className="flex items-center gap-2 text-cyan">
                <FileText size={16} />
                <span className="font-mono text-[11px] uppercase tracking-wide">{research.badge}</span>
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-text leading-snug">{research.title}</h3>
              <div className="mt-6 font-display text-4xl font-bold text-gradient">{research.metric}</div>
              <ul className="mt-6 flex flex-wrap gap-2">
                {research.points.map((p) => (
                  <li key={p} className="rounded-md border border-line px-2.5 py-1 font-mono text-[11px] text-muted">
                    {p}
                  </li>
                ))}
              </ul>
              <a
                href={research.url}
                target="_blank"
                rel="noreferrer"
                className="mt-auto pt-6 inline-flex items-center gap-2 text-sm text-cyan hover:text-cyan/80 transition-colors"
              >
                Read Research
                <ExternalLink size={13} />
              </a>
            </div>
          </Reveal>

          {patents.map((patent, i) => (
            <Reveal key={patent.id} delay={0.1 + i * 0.05}>
              <div className="rainbow-card h-full rounded-xl border border-line bg-surface/40 p-7 sm:p-8 flex flex-col">
                <div className="flex items-center gap-2 text-emerald">
                  <ShieldCheck size={16} />
                  <span className="font-mono text-[11px] uppercase tracking-wide">App No. {patent.applicationNo}</span>
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold text-text leading-snug">{patent.title}</h3>
                <p className="mt-4 text-sm text-muted leading-relaxed">{patent.description}</p>
                {(patent.highlights.length > 0 || patent.themes) && (
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {(patent.highlights.length > 0 ? patent.highlights : patent.themes ?? []).map((p) => (
                      <li key={p} className="rounded-md border border-line px-2.5 py-1 font-mono text-[11px] text-muted">
                        {p}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
