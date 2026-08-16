import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Github, Linkedin, FileText, Menu, X } from 'lucide-react'
import { navLinks, profile } from '../data/content'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className="fixed top-3 sm:top-4 inset-x-0 z-50 px-3 sm:px-6">
      <nav
        className={`mx-auto max-w-5xl h-14 flex items-center justify-between rounded-2xl border border-line px-4 sm:px-5 glass transition-shadow duration-300 ${
          scrolled ? 'shadow-[0_8px_30px_-12px_rgba(0,0,0,0.6)]' : ''
        }`}
      >
        <a href="#home" className="flex items-center gap-2 font-display font-semibold text-[15px] text-text">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald opacity-75 animate-ping" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald" />
          </span>
          Kevin Shah
        </a>

        <ul className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="text-[13px] text-muted hover:text-text transition-colors">
                {link.label}
              </a>
            </li>
          ))}
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
            className="flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-[13px] text-text hover:border-cyan hover:text-cyan transition-colors"
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
            <ul className="flex flex-col px-5 py-4 gap-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block py-2.5 text-sm text-muted hover:text-cyan transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li className="flex items-center gap-5 pt-3 mt-2 border-t border-line">
                <a href={profile.links.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="text-muted hover:text-cyan">
                  <Github size={18} />
                </a>
                <a href={profile.links.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="text-muted hover:text-cyan">
                  <Linkedin size={18} />
                </a>
                <a href={profile.links.resume} target="_blank" rel="noreferrer" className="text-sm text-cyan">
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
