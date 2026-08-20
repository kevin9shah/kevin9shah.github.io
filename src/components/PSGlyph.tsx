// Classic controller face-button glyphs (▲ ● ✕ ■), cycled by index wherever the
// site needs a small marker — section eyebrows, list bullets, a footer signature.
// Rendered as SVG paths on a shared 16x16 grid rather than Unicode characters —
// the four characters render at noticeably different sizes/baselines depending on
// the font, which is what made the bullets look misaligned against list text no
// matter how much per-usage margin was applied. A fixed viewBox sidesteps that.
export const PS_GLYPH_COLORS = ['#22c55e', '#ef4444', '#6366f1', '#ec4899'] as const

function glyphIndex(index: number) {
  return ((index % PS_GLYPH_COLORS.length) + PS_GLYPH_COLORS.length) % PS_GLYPH_COLORS.length
}

export function psGlyphColor(index: number) {
  return PS_GLYPH_COLORS[glyphIndex(index)]
}

interface PSGlyphProps {
  index: number
  size?: number
  className?: string
}

export default function PSGlyph({ index, size = 10, className = '' }: PSGlyphProps) {
  const i = glyphIndex(index)
  const color = PS_GLYPH_COLORS[i]

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      aria-hidden="true"
      className={`inline-block shrink-0 align-middle ${className}`}
    >
      {i === 0 && <path d="M8 3 L13.5 13 L2.5 13 Z" fill={color} />}
      {i === 1 && <circle cx="8" cy="8" r="4.8" fill={color} />}
      {i === 2 && (
        <g stroke={color} strokeWidth="2.1" strokeLinecap="round">
          <line x1="4" y1="4" x2="12" y2="12" />
          <line x1="12" y1="4" x2="4" y2="12" />
        </g>
      )}
      {i === 3 && <rect x="3.4" y="3.4" width="9.2" height="9.2" rx="1" fill={color} />}
    </svg>
  )
}
