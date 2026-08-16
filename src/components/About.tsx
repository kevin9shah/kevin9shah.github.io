import SectionHeading from './SectionHeading'
import Reveal from './Reveal'
import { snapshot } from '../data/content'

export default function About() {
  return (
    <section id="about" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          number="01"
          label="About"
          title="Building at the intersection of AI, data and software engineering."
        />

        <div className="mt-14 grid lg:grid-cols-2 gap-14 items-start">
          <Reveal delay={0.1}>
            <div className="space-y-5 text-muted leading-relaxed text-base sm:text-lg">
              <p>
                I'm Kevin Shah, an Information Technology student at VIT Vellore focused on AI/ML, backend
                engineering, data engineering and cloud technologies.
              </p>
              <p>
                My work spans research, production-oriented software and intelligent data systems — from
                explainable machine learning and RAG applications to automated ETL pipelines and backend
                APIs.
              </p>
              <p>
                I enjoy taking technically complex problems and turning them into reliable, scalable and
                understandable systems.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="relative rounded-xl border border-line bg-surface/30 p-8">
              <ol className="relative border-l border-line pl-7 space-y-8">
                {snapshot.map((item, i) => (
                  <li key={item.org} className="relative">
                    <span
                      className="absolute -left-[32px] top-1 h-2 w-2 rounded-full border-2 border-ink"
                      style={{ background: i % 2 === 0 ? '#06b6d4' : '#10b981' }}
                    />
                    <p className="font-display font-semibold text-text">{item.org}</p>
                    <p className="text-sm text-muted mt-0.5">{item.role}</p>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
