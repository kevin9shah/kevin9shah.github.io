import { Github, Linkedin, Mail } from 'lucide-react'
import { profile } from '../data/content'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative border-t border-line py-8">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted">
        <p>
          {profile.name} © {year}
        </p>
        <p className="font-mono text-xs tracking-widest text-muted/70 order-first sm:order-none">
          AI • DATA • BACKEND • CLOUD
        </p>
        <div className="flex items-center gap-5">
          <a href={profile.links.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="hover:text-cyan transition-colors">
            <Github size={16} />
          </a>
          <a href={profile.links.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="hover:text-cyan transition-colors">
            <Linkedin size={16} />
          </a>
          <a href={`mailto:${profile.links.email}`} aria-label="Email" className="hover:text-cyan transition-colors">
            <Mail size={16} />
          </a>
        </div>
      </div>
      <p className="mt-6 text-center font-mono text-[11px] text-muted/50">Built with curiosity &amp; code.</p>
    </footer>
  )
}
