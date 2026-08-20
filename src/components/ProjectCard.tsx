import { Github, ExternalLink, ArrowRight, ShieldCheck, Database, Cpu, Zap, Activity, CheckCircle2 } from 'lucide-react'
import type { Project } from '../data/content'
import Reveal from './Reveal'
import PSGlyph from './PSGlyph'

// --- VISUAL COMPONENT 1: EAGLE RAG VECTOR TOPOLOGY ---
function EagleVisualizer() {
  return (
    <div className="rainbow-card h-full rounded-xl border border-cyan/30 bg-ink/70 p-6 flex flex-col justify-between font-mono text-xs">
      <div className="flex items-center justify-between border-b border-line/60 pb-3">
        <span className="flex items-center gap-2 text-cyan font-semibold">
          <Database size={14} />
          Local RAG Topology
        </span>
        <span className="flex items-center gap-1 text-[11px] text-emerald bg-emerald/10 border border-emerald/30 px-2 py-0.5 rounded-full">
          <ShieldCheck size={12} />
          100% Offline Privacy
        </span>
      </div>

      {/* Visual Pipeline Nodes */}
      <div className="my-6 space-y-3.5">
        <div className="rounded-lg border border-line bg-surface/80 p-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-2 w-2 rounded-full bg-cyan animate-pulse" />
            <div>
              <div className="text-text font-medium text-[12px]">Document Ingestion</div>
              <div className="text-[10px] text-muted">PDF / Markdown / Chunking</div>
            </div>
          </div>
          <span className="text-[10px] text-cyan bg-cyan/10 px-2.5 py-1 rounded border border-cyan/20">
            384d Vectors
          </span>
        </div>

        <div className="flex justify-center">
          <div className="h-4 w-px bg-gradient-to-b from-cyan to-emerald" />
        </div>

        <div className="rounded-lg border border-cyan/40 bg-surface/90 p-3 flex items-center justify-between glow-cyan">
          <div className="flex items-center gap-2.5">
            <Cpu size={15} className="text-cyan" />
            <div>
              <div className="text-text font-medium text-[12px]">ChromaDB Vector Store</div>
              <div className="text-[10px] text-muted font-mono">Cosine Distance Match</div>
            </div>
          </div>
          <span className="text-[10px] text-emerald font-semibold">Score: 0.94</span>
        </div>

        <div className="flex justify-center">
          <div className="h-4 w-px bg-gradient-to-b from-emerald to-cyan" />
        </div>

        <div className="rounded-lg border border-emerald/40 bg-surface/80 p-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Zap size={15} className="text-emerald" />
            <div>
              <div className="text-text font-medium text-[12px]">Ollama LLM Inference</div>
              <div className="text-[10px] text-muted">Local Context Generation</div>
            </div>
          </div>
          <span className="text-[10px] text-emerald bg-emerald/10 px-2.5 py-1 rounded">
            ⚡ 42ms
          </span>
        </div>
      </div>

      {/* Footer Metrics */}
      <div className="border-t border-line/60 pt-3 flex items-center justify-between text-[11px] text-muted">
        <span>Zero External APIs</span>
        <span className="text-cyan">Latency: 48 tokens/sec</span>
      </div>
    </div>
  )
}

// --- VISUAL COMPONENT 2: MEDALLION DATA STREAM MONITOR ---
function MedallionVisualizer() {
  return (
    <div className="rainbow-card h-full rounded-xl border border-line bg-ink/70 p-6 flex flex-col justify-between font-mono text-xs">
      <div className="flex items-center justify-between border-b border-line/60 pb-3">
        <span className="flex items-center gap-2 text-emerald font-semibold">
          <Activity size={14} />
          Medallion Tier Stream
        </span>
        <span className="flex items-center gap-1 text-[11px] text-cyan bg-cyan/10 border border-cyan/30 px-2 py-0.5 rounded-full">
          <CheckCircle2 size={12} />
          100% Idempotent
        </span>
      </div>

      {/* Visual Tiers */}
      <div className="my-6 space-y-3.5">
        <div className="rounded-lg border border-amber-500/30 bg-surface/60 p-3.5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold text-amber-400">BRONZE TIER</span>
            <span className="text-[10px] text-muted">Raw API & CSV Ingestion</span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-muted bg-ink/60 p-2 rounded">
            <span>Quarantine Isolation: 0 Failures</span>
            <span className="text-emerald font-medium">Valid Records</span>
          </div>
        </div>

        <div className="rounded-lg border border-cyan/40 bg-surface/80 p-3.5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold text-cyan">SILVER TIER</span>
            <span className="text-[10px] text-muted">Pandera & Parquet Storage</span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-muted bg-ink/60 p-2 rounded">
            <span>Compression: 4.2x Parquet</span>
            <span className="text-cyan font-medium">Schema Validated</span>
          </div>
        </div>

        <div className="rounded-lg border border-emerald/50 bg-surface/90 p-3.5 glow-emerald">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold text-emerald">GOLD TIER</span>
            <span className="text-[10px] text-muted">PostgreSQL Data Warehouse</span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-muted bg-ink/60 p-2 rounded">
            <span>Transactional Upserts</span>
            <span className="text-emerald font-bold">Analytics Ready</span>
          </div>
        </div>
      </div>

      {/* Footer Metrics */}
      <div className="border-t border-line/60 pt-3 flex items-center justify-between text-[11px] text-muted">
        <span>Apache Airflow Orchestration</span>
        <span className="text-emerald">CI/CD Automated</span>
      </div>
    </div>
  )
}

// --- VISUAL COMPONENT 3: SHAP EXPLAINABLE AI SPECTRUM ---
function ShapVisualizer() {
  return (
    <div className="rainbow-card h-full rounded-xl border border-cyan/30 bg-ink/70 p-6 flex flex-col justify-between font-mono text-xs">
      <div className="flex items-center justify-between border-b border-line/60 pb-3">
        <span className="flex items-center gap-2 text-cyan font-semibold">
          <Cpu size={14} />
          SHAP Feature Spectrum
        </span>
        <span className="text-[11px] text-emerald bg-emerald/10 border border-emerald/30 px-2.5 py-0.5 rounded-full font-bold">
          R² = 0.9974
        </span>
      </div>

      {/* Visual SHAP Bars */}
      <div className="my-5 space-y-3">
        <div>
          <div className="flex justify-between text-[11px] mb-1">
            <span className="text-text">Soil Nitrogen (N)</span>
            <span className="text-cyan font-bold">+1.85 t/ha</span>
          </div>
          <div className="h-2 w-full rounded-full bg-surface overflow-hidden">
            <div className="h-full w-[85%] rounded-full bg-cyan" />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[11px] mb-1">
            <span className="text-text">Rainfall (mm)</span>
            <span className="text-cyan font-bold">+1.45 t/ha</span>
          </div>
          <div className="h-2 w-full rounded-full bg-surface overflow-hidden">
            <div className="h-full w-[68%] rounded-full bg-cyan/80" />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[11px] mb-1">
            <span className="text-text">Solar Radiation (MJ/m²)</span>
            <span className="text-cyan font-bold">+0.75 t/ha</span>
          </div>
          <div className="h-2 w-full rounded-full bg-surface overflow-hidden">
            <div className="h-full w-[42%] rounded-full bg-cyan/60" />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[11px] mb-1">
            <span className="text-text">Temperature Regime (°C)</span>
            <span className="text-rose-400 font-bold">-0.40 t/ha</span>
          </div>
          <div className="h-2 w-full rounded-full bg-surface overflow-hidden">
            <div className="h-full w-[25%] rounded-full bg-rose-400" />
          </div>
        </div>
      </div>

      {/* Metric Badge */}
      <div className="my-2 rounded-lg border border-line bg-surface/70 p-3 text-center">
        <span className="text-[10px] text-muted uppercase block">Base Yield E[f(x)]</span>
        <span className="text-xs font-bold text-gradient">5.20 t/ha → Predicted Yield: 8.85 t/ha</span>
      </div>

      {/* Footer */}
      <div className="border-t border-line/60 pt-3 flex items-center justify-between text-[11px] text-muted">
        <span>IEEE Xplore Paper</span>
        <span className="text-cyan">ICAUC 2026</span>
      </div>
    </div>
  )
}

export default function ProjectCard({ project, index }: { project: Project; index: number }) {
  const reversed = index % 2 === 1

  return (
    <Reveal delay={(index % 2) * 0.06}>
      <div className="rainbow-card rounded-2xl border border-line bg-surface/40 p-7 sm:p-9">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-14 items-stretch">
          <div className={reversed ? 'lg:order-2 flex flex-col justify-between' : 'flex flex-col justify-between'}>
            <div>
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
                  {project.highlights.map((h, hi) => (
                    <li key={h} className="flex items-center gap-2 text-sm text-muted">
                      <PSGlyph index={hi} size={8} />
                      {h}
                    </li>
                  ))}
                </ul>
              )}
            </div>

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
            {project.id === 'eagle' ? (
              <EagleVisualizer />
            ) : project.id === 'medallion-etl' ? (
              <MedallionVisualizer />
            ) : project.id === 'crop-yield' ? (
              <ShapVisualizer />
            ) : null}
          </div>
        </div>
      </div>
    </Reveal>
  )
}
