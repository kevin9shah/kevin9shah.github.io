import { useState } from 'react'
import SectionHeading from './SectionHeading'
import ProjectCard from './ProjectCard'
import { projects, type ProjectCategory } from '../data/content'

const filters: ('All' | ProjectCategory)[] = ['All', 'AI / ML', 'Data Engineering', 'Analytics']

export default function Projects() {
  const [filter, setFilter] = useState<'All' | ProjectCategory>('All')
  const visible = filter === 'All' ? projects : projects.filter((p) => p.category === filter)

  return (
    <section id="projects" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          number="04"
          label="Projects"
          title="Selected Work"
          subtitle="Engineering projects focused on AI, data and scalable backend systems."
        />

        <div className="mt-10 flex flex-wrap gap-1 font-mono text-xs">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-md px-3 py-1.5 uppercase tracking-wide transition-colors ${
                filter === f ? 'bg-surface text-cyan border border-cyan/30' : 'text-muted hover:text-text border border-transparent'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="mt-12 grid gap-6">
          {visible.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
