import { motion } from 'framer-motion'
import { ArrowRight, Github, Linkedin, Mail, Code2 } from 'lucide-react'
import { profile } from '../data/content'
import kevinPhoto from '../assets/kevin-photo.jpg'

export default function Hero() {
  return (
    <section id="home" className="relative pt-32 pb-24 sm:pt-40 sm:pb-32 overflow-hidden">
      <div className="absolute inset-0 grid-bg [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,black,transparent)]" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[28rem] w-[28rem] rounded-full bg-cyan/[0.06] blur-[130px]" />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8 grid lg:grid-cols-[1.1fr_0.9fr] gap-16 items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 mb-6"
          >
            <span className="h-px w-8 bg-cyan" />
            <p className="eyebrow">{profile.eyebrow}</p>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="font-display text-5xl sm:text-6xl font-bold tracking-tight text-text"
          >
            {profile.name}
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-2xl sm:text-3xl font-medium mt-3 text-gradient"
          >
            {profile.tagline}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-6 text-sm sm:text-base text-muted max-w-xl leading-relaxed"
          >
            {profile.summary}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-base sm:text-lg text-text/90 max-w-xl leading-relaxed"
          >
            {profile.statement}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <a
              href="#projects"
              className="group inline-flex items-center gap-2 rounded-lg bg-cyan px-5 py-2.5 text-sm font-medium text-ink transition-all hover:-translate-y-0.5 hover:shadow-[0_0_20px_-8px_rgba(6,182,212,0.6)]"
            >
              View My Work
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-lg border border-line px-5 py-2.5 text-sm font-medium text-text hover:border-emerald hover:text-emerald transition-colors"
            >
              Let's Connect
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-8 flex items-center gap-5"
          >
            {[
              { icon: Github, href: profile.links.github, label: 'GitHub' },
              { icon: Linkedin, href: profile.links.linkedin, label: 'LinkedIn' },
              { icon: Code2, href: profile.links.leetcode, label: 'LeetCode' },
              { icon: Mail, href: `mailto:${profile.links.email}`, label: 'Email' },
            ].map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('mailto:') ? undefined : '_blank'}
                rel="noreferrer"
                aria-label={label}
                className="text-muted hover:text-emerald transition-colors"
              >
                <Icon size={18} />
              </a>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-sm mx-auto"
        >
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-line bg-surface">
            <img src={kevinPhoto} alt="Kevin Shah" className="h-full w-full object-cover object-top" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/5 to-transparent" />

            {/* technical corner marks */}
            <span className="absolute top-3 left-3 h-3 w-3 border-t border-l border-cyan/50" />
            <span className="absolute top-3 right-3 h-3 w-3 border-t border-r border-cyan/50" />
            <span className="absolute bottom-3 right-3 h-3 w-3 border-b border-r border-cyan/50" />

            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <span className="font-mono text-[10px] tracking-wider text-muted/80 uppercase">Kevin_Shah.jpg</span>
              <span className="flex items-center gap-1.5 font-mono text-[10px] text-text/90">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-emerald opacity-75 animate-ping" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald" />
                </span>
                OPEN TO WORK
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
