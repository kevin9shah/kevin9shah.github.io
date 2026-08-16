import { Github, ExternalLink, ArrowRight } from 'lucide-react'
import type { Project } from '../data/content'
import Reveal from './Reveal'

function ArchitectureFlow({ steps }: { steps: string[] }) {
  return (
    <div className="flex flex-col">
      {steps.map((step, i) => (
        <div key={step} className="flex flex-col items-start">
          <span className="w-full rounded-md border border-line bg-ink/60 px-3.5 py-2 font-mono text-[12px] text-text">
            {step}
          </span>
          {i < steps.length - 1 && <span className="ml-4 my-1 h-4 w-px bg-line" aria-hidden />}
        </div>
      ))}
    </div>
  )
}

function MetricPanel({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center rounded-lg border border-line bg-ink/40 px-8 py-10 text-center">
      <span className="font-display text-5xl font-bold text-gradient tabular-nums">{value}</span>
      <span className="mt-2 font-mono text-xs tracking-wide text-muted uppercase">{label}</span>
    </div>
  )
}

export default function ProjectCard({ project, index }: { project: Project; index: number }) {
  const reversed = index % 2 === 1

  return (
    <Reveal delay={(index % 2) * 0.06}>
      <div className="rainbow-card rounded-2xl border border-line bg-surface/40 p-7 sm:p-9">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-14 items-start">
          <div className={reversed ? 'lg:order-2' : ''}>
            <div className="flex items-center gap-3 flex-wrap font-mono text-xs">
              <span className="text-cyan">{project.number}</span>
              <span className="text-line">/</span>
              <span className="text-muted uppercase tracking-wide">{project.category}</span>
              {project.badge && (
                <>
                  <span className="text-line">/</span>
                  <span className="text-emerald uppercase tracking-wide">{project.badge}</span>
                </>
              )}
            </div>

            <h3 className="mt-4 font-display text-2xl sm:text-[28px] font-semibold text-text leading-snug">
              {project.title}
            </h3>

            <p className="mt-4 text-muted leading-relaxed">{project.description}</p>

            <div className="mt-6 flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <span key={t} className="rounded-md border border-line px-2.5 py-1 font-mono text-[11px] text-muted">
                  {t}
                </span>
              ))}
            </div>

            {project.highlights.length > 0 && (
              <ul className="mt-6 grid sm:grid-cols-2 gap-x-6 gap-y-2">
                {project.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2 text-sm text-muted">
                    <span className="mt-2 h-1 w-1 rounded-full bg-cyan shrink-0" />
                    {h}
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-7 flex items-center gap-5">
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noreferrer"
                  className="group/btn inline-flex items-center gap-2 rounded-lg border border-line px-4 py-2 text-sm text-text hover:border-cyan hover:text-cyan transition-colors"
                >
                  <Github size={15} />
                  View Code
                  <ArrowRight size={13} className="transition-transform group-hover/btn:translate-x-1" />
                </a>
              )}
              {project.demo && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-emerald hover:text-emerald/80 transition-colors"
                >
                  {project.demoLabel ?? 'View Demo'}
                  <ExternalLink size={13} />
                </a>
              )}
            </div>
          </div>

          <div className={reversed ? 'lg:order-1' : ''}>
            {project.architecture.length > 0 ? (
              <ArchitectureFlow steps={project.architecture} />
            ) : project.metric ? (
              <MetricPanel value={project.metric.value} label={project.metric.label} />
            ) : null}
          </div>
        </div>
      </div>
    </Reveal>
  )
}
