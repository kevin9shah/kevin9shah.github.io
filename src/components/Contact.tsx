import { Mail, Github, Linkedin, ArrowRight, MapPin } from 'lucide-react'
import Reveal from './Reveal'
import { profile } from '../data/content'
import LeetCodeIcon from './LeetCodeIcon'

export default function Contact() {
  return (
    <section id="contact" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl border border-line bg-surface/30 p-10 sm:p-16 text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan/[0.06] via-transparent to-emerald/[0.06]" />

            <div className="relative">
              <p className="eyebrow justify-center flex mb-5">07 — Contact</p>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-text max-w-2xl mx-auto leading-tight">
                Let's build something intelligent.
              </h2>
              <p className="mt-5 text-muted text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
                Whether it's an AI system, data platform, backend service or research project — I'm always
                interested in solving interesting problems.
              </p>

              <a
                href={`mailto:${profile.links.email}`}
                className="group mt-9 inline-flex items-center gap-2 rounded-lg bg-cyan px-6 py-3 text-sm font-medium text-ink transition-all hover:-translate-y-0.5 hover:shadow-[0_0_20px_-8px_rgba(6,182,212,0.6)]"
              >
                <Mail size={16} />
                Email Kevin
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </a>

              <p className="mt-4 font-mono text-sm text-muted">{profile.links.email}</p>

              <p className="mt-8 flex items-center justify-center gap-1.5 text-sm text-muted">
                <MapPin size={14} />
                Based in India — {profile.location.primary} • {profile.location.secondary}
              </p>

              <div className="mt-8 flex items-center justify-center gap-6">
                {[
                  { icon: Github, href: profile.links.github, label: 'GitHub' },
                  { icon: Linkedin, href: profile.links.linkedin, label: 'LinkedIn' },
                  { icon: LeetCodeIcon, href: profile.links.leetcode, label: 'LeetCode' },
                  { icon: Mail, href: `mailto:${profile.links.email}`, label: 'Email' },
                ].map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith('mailto:') ? undefined : '_blank'}
                    rel="noreferrer"
                    aria-label={label}
                    className="text-muted hover:text-cyan transition-colors"
                  >
                    <Icon size={20} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
