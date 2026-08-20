import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { profile } from '../data/content'
import { ExternalLink, Sparkles, Terminal, ArrowDown, Power, LogOut, Volume2, VolumeX } from 'lucide-react'
import { ConsoleSoundEngine } from '../lib/consoleSound'

interface GameDisc {
  id: string
  label: string
  shelfLabel: string // short spine label — the full label is shown in the HUD/tooltip instead
  type: 'external' | 'internal'
  url: string
  badge: string
  color: string
}

const GAME_DISCS: GameDisc[] = [
  { id: 'github', label: 'GitHub Repo', shelfLabel: 'GITHUB', type: 'external', url: profile.links.github, badge: 'Code Base', color: '#6366f1' },
  { id: 'linkedin', label: 'LinkedIn', shelfLabel: 'LINKEDIN', type: 'external', url: profile.links.linkedin, badge: 'Network', color: '#22c55e' },
  { id: 'ieee', label: 'IEEE Paper', shelfLabel: 'IEEE', type: 'external', url: 'https://ieeexplore.ieee.org/document/11441103/', badge: 'ICAUC 2026', color: '#6366f1' },
  { id: 'resume', label: 'Resume PDF', shelfLabel: 'RESUME', type: 'external', url: profile.links.resume, badge: 'Download', color: '#f59e0b' },
  { id: 'projects', label: 'Go to Projects', shelfLabel: 'PROJECTS', type: 'internal', url: '#projects', badge: 'Section 04', color: '#22c55e' },
  { id: 'research', label: 'Go to Research', shelfLabel: 'RESEARCH', type: 'internal', url: '#research', badge: 'Section 05', color: '#6366f1' },
]

// Disc-tray states for the eject/insert/spin-up choreography
type DiscState = 'idle' | 'ejecting' | 'inserting' | 'booting'
// What the monitor is displaying — driven by power + disc state, not React state,
// so it can be repainted every frame without a re-render
type MonitorMode = 'off' | 'boot' | 'prompt' | 'loading' | 'launching' | 'ready'

// ---- DESIGN TOKENS ---------------------------------------------------
const TOKENS = {
  color: {
    cyan: 0x6366f1,
    emerald: 0x22c55e,
    ink: 0x0a0f1d,
    shell: 0xc9cfd8, // classic light-grey console plastic
    shellDeck: 0x9aa1ad, // disc-lid two-tone insert, a shade darker
    monitor: 0x2b2f38, // dark charcoal CRT shell
    recess: 0x12141a, // vents / disc-tray well — dark against the light shell
    screw: 0x454a52,
  },
  bevelSm: 0.03,
  bevelMd: 0.05,
  bevelLg: 0.09,
}

// Pixel-display resolution for the monitor's loading screen
const PX_W = 176
const PX_H = 120

function hexToRgb(hex: string) {
  const v = parseInt(hex.slice(1), 16)
  return { r: (v >> 16) & 255, g: (v >> 8) & 255, b: v & 255 }
}

export default function CyberConsole3D() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [power, setPower] = useState(true)
  const [activeDisc, setActiveDisc] = useState<GameDisc | null>(null)
  const [loadingDisc, setLoadingDisc] = useState<GameDisc | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [drag, setDrag] = useState<{ disc: GameDisc; x: number; y: number } | null>(null)
  const [overDrop, setOverDrop] = useState(false)
  const [muted, setMuted] = useState(false)

  const insertRef = useRef<(disc: GameDisc) => void>(() => {})
  const ejectRef = useRef<() => void>(() => {})
  const powerRef = useRef<(on: boolean) => void>(() => {})
  const dragInfoRef = useRef<{ disc: GameDisc; startX: number; startY: number; moved: boolean } | null>(null)
  // Mirrors `power` synchronously — the pointerdown guard reads this instead of the
  // React state to avoid a race where a drag starts before the power-on re-render commits
  const powerOnRef = useRef(true)
  // Mirrors `isLoading` synchronously — same reasoning as powerOnRef: rapid repeat
  // clicks could otherwise read stale React state and let a second "click" sound
  // (and drag) start while the first insert sequence is still mid-flight.
  const isLoadingRef = useRef(false)
  const mutedRef = useRef(false)
  const soundRef = useRef<ConsoleSoundEngine | null>(null)
  if (!soundRef.current) soundRef.current = new ConsoleSoundEngine()

  function playSfx(name: 'click' | 'insert' | 'reading' | 'loaded' | 'eject' | 'power') {
    if (!mutedRef.current) soundRef.current?.play(name)
  }

  function setLoading(value: boolean) {
    isLoadingRef.current = value
    setIsLoading(value)
  }

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const timeouts: ReturnType<typeof setTimeout>[] = []

    const width = container.clientWidth || 320
    const height = container.clientHeight || 240

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100)
    camera.position.set(0, 1.6, 14.4)
    camera.lookAt(0, 1.85, -1.2)

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.25
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFShadowMap
    container.appendChild(renderer.domElement)

    // --- LIGHTING ---------------------------------------------------
    const keyLight = new THREE.DirectionalLight(0xf3f4f6, 2.2)
    keyLight.position.set(2.4, 5, 4.6)
    keyLight.castShadow = true
    keyLight.shadow.mapSize.set(1024, 1024)
    keyLight.shadow.camera.left = -3.5
    keyLight.shadow.camera.right = 3.5
    keyLight.shadow.camera.top = 3.5
    keyLight.shadow.camera.bottom = -3.5
    keyLight.shadow.camera.near = 1
    keyLight.shadow.camera.far = 14
    keyLight.shadow.bias = -0.0015
    keyLight.shadow.radius = 3
    scene.add(keyLight)

    const cyanRim = new THREE.PointLight(TOKENS.color.cyan, 2.6, 14)
    cyanRim.position.set(-2.8, 2, 3.2)
    scene.add(cyanRim)

    const emeraldFill = new THREE.PointLight(TOKENS.color.emerald, 1.3, 14)
    emeraldFill.position.set(2.6, -0.6, 3)
    scene.add(emeraldFill)

    const backRim = new THREE.PointLight(0x8fa2c2, 0.7, 12)
    backRim.position.set(0.5, 2.4, -3.6)
    scene.add(backRim)

    const ambientLight = new THREE.AmbientLight(0x9aa8c2, 0.7)
    scene.add(ambientLight)

    // --- MONITOR SCREEN TEXTURE (loading screen canvas) ------------------
    const screenCanvas = document.createElement('canvas')
    screenCanvas.width = PX_W
    screenCanvas.height = PX_H
    const ctx = screenCanvas.getContext('2d')!
    ctx.imageSmoothingEnabled = false

    const monitorTexture = new THREE.CanvasTexture(screenCanvas)
    monitorTexture.colorSpace = THREE.SRGBColorSpace
    monitorTexture.magFilter = THREE.NearestFilter
    monitorTexture.minFilter = THREE.NearestFilter
    monitorTexture.generateMipmaps = false

    const monitorState = {
      mode: 'boot' as MonitorMode,
      label: '',
      badge: '',
      accent: '#6366f1',
      bootStart: performance.now(),
    }

    function drawMonitor(t: number) {
      const w = PX_W
      const h = PX_H
      ctx.fillStyle = '#000000'
      ctx.fillRect(0, 0, w, h)

      if (monitorState.mode === 'off') {
        monitorTexture.needsUpdate = true
        return
      }

      const { r, g, b } = hexToRgb(monitorState.accent)
      // Slow "breathing" glow instead of a static wash — reads as a live device, not a still image
      const glowPulse = 0.11 + Math.sin(t * 0.0018) * 0.04
      const glow = ctx.createRadialGradient(w * 0.5, h * 0.4, 4, w * 0.5, h * 0.5, w * 0.65)
      glow.addColorStop(0, `rgba(${r},${g},${b},${glowPulse})`)
      glow.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = glow
      ctx.fillRect(0, 0, w, h)

      ctx.textAlign = 'center'
      if (monitorState.mode === 'boot') {
        ctx.font = '700 11px "JetBrains Mono", monospace'
        ctx.fillStyle = '#e5e7eb'
        ctx.fillText('SYSTEM BIOS v1.0', w / 2, h / 2 - 6)
        ctx.font = '700 8px "JetBrains Mono", monospace'
        ctx.fillStyle = '#5b6b85'
        ctx.fillText('INITIALIZING...', w / 2, h / 2 + 10)
        const bootBw = w - 16
        ctx.fillStyle = 'rgba(148,163,184,0.2)'
        ctx.fillRect(8, h / 2 + 22, bootBw, 6)
        const bootProg = ((t - monitorState.bootStart) % 900) / 900
        ctx.fillStyle = '#e5e7eb'
        ctx.fillRect(8, h / 2 + 22, Math.max(3, bootBw * bootProg), 6)
      } else if (monitorState.mode === 'prompt') {
        ctx.font = '700 13px "Outfit", sans-serif'
        ctx.fillStyle = '#f3f4f6'
        ctx.fillText('NO DISC', w / 2, h / 2 - 8)
        ctx.font = '700 8px "JetBrains Mono", monospace'
        ctx.fillStyle = '#5b6b85'
        ctx.fillText('INSERT A DISC TO CONTINUE', w / 2, h / 2 + 10)
        if (Math.floor(t / 500) % 2 === 0) {
          ctx.fillStyle = '#6366f1'
          ctx.fillRect(w / 2 - 3, h / 2 + 20, 6, 6)
        }
      } else if (monitorState.mode === 'loading') {
        ctx.textAlign = 'left'
        ctx.font = '700 8px "JetBrains Mono", monospace'
        ctx.fillStyle = '#5b6b85'
        ctx.fillText('READING DISC', 8, 14)
        ctx.font = '700 12px "Outfit", sans-serif'
        ctx.fillStyle = '#f3f4f6'
        const label = monitorState.label.length > 17 ? monitorState.label.slice(0, 16) + '…' : monitorState.label
        ctx.fillText(label, 8, 44)
        ctx.font = '700 8px "JetBrains Mono", monospace'
        ctx.fillStyle = monitorState.accent
        ctx.fillText(monitorState.badge.toUpperCase(), 8, 58)

        const bw = w - 16
        ctx.fillStyle = 'rgba(148,163,184,0.2)'
        ctx.fillRect(8, 80, bw, 8)
        const prog = (t % 700) / 700
        ctx.fillStyle = monitorState.accent
        ctx.fillRect(8, 80, Math.max(4, bw * prog), 8)

        const dots = '.'.repeat(1 + Math.floor((t / 220) % 3))
        ctx.font = '700 8px "JetBrains Mono", monospace'
        ctx.fillStyle = '#44506a'
        ctx.fillText(`LOADING${dots}`, 8, h - 8)
      } else if (monitorState.mode === 'launching') {
        ctx.font = '700 12px "Outfit", sans-serif'
        ctx.fillStyle = monitorState.accent
        ctx.fillText('LAUNCHING', w / 2, h / 2 - 6)
        ctx.font = '700 10px "Outfit", sans-serif'
        ctx.fillStyle = '#f3f4f6'
        const label = monitorState.label.length > 17 ? monitorState.label.slice(0, 16) + '…' : monitorState.label
        ctx.fillText(label, w / 2, h / 2 + 12)
      } else if (monitorState.mode === 'ready') {
        ctx.textAlign = 'left'
        ctx.font = '700 8px "JetBrains Mono", monospace'
        ctx.fillStyle = '#5b6b85'
        ctx.fillText('NOW LOADED', 8, 14)
        ctx.font = '700 13px "Outfit", sans-serif'
        ctx.fillStyle = '#f3f4f6'
        const label = monitorState.label.length > 16 ? monitorState.label.slice(0, 15) + '…' : monitorState.label
        ctx.fillText(label, 8, 42)
        ctx.font = '700 8px "JetBrains Mono", monospace'
        ctx.fillStyle = monitorState.accent
        ctx.fillText(monitorState.badge.toUpperCase(), 8, 56)

        // idle "now playing" equalizer — small bounce so the loaded state feels alive
        for (let i = 0; i < 14; i++) {
          const bh = 3 + ((Math.sin(t * 0.006 + i * 0.8) + 1) / 2) * 13
          ctx.fillStyle = i % 3 === 0 ? monitorState.accent : 'rgba(148,163,184,0.32)'
          ctx.fillRect(8 + i * 5.5, 92 - bh, 3.5, bh)
        }

        ctx.font = '700 7px "JetBrains Mono", monospace'
        ctx.fillStyle = '#3d4a63'
        ctx.fillText('EJECT TO LOAD ANOTHER DISC', 8, h - 8)
      }
      ctx.textAlign = 'left'

      // CRT scan beam — a bright line sweeping down, re-drawn every frame
      const scanY = (t * 0.045) % (h + 20) - 10
      const scanGrad = ctx.createLinearGradient(0, scanY - 6, 0, scanY + 6)
      scanGrad.addColorStop(0, 'rgba(255,255,255,0)')
      scanGrad.addColorStop(0.5, 'rgba(255,255,255,0.07)')
      scanGrad.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.fillStyle = scanGrad
      ctx.fillRect(0, scanY - 6, w, 12)

      ctx.globalAlpha = 0.14
      ctx.fillStyle = '#000000'
      for (let y = 0; y < h; y += 2) ctx.fillRect(0, y, w, 1)
      ctx.globalAlpha = 1

      const vg = ctx.createRadialGradient(w / 2, h / 2, h * 0.25, w / 2, h / 2, h * 0.8)
      vg.addColorStop(0, 'rgba(0,0,0,0)')
      vg.addColorStop(1, 'rgba(0,0,0,0.5)')
      ctx.fillStyle = vg
      ctx.fillRect(0, 0, w, h)

      monitorTexture.needsUpdate = true
    }

    // --- MATERIALS -----------------------------------------------------
    const shellMat = new THREE.MeshPhysicalMaterial({ color: TOKENS.color.shell, metalness: 0.12, roughness: 0.4, clearcoat: 0.55, clearcoatRoughness: 0.3 })
    const deckMat = new THREE.MeshPhysicalMaterial({ color: TOKENS.color.shellDeck, metalness: 0.12, roughness: 0.48, clearcoat: 0.4, clearcoatRoughness: 0.32 })
    const monitorMat = new THREE.MeshPhysicalMaterial({ color: TOKENS.color.monitor, metalness: 0.2, roughness: 0.45, clearcoat: 0.4, clearcoatRoughness: 0.3 })
    const recessMat = new THREE.MeshStandardMaterial({ color: TOKENS.color.recess, metalness: 0.1, roughness: 0.8 })
    const trimMat = new THREE.MeshPhysicalMaterial({ color: TOKENS.color.cyan, metalness: 0.6, roughness: 0.3, clearcoat: 0.8, emissive: TOKENS.color.cyan, emissiveIntensity: 0.15 })
    const buttonMat = new THREE.MeshPhysicalMaterial({ color: 0x5b616b, metalness: 0.35, roughness: 0.3, clearcoat: 0.5 })
    const screwMat = new THREE.MeshStandardMaterial({ color: TOKENS.color.screw, metalness: 0.7, roughness: 0.35 })
    const cableMat = new THREE.MeshStandardMaterial({ color: 0x1a1d22, metalness: 0.1, roughness: 0.65 })

    const monitorScreenMat = new THREE.MeshStandardMaterial({
      map: monitorTexture,
      emissiveMap: monitorTexture,
      emissive: new THREE.Color(0xffffff),
      emissiveIntensity: 1.0,
      roughness: 0.4,
      metalness: 0,
    })
    const glassMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.05, blending: THREE.AdditiveBlending, depthWrite: false })

    function discMaterial(hex: string) {
      const color = new THREE.Color(hex)
      return new THREE.MeshPhysicalMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.3,
        metalness: 0.15,
        roughness: 0.32,
        clearcoat: 0.75,
        clearcoatRoughness: 0.18,
      })
    }

    // --- SHARED RIG — console + monitor tilt/bob together as one desk setup ---
    const rig = new THREE.Group()
    scene.add(rig)

    const HALF_W = 1.9
    const HALF_D = 1.35
    const HALF_H = 0.28

    // Console shell
    const bodyGeo = new RoundedBoxGeometry(HALF_W * 2, HALF_H * 2, HALF_D * 2, 6, TOKENS.bevelLg)
    const bodyMesh = new THREE.Mesh(bodyGeo, shellMat)
    bodyMesh.castShadow = true
    bodyMesh.receiveShadow = true
    rig.add(bodyMesh)

    const LID_W = 2.1
    const LID_D = 2.35
    const LID_X = 0.72
    const LID_TOP = HALF_H + 0.05
    const lidGeo = new RoundedBoxGeometry(LID_W, 0.1, LID_D, 4, TOKENS.bevelMd)
    const lidMesh = new THREE.Mesh(lidGeo, deckMat)
    lidMesh.position.set(LID_X, HALF_H, 0)
    lidMesh.receiveShadow = true
    lidMesh.castShadow = true
    rig.add(lidMesh)

    for (const gz of [-0.75, -0.6]) {
      const groove = new THREE.Mesh(new THREE.BoxGeometry(LID_W - 0.3, 0.012, 0.05), recessMat)
      groove.position.set(LID_X, LID_TOP + 0.001, gz)
      rig.add(groove)
    }

    const TRAY_R = 0.82
    const TRAY_X = LID_X
    const TRAY_Z = 0.12
    const trayMesh = new THREE.Mesh(new THREE.CircleGeometry(TRAY_R, 48), recessMat)
    trayMesh.rotation.x = -Math.PI / 2
    trayMesh.position.set(TRAY_X, LID_TOP + 0.002, TRAY_Z)
    rig.add(trayMesh)

    const rimGeo = new THREE.RingGeometry(TRAY_R + 0.015, TRAY_R + 0.05, 48)
    const rimMat = new THREE.MeshBasicMaterial({ color: TOKENS.color.cyan, transparent: true, opacity: 0.28 })
    const rimGlow = new THREE.Mesh(rimGeo, rimMat)
    rimGlow.rotation.x = -Math.PI / 2
    rimGlow.position.set(TRAY_X, LID_TOP + 0.004, TRAY_Z)
    rig.add(rimGlow)

    const ejectMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.04, 24), buttonMat)
    ejectMesh.position.set(LID_X + 0.68, LID_TOP + 0.02, LID_D / 2 - 0.28)
    ejectMesh.castShadow = true
    rig.add(ejectMesh)
    const ejectCollar = new THREE.Mesh(new THREE.CircleGeometry(0.14, 24), recessMat)
    ejectCollar.rotation.x = -Math.PI / 2
    ejectCollar.position.set(LID_X + 0.68, LID_TOP + 0.001, LID_D / 2 - 0.28)
    rig.add(ejectCollar)

    const vent = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.02, 0.02), recessMat)
    vent.position.set(-1.15, 0, HALF_D - 0.005)
    rig.add(vent)

    const ledMat = new THREE.MeshStandardMaterial({ color: TOKENS.color.emerald, emissive: TOKENS.color.emerald, emissiveIntensity: 0.05 })
    const led = new THREE.Mesh(new THREE.CircleGeometry(0.035, 16), ledMat)
    led.position.set(-1.65, 0.1, HALF_D + 0.001)
    rig.add(led)

    const trimMesh = new THREE.Mesh(new THREE.BoxGeometry(HALF_W * 2 - 0.3, 0.03, 0.03), trimMat)
    trimMesh.position.set(0, -HALF_H + 0.04, HALF_D - 0.005)
    rig.add(trimMesh)

    const screwPositions: [number, number][] = [
      [-HALF_W + 0.18, HALF_H - 0.18],
      [HALF_W - 0.18, HALF_H - 0.18],
      [-HALF_W + 0.18, -HALF_H + 0.18],
      [HALF_W - 0.18, -HALF_H + 0.18],
    ]
    for (const [sx, sz] of screwPositions) {
      const screw = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.02, 16), screwMat)
      screw.position.set(sx, HALF_H + 0.001, sz)
      screw.castShadow = true
      rig.add(screw)
    }

    // Face-button badge — the deliberately colorful flourish on an otherwise grey shell
    const badgeGroup = new THREE.Group()
    badgeGroup.position.set(-0.95, HALF_H + 0.003, 0.15)
    badgeGroup.rotation.x = -Math.PI / 2
    rig.add(badgeGroup)

    const BADGE_R = 0.16
    const triMat = new THREE.MeshStandardMaterial({ color: 0x22c55e, emissive: 0x22c55e, emissiveIntensity: 0.35, roughness: 0.4 })
    const circMat = new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xef4444, emissiveIntensity: 0.35, roughness: 0.4 })
    const crossMat = new THREE.MeshStandardMaterial({ color: 0x6366f1, emissive: 0x6366f1, emissiveIntensity: 0.35, roughness: 0.4 })
    const squareMat = new THREE.MeshStandardMaterial({ color: 0xec4899, emissive: 0xec4899, emissiveIntensity: 0.35, roughness: 0.4 })

    const triangle = new THREE.Mesh(new THREE.CircleGeometry(0.075, 3), triMat)
    triangle.position.set(0, BADGE_R, 0)
    badgeGroup.add(triangle)
    const circle = new THREE.Mesh(new THREE.CircleGeometry(0.06, 24), circMat)
    circle.position.set(BADGE_R, 0, 0)
    badgeGroup.add(circle)
    const square = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.01), squareMat)
    square.position.set(-BADGE_R, 0, 0)
    badgeGroup.add(square)
    const crossGroup = new THREE.Group()
    crossGroup.position.set(0, -BADGE_R, 0)
    const bar1 = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.022, 0.01), crossMat)
    bar1.rotation.z = Math.PI / 4
    const bar2 = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.022, 0.01), crossMat)
    bar2.rotation.z = -Math.PI / 4
    crossGroup.add(bar1, bar2)
    badgeGroup.add(crossGroup)

    // --- MONITOR — a real CRT reads bigger than the console it sits behind, not smaller ---
    // Roughly 1.6x the console's own width — a CRT TV bigger than the console
    // it's plugged into, the way a real living-room setup actually looks
    const MON_W = 6.1
    const MON_H = 4.95
    const MON_D = 2.95
    const monitorGroup = new THREE.Group()
    monitorGroup.position.set(0, 3.05, -4.6)
    rig.add(monitorGroup)

    const monBodyMesh = new THREE.Mesh(new RoundedBoxGeometry(MON_W, MON_H, MON_D, 5, 0.1), monitorMat)
    monBodyMesh.castShadow = true
    monBodyMesh.receiveShadow = true
    monitorGroup.add(monBodyMesh)

    const standMesh = new THREE.Mesh(new RoundedBoxGeometry(1.05, 0.2, 0.9, 3, 0.05), monitorMat)
    standMesh.position.set(0, -MON_H / 2 - 0.1, 0)
    standMesh.castShadow = true
    monitorGroup.add(standMesh)

    // Each layer's FRONT FACE z must strictly increase — a box's front face sits
    // half its depth ahead of its center, so the bezel's front face has to be
    // computed explicitly or it ends up poking out past the screen it should frame.
    const SCR_W = MON_W - 0.3
    const SCR_H = MON_H - 0.36
    const BEZEL_DEPTH = 0.06
    const BEZEL_FRONT = MON_D / 2 + 0.01
    const MON_SCREEN_FRONT = BEZEL_FRONT + 0.006
    const MON_GLASS_FRONT = MON_SCREEN_FRONT + 0.006

    const scrBezelMesh = new THREE.Mesh(new RoundedBoxGeometry(SCR_W + 0.1, SCR_H + 0.1, BEZEL_DEPTH, 3, 0.04), recessMat)
    scrBezelMesh.position.set(0, 0.06, BEZEL_FRONT - BEZEL_DEPTH / 2)
    monitorGroup.add(scrBezelMesh)

    const monScreenMesh = new THREE.Mesh(new THREE.PlaneGeometry(SCR_W, SCR_H), monitorScreenMat)
    monScreenMesh.position.set(0, 0.06, MON_SCREEN_FRONT)
    monitorGroup.add(monScreenMesh)

    const monGlassMesh = new THREE.Mesh(new THREE.PlaneGeometry(SCR_W - 0.04, SCR_H - 0.04), glassMat)
    monGlassMesh.position.set(0, 0.06, MON_GLASS_FRONT)
    monitorGroup.add(monGlassMesh)

    // Cable from the back of the console up to the base of the monitor
    const cableStart = new THREE.Vector3(0.4, -HALF_H + 0.06, -HALF_D + 0.08)
    const cableEnd = new THREE.Vector3(monitorGroup.position.x, monitorGroup.position.y - MON_H / 2 - 0.12, monitorGroup.position.z + MON_D / 2 - 0.1)
    const cableMid = new THREE.Vector3((cableStart.x + cableEnd.x) / 2, Math.min(cableStart.y, cableEnd.y) - 0.35, (cableStart.z + cableEnd.z) / 2)
    const cableCurve = new THREE.CatmullRomCurve3([cableStart, cableMid, cableEnd])
    const cableMesh = new THREE.Mesh(new THREE.TubeGeometry(cableCurve, 20, 0.025, 8, false), cableMat)
    rig.add(cableMesh)

    // --- GAME DISC (separate group so it can rise/spin independently of the rig tilt) ---
    const discGroup = new THREE.Group()
    scene.add(discGroup)

    const DISC_R = 0.62
    const DISC_THICK = 0.045
    const DISC_SEATED_Y = LID_TOP + 0.003 + DISC_THICK / 2
    const DISC_PARK_Y = DISC_SEATED_Y + 1.4

    let discMat = discMaterial('#6366f1')
    const discMesh = new THREE.Mesh(new THREE.CylinderGeometry(DISC_R, DISC_R, DISC_THICK, 48), discMat)
    discMesh.castShadow = true
    discMesh.visible = false

    const labelMat = new THREE.MeshStandardMaterial({ color: TOKENS.color.ink, roughness: 0.55 })
    const discLabel = new THREE.Mesh(new THREE.CircleGeometry(0.22, 32), labelMat)
    discLabel.rotation.x = -Math.PI / 2
    discLabel.position.set(0, DISC_THICK / 2 + 0.003, 0)
    discMesh.add(discLabel)

    const discRing = new THREE.Mesh(new THREE.RingGeometry(DISC_R - 0.05, DISC_R - 0.044, 48), recessMat)
    discRing.rotation.x = -Math.PI / 2
    discRing.position.set(0, DISC_THICK / 2 + 0.001, 0)
    discMesh.add(discRing)

    discGroup.add(discMesh)
    discGroup.position.set(TRAY_X, DISC_PARK_Y, TRAY_Z)

    // --- STATE MACHINE: power + disc tray -------------------------------
    let powerOn = true
    let hasDisc = false
    let discState: DiscState = 'idle'
    let stateStart = 0
    let pendingDisc: GameDisc | null = null

    function setDiscColor(hex: string) {
      discMat.color.set(hex)
      discMat.emissive.set(hex)
    }

    function setPowerState(on: boolean) {
      powerOn = on
      if (on) {
        monitorState.mode = 'boot'
        monitorState.bootStart = performance.now()
      } else {
        monitorState.mode = 'off'
      }
    }
    powerRef.current = setPowerState

    function runInsert(disc: GameDisc) {
      if (!powerOn || discState !== 'idle') return
      pendingDisc = disc
      setLoadingDisc(disc)
      setLoading(true)
      stateStart = performance.now()
      if (hasDisc) {
        discState = 'ejecting'
        playSfx('eject')
      } else {
        discMesh.visible = true
        setDiscColor(disc.color)
        discGroup.position.y = rig.position.y + DISC_PARK_Y
        discState = 'inserting'
      }
    }
    insertRef.current = runInsert

    function runEject() {
      if (!powerOn || !hasDisc || discState !== 'idle') return
      pendingDisc = null
      setLoading(true)
      stateStart = performance.now()
      discState = 'ejecting'
      playSfx('eject')
    }
    ejectRef.current = runEject

    // Mouse-driven idle tilt (kept subtle so it feels alive without being distracting)
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 }
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      mouse.targetX = ((e.clientX - cx) / (window.innerWidth / 2)) * 0.22
      mouse.targetY = ((e.clientY - cy) / (window.innerHeight / 2)) * 0.12
    }
    const handleMouseLeave = () => { mouse.targetX = 0; mouse.targetY = 0 }
    window.addEventListener('mousemove', handleMouseMove)
    container.addEventListener('mouseleave', handleMouseLeave)

    let animationId: number
    let lastFrameTime = performance.now()
    const BASE_ROT_Y = -0.14
    const BASE_ROT_X = 0.42
    const BASE_POS_Y = 1.0
    const BASE_POS_Z = 2.6

    const animate = () => {
      const now = performance.now()
      const t = now
      const delta = Math.min(now - lastFrameTime, 50)
      lastFrameTime = now

      mouse.x += (mouse.targetX - mouse.x) * 0.06
      mouse.y += (mouse.targetY - mouse.y) * 0.06

      const idleSway = reduceMotion ? 0 : Math.sin(t * 0.0006) * 0.025
      rig.rotation.y = BASE_ROT_Y + mouse.x + idleSway
      rig.rotation.x = BASE_ROT_X - mouse.y * 0.25 + (reduceMotion ? 0 : Math.sin(t * 0.0009) * 0.01)
      rig.position.y = BASE_POS_Y + (reduceMotion ? 0 : Math.sin(t * 0.0011) * 0.025)
      rig.position.z = BASE_POS_Z

      discGroup.rotation.x = rig.rotation.x
      const baseRotY = rig.rotation.y
      const baseY = rig.position.y
      // discGroup lives outside the rig (so its spin/rise animation isn't warped by
      // the rig's rotation) — it has to track rig.position.z by hand or the tray and
      // the disc drift apart whenever the rig's base offset changes.
      discGroup.position.z = rig.position.z + TRAY_Z

      // --- boot timing ---
      if (monitorState.mode === 'boot' && now - monitorState.bootStart > 900) {
        monitorState.mode = hasDisc ? 'ready' : 'prompt'
      }

      // --- disc state machine ---
      const elapsed = now - stateStart
      if (discState === 'ejecting') {
        const dur = 420
        const p = Math.min(elapsed / dur, 1)
        const eased = 1 - Math.pow(1 - p, 3)
        discGroup.position.y = baseY + THREE.MathUtils.lerp(DISC_SEATED_Y, DISC_PARK_Y, eased)
        discGroup.rotation.y = baseRotY
        rimMat.opacity = THREE.MathUtils.lerp(0.9, 0, eased)
        if (p >= 1) {
          if (pendingDisc) {
            setDiscColor(pendingDisc.color)
            discState = 'inserting'
          } else {
            hasDisc = false
            discMesh.visible = false
            discState = 'idle'
            monitorState.mode = 'prompt'
            setActiveDisc(null)
            setLoading(false)
          }
          stateStart = now
        }
      } else if (discState === 'inserting') {
        const dur = 480
        const p = Math.min(elapsed / dur, 1)
        const eased = p < 0.7 ? (p / 0.7) ** 2 : 1 - Math.pow(1 - (p - 0.7) / 0.3, 2) * 0.15
        discGroup.position.y = baseY + THREE.MathUtils.lerp(DISC_PARK_Y, DISC_SEATED_Y, Math.min(eased, 1))
        discGroup.rotation.y = baseRotY + p * Math.PI * 1.5
        rimMat.opacity = THREE.MathUtils.lerp(0, 1, p)
        if (p >= 1) {
          hasDisc = true
          discState = 'booting'
          stateStart = now
          playSfx('insert')
          playSfx('reading')
          if (pendingDisc) {
            monitorState.mode = 'loading'
            monitorState.label = pendingDisc.label
            monitorState.badge = pendingDisc.badge
            monitorState.accent = pendingDisc.color
          }
        }
      } else if (discState === 'booting') {
        const dur = 620
        const p = Math.min(elapsed / dur, 1)
        discGroup.position.y = baseY + DISC_SEATED_Y + Math.sin(t * 0.05) * 0.006
        discGroup.rotation.y += (delta / 1000) * 14
        rimMat.opacity = 0.85 + Math.sin(t * 0.02) * 0.15
        if (p >= 1) {
          discState = 'idle'
          const finishedDisc = pendingDisc
          pendingDisc = null
          rimMat.opacity = 0.35
          if (finishedDisc) {
            setActiveDisc(finishedDisc)
            setLoadingDisc(null)
            setLoading(false)
            monitorState.mode = 'launching'
            playSfx('loaded')
            const t1 = setTimeout(() => {
              if (finishedDisc.type === 'external') {
                window.open(finishedDisc.url, '_blank', 'noopener,noreferrer')
              } else {
                document.querySelector(finishedDisc.url)?.scrollIntoView({ behavior: 'smooth' })
              }
              monitorState.mode = 'ready'
            }, 550)
            timeouts.push(t1)
          }
        }
      } else {
        if (hasDisc) {
          discGroup.position.y = baseY + DISC_SEATED_Y + Math.sin(t * 0.0015) * 0.008
          discGroup.rotation.y = baseRotY
        }
        rimMat.opacity = THREE.MathUtils.lerp(rimMat.opacity, hasDisc ? 0.35 + Math.sin(t * 0.003) * 0.1 : 0, 0.05)
      }

      ledMat.emissiveIntensity = powerOn ? 1.1 + Math.sin(t * 0.004) * 0.5 : 0.05
      drawMonitor(t)

      renderer.render(scene, camera)
      animationId = requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      if (!container) return
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationId)
      timeouts.forEach(clearTimeout)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      container.removeEventListener('mouseleave', handleMouseLeave)
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
      renderer.dispose()
      monitorTexture.dispose()
    }
  }, [])

  const handlePowerToggle = () => {
    const next = !power
    powerOnRef.current = next
    setPower(next)
    powerRef.current(next)
    if (next) playSfx('power')
    if (!next) {
      setActiveDisc(null)
      setLoadingDisc(null)
      setLoading(false)
    }
  }

  const handleMuteToggle = () => {
    mutedRef.current = !mutedRef.current
    setMuted(mutedRef.current)
  }

  const handleEject = () => ejectRef.current()

  // Dragging is driven by window-level listeners rather than element.setPointerCapture.
  // Capture can silently fail (or throw) on a pointerdown that lands in the same tick as
  // a just-committed re-render — e.g. right after the power-on click enables these
  // buttons — which aborted the drag before dragInfoRef was ever set. Window listeners
  // don't depend on capture succeeding, so they don't have that failure mode.
  function stopDragListening() {
    window.removeEventListener('pointermove', handleWindowPointerMove)
    window.removeEventListener('pointerup', handleWindowPointerUp)
    window.removeEventListener('pointercancel', handleWindowPointerCancel)
  }

  function handleWindowPointerMove(e: PointerEvent) {
    const info = dragInfoRef.current
    if (!info) return
    const dx = e.clientX - info.startX
    const dy = e.clientY - info.startY
    if (Math.hypot(dx, dy) > 8) info.moved = true
    setDrag({ disc: info.disc, x: e.clientX, y: e.clientY })
    const rect = containerRef.current?.getBoundingClientRect()
    if (rect) {
      const inside = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom
      setOverDrop(inside)
    }
  }

  function handleWindowPointerUp(e: PointerEvent) {
    const info = dragInfoRef.current
    stopDragListening()
    dragInfoRef.current = null
    setDrag(null)
    setOverDrop(false)
    if (!info) return

    if (!info.moved) {
      insertRef.current(info.disc)
      return
    }
    const rect = containerRef.current?.getBoundingClientRect()
    if (rect && e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom) {
      insertRef.current(info.disc)
    }
  }

  function handleWindowPointerCancel() {
    stopDragListening()
    dragInfoRef.current = null
    setDrag(null)
    setOverDrop(false)
  }

  function handlePointerDown(e: ReactPointerEvent<HTMLButtonElement>, disc: GameDisc) {
    if (!powerOnRef.current || isLoadingRef.current) return
    e.preventDefault()
    playSfx('click')
    dragInfoRef.current = { disc, startX: e.clientX, startY: e.clientY, moved: false }
    setDrag({ disc, x: e.clientX, y: e.clientY })
    window.addEventListener('pointermove', handleWindowPointerMove)
    window.addEventListener('pointerup', handleWindowPointerUp)
    window.addEventListener('pointercancel', handleWindowPointerCancel)
  }

  const statusText = !power
    ? 'Console is powered off. Press the power button to begin.'
    : isLoading
      ? loadingDisc
        ? `Loading ${loadingDisc.label}...`
        : 'Ejecting disc...'
      : activeDisc
        ? null
        : 'No disc inserted. Drag a disc from the shelf onto the console — or tap one to insert it.'

  return (
    <div className="rainbow-card rounded-2xl border border-cyan/30 bg-surface/60 p-6 glow-cyan overflow-hidden w-full">
      {/* Console Header Status */}
      <div className="w-full flex items-center justify-between font-mono text-[11px] border-b border-line/60 pb-3 mb-4">
        <span className="flex items-center gap-2 text-cyan font-bold">
          <Sparkles size={14} />
          CONSOLE LAUNCHER
        </span>
        <div className="flex items-center gap-2">
          <span
            className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-semibold border ${
              power ? 'text-emerald bg-emerald/10 border-emerald/30' : 'text-muted bg-surface border-line'
            }`}
          >
            <Terminal size={12} />
            {power ? 'SYS: READY' : 'SYS: OFF'}
          </span>
          <button
            onClick={handleMuteToggle}
            aria-label={muted ? 'Unmute sound effects' : 'Mute sound effects'}
            className="flex items-center justify-center h-6 w-6 rounded-full border border-line text-muted transition-colors hover:border-cyan hover:text-cyan"
          >
            {muted ? <VolumeX size={12} /> : <Volume2 size={12} />}
          </button>
          <button
            onClick={handlePowerToggle}
            aria-label={power ? 'Power off console' : 'Power on console'}
            className={`flex items-center justify-center h-6 w-6 rounded-full border transition-colors ${
              power ? 'border-emerald text-emerald hover:bg-emerald/10' : 'border-line text-muted hover:border-cyan hover:text-cyan'
            }`}
          >
            <Power size={12} />
          </button>
        </div>
      </div>

      {/* Landscape split on wide rows: 3D canvas left, HUD + disc shelf fill the rest */}
      <div className="flex flex-col lg:flex-row gap-6 items-center lg:items-stretch">
        {/* 3D WebGL Canvas — also the drop zone for inserting a disc */}
        <div className="relative w-full lg:w-80 lg:flex-shrink-0">
          <div
            ref={containerRef}
            className={`h-60 sm:h-72 lg:h-full w-full cursor-grab active:cursor-grabbing rounded-xl transition-shadow duration-150 ${
              overDrop ? 'ring-2 ring-cyan shadow-[0_0_30px_-4px_rgba(6,182,212,0.7)]' : ''
            }`}
          />
          {overDrop && drag && (
            <div className="pointer-events-none absolute inset-x-0 bottom-2 flex justify-center">
              <span className="rounded-full bg-cyan/90 px-3 py-1 text-[10px] font-mono font-bold text-ink">DROP TO INSERT</span>
            </div>
          )}
        </div>

        <div className="flex w-full flex-1 flex-col justify-between gap-4">
          {/* Console HUD Readout */}
          <div className="w-full rounded-xl border border-cyan/40 bg-ink/90 p-4 font-mono text-xs space-y-2">
            {statusText ? (
              <div className="text-muted text-[11px]">{statusText}</div>
            ) : (
              <>
                <div className="flex items-center justify-between text-[10px] text-muted">
                  <span>ACTIVE DISC</span>
                  <span className="text-cyan font-bold">{activeDisc?.badge}</span>
                </div>
                <div className="text-sm font-semibold text-text flex items-center justify-between">
                  <span className="text-cyan">{activeDisc?.label}</span>
                  <span className="text-[11px] text-muted truncate max-w-[140px]">{activeDisc?.url}</span>
                </div>
                <div className="flex items-center justify-between pt-0.5">
                  <span className="text-muted text-[10px]">Drag another disc to swap it</span>
                  <button
                    onClick={handleEject}
                    className="flex items-center gap-1 text-[10px] text-muted hover:text-cyan transition-colors"
                  >
                    <LogOut size={11} />
                    EJECT
                  </button>
                </div>
              </>
            )}
          </div>

          {/* CD Shelf — a row of standing jewel cases; drag one onto the console, or tap to insert */}
          <div className="w-full rounded-lg border border-line/50 border-b-4 border-b-line bg-gradient-to-b from-surface/10 to-surface/60 px-3 pt-4 pb-2 overflow-x-auto">
            <div className="flex items-end justify-center sm:justify-start gap-2 min-w-max mx-auto sm:mx-0">
              {GAME_DISCS.map((disc) => {
                const isSelected = activeDisc?.id === disc.id
                return (
                  <button
                    key={disc.id}
                    title={`${disc.label} — ${disc.badge}`}
                    onPointerDown={(e) => handlePointerDown(e, disc)}
                    disabled={!power || isLoading}
                    style={{
                      width: 44,
                      height: 132,
                      borderColor: power ? disc.color : undefined,
                      background: power
                        ? `linear-gradient(180deg, ${disc.color}33 0%, ${disc.color}14 45%, #0a0f1d 100%)`
                        : undefined,
                    }}
                    className={`group relative flex flex-shrink-0 flex-col items-center justify-between rounded-t-md border-x border-t pt-2.5 pb-2 font-mono transition-transform duration-150 touch-none select-none disabled:cursor-not-allowed ${
                      !power
                        ? 'opacity-40 border-line bg-surface/80'
                        : isSelected
                          ? '-translate-y-2.5 shadow-[0_6px_16px_-6px_rgba(6,182,212,0.5)]'
                          : 'hover:-translate-y-1.5 cursor-grab active:cursor-grabbing border-line'
                    }`}
                  >
                    {isSelected && power && (
                      <span className="absolute -top-2 h-1.5 w-1.5 rounded-full" style={{ background: disc.color }} />
                    )}
                    <span
                      className="text-[9px] font-bold tracking-wide text-text/90 whitespace-nowrap"
                      style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                    >
                      {disc.shelfLabel}
                    </span>
                    {disc.type === 'external' ? (
                      <ExternalLink size={11} style={{ color: power ? disc.color : undefined }} className={!power ? 'text-muted' : ''} />
                    ) : (
                      <ArrowDown size={11} style={{ color: power ? disc.color : undefined }} className={!power ? 'text-muted' : ''} />
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Floating drag ghost — follows the pointer while a disc is being dragged */}
      {drag && (
        <div
          className="pointer-events-none fixed z-[999] -translate-x-1/2 -translate-y-1/2 rounded-lg border px-3 py-2 font-mono text-[11px] font-semibold shadow-2xl"
          style={{
            left: drag.x,
            top: drag.y,
            borderColor: drag.disc.color,
            color: drag.disc.color,
            background: 'rgba(10,15,29,0.92)',
            boxShadow: `0 0 24px -6px ${drag.disc.color}`,
          }}
        >
          {drag.disc.label}
        </div>
      )}
    </div>
  )
}
