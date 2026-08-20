import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Github, Linkedin, FileText, Menu, X } from 'lucide-react'
import { navLinks, profile } from '../data/content'
import PSGlyph from './PSGlyph'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [activeHref, setActiveHref] = useState('#home')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Scroll-spy — highlights the current section in the menu like a game's
  // level-select cursor, instead of a static list with no sense of "where am I"
  useEffect(() => {
    const sections = navLinks
      .map((link) => document.querySelector(link.href))
      .filter((el): el is Element => el !== null)
    if (sections.length === 0) return

    // IntersectionObserver callbacks only report entries that changed *in that
    // batch* — picking the best one from just those entries meant a link stayed
    // "active" until its own section happened to cross a threshold again, even
    // after scrolling well past it into the next section. Tracking every
    // section's latest known ratio and re-deriving the best one each time fixes
    // that lag.
    const ratios = new Map<Element, number>()

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.set(entry.target, entry.isIntersecting ? entry.intersectionRatio : 0)
        }
        let best: Element | null = null
        let bestRatio = 0
        for (const section of sections) {
          const ratio = ratios.get(section) ?? 0
          if (ratio > bestRatio) {
            bestRatio = ratio
            best = section
          }
        }
        if (best) setActiveHref(`#${best.id}`)
      },
      { rootMargin: '-35% 0px -55% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] },
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  return (
    <header className="fixed top-3 sm:top-4 inset-x-0 z-50 px-3 sm:px-6">
      <nav
        className={`mx-auto max-w-5xl h-14 flex items-center justify-between rounded-2xl border border-line px-4 sm:px-5 glass transition-shadow duration-300 ${
          scrolled ? 'shadow-[0_8px_30px_-12px_rgba(0,0,0,0.6)] glow-cyan' : ''
        }`}
      >
        <a href="#home" className="flex items-center gap-2 font-display font-semibold text-[15px] text-text">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald opacity-75 animate-ping" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald" />
          </span>
          Kevin Shah
        </a>

        <ul className="hidden md:flex items-center gap-1 font-mono text-[11px] uppercase tracking-wide">
          {navLinks.map((link, i) => {
            const isActive = activeHref === link.href
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={`group flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 transition-colors ${
                    isActive
                      ? 'text-text bg-cyan/10 border-cyan/30'
                      : 'text-muted border-transparent hover:text-text hover:border-line'
                  }`}
                >
                  <PSGlyph
                    index={i}
                    size={7}
                    className={`transition-opacity ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-60'}`}
                  />
                  {link.label}
                </a>
              </li>
            )
          })}
        </ul>

        <div className="hidden md:flex items-center gap-3">
          <a href={profile.links.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="text-muted hover:text-cyan transition-colors">
            <Github size={16} />
          </a>
          <a href={profile.links.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="text-muted hover:text-cyan transition-colors">
            <Linkedin size={16} />
          </a>
          <a
            href={profile.links.resume}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 font-mono text-[12px] uppercase tracking-wide text-text hover:border-cyan hover:text-cyan transition-colors"
          >
            <FileText size={13} />
            Resume
          </a>
        </div>

        <button
          className="md:hidden text-text"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden mx-auto max-w-5xl mt-2 rounded-2xl border border-line glass"
          >
            <ul className="flex flex-col px-5 py-4 gap-1 font-mono text-sm uppercase tracking-wide">
              {navLinks.map((link, i) => {
                const isActive = activeHref === link.href
                return (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-2 rounded-lg px-2 py-2.5 transition-colors ${
                        isActive ? 'text-text bg-cyan/10' : 'text-muted hover:text-cyan'
                      }`}
                    >
                      <PSGlyph index={i} size={8} className={isActive ? 'opacity-100' : 'opacity-50'} />
                      {link.label}
                    </a>
                  </li>
                )
              })}
              <li className="flex items-center gap-5 pt-3 mt-2 border-t border-line">
                <a href={profile.links.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="text-muted hover:text-cyan">
                  <Github size={18} />
                </a>
                <a href={profile.links.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="text-muted hover:text-cyan">
                  <Linkedin size={18} />
                </a>
                <a href={profile.links.resume} target="_blank" rel="noreferrer" className="text-sm text-cyan normal-case">
                  Resume
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
