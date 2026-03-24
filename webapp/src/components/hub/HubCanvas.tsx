'use client'

import { useRef, useEffect, useCallback } from 'react'
import { ZONES, hexToPixel, pixelToHex, hexCorners, HEX_SIZE, type Zone } from '@/lib/hub/zones'
import type { HubBee, Trophy } from '@/lib/hub/hubTypes'
import { BEE_COLORS } from '@/lib/hub/hubTypes'

interface Props {
  bees: HubBee[]
  trophies: Trophy[]
  myBeeId: string | null
  onHexClick: (q: number, r: number, zone: Zone | undefined) => void
  selectedZone: string | null
}

export default function HubCanvas({ bees, trophies, myBeeId, onHexClick, selectedZone }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const cameraRef = useRef({ x: 0, y: 0 })
  const dragRef = useRef({ dragging: false, startX: 0, startY: 0, camStartX: 0, camStartY: 0 })
  const animRef = useRef<number>(0)
  const timeRef = useRef(0)

  const draw = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const t = timeRef.current
    const cam = cameraRef.current
    const cx = w / 2 + cam.x
    const cy = h / 2 + cam.y

    // Clear
    ctx.clearRect(0, 0, w, h)

    // Draw zones
    for (const zone of ZONES) {
      const [px, py] = hexToPixel(zone.q, zone.r)
      const sx = cx + px
      const sy = cy + py
      const corners = hexCorners(sx, sy)

      // Hex fill
      ctx.beginPath()
      ctx.moveTo(corners[0][0], corners[0][1])
      for (let i = 1; i < 6; i++) ctx.lineTo(corners[i][0], corners[i][1])
      ctx.closePath()

      ctx.fillStyle = zone.color
      if (selectedZone === zone.id) {
        ctx.fillStyle = zone.category === 'trophies' ? '#FCD34D' : zone.color
        ctx.shadowColor = '#F59E0B'
        ctx.shadowBlur = 12
      }
      ctx.fill()
      ctx.shadowBlur = 0

      // Hex border
      ctx.strokeStyle = selectedZone === zone.id ? '#D97706' : '#D1C4A9'
      ctx.lineWidth = selectedZone === zone.id ? 2.5 : 1.2
      ctx.stroke()

      // Zone emoji
      ctx.font = '24px serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(zone.emoji, sx, sy - 8)

      // Zone name (small)
      ctx.font = 'bold 9px system-ui, sans-serif'
      ctx.fillStyle = '#78716C'
      ctx.fillText(zone.name, sx, sy + 16)

      // SDG badge
      if (zone.sdg) {
        ctx.font = '7px system-ui, sans-serif'
        ctx.fillStyle = '#A16207'
        ctx.fillText(zone.sdg, sx, sy + 26)
      }
    }

    // Draw trophies on trophy park hexes
    for (const trophy of trophies) {
      const [px, py] = hexToPixel(trophy.hex_q, trophy.hex_r)
      const sx = cx + px
      const sy = cy + py

      // Golden glow
      const glowIntensity = 0.4 + 0.2 * Math.sin(t * 0.002)
      ctx.beginPath()
      ctx.arc(sx, sy, HEX_SIZE * 0.6, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(253, 224, 71, ${glowIntensity})`
      ctx.fill()

      // Trophy emoji
      ctx.font = '20px serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('🏆', sx, sy - 5)

      // Quest name
      ctx.font = 'bold 7px system-ui, sans-serif'
      ctx.fillStyle = '#92400E'
      ctx.fillText(trophy.quest_title.slice(0, 14), sx, sy + 14)
    }

    // Draw bees
    for (const bee of bees) {
      const [px, py] = hexToPixel(bee.position.q, bee.position.r)
      const sx = cx + px
      const sy = cy + py

      // Slight offset per bee so they don't stack
      const idx = bees.indexOf(bee)
      const offsetAngle = (idx * 137.5) * Math.PI / 180 // golden angle spread
      const offsetR = Math.min(idx * 6, HEX_SIZE * 0.3)
      const bx = sx + Math.cos(offsetAngle) * offsetR
      const by = sy + Math.sin(offsetAngle) * offsetR

      const isMe = bee.id === myBeeId

      // Bee body
      const beeColor = BEE_COLORS.find(c => c.id === bee.bee_color)?.hex || '#FFD700'

      // Hover/pulse for own bee
      const pulse = isMe ? 1 + 0.08 * Math.sin(t * 0.004) : 1
      const radius = 10 * pulse

      // Shadow
      ctx.beginPath()
      ctx.arc(bx, by + 2, radius, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(0,0,0,0.1)'
      ctx.fill()

      // Body
      ctx.beginPath()
      ctx.arc(bx, by, radius, 0, Math.PI * 2)
      ctx.fillStyle = beeColor
      ctx.fill()

      // Stripe
      ctx.beginPath()
      ctx.arc(bx, by, radius, 0, Math.PI * 2)
      ctx.strokeStyle = bee.stripe_color === 'brown' ? '#2C1A00' : '#111'
      ctx.lineWidth = 2
      ctx.stroke()

      // Eyes
      ctx.beginPath()
      ctx.arc(bx - 3, by - 2, 1.5, 0, Math.PI * 2)
      ctx.arc(bx + 3, by - 2, 1.5, 0, Math.PI * 2)
      ctx.fillStyle = '#111'
      ctx.fill()

      // Ring for own bee
      if (isMe) {
        ctx.beginPath()
        ctx.arc(bx, by, radius + 4, 0, Math.PI * 2)
        ctx.strokeStyle = '#F59E0B'
        ctx.lineWidth = 2
        ctx.setLineDash([4, 3])
        ctx.stroke()
        ctx.setLineDash([])
      }

      // AI badge
      if (bee.bee_type === 'ai') {
        ctx.font = '8px serif'
        ctx.fillText('🤖', bx + 10, by - 10)
      }

      // Accessory
      if (bee.accessory) {
        const accEmoji: Record<string, string> = {
          crown: '👑', goggles: '🥽', flower: '🌸', leaf: '🍃',
          hardhat: '⛑️', antenna: '✨', scarf: '🧣'
        }
        ctx.font = '10px serif'
        ctx.fillText(accEmoji[bee.accessory] || '', bx, by - radius - 5)
      }

      // Name tag
      ctx.font = `${isMe ? 'bold ' : ''}8px system-ui, sans-serif`
      ctx.textAlign = 'center'
      ctx.fillStyle = isMe ? '#92400E' : '#78716C'
      ctx.fillText(bee.name, bx, by + radius + 10)

      // Title
      if (bee.title) {
        ctx.font = '6px system-ui, sans-serif'
        ctx.fillStyle = '#D97706'
        ctx.fillText(bee.title, bx, by + radius + 18)
      }
    }

    // Watermark
    ctx.font = '10px system-ui, sans-serif'
    ctx.fillStyle = '#D1C4A980'
    ctx.textAlign = 'right'
    ctx.fillText('Nexus Hub', w - 10, h - 10)

  }, [bees, trophies, myBeeId, selectedZone])

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const loop = () => {
      timeRef.current = Date.now()
      const w = canvas.width
      const h = canvas.height
      draw(ctx, w, h)
      animRef.current = requestAnimationFrame(loop)
    }
    animRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(animRef.current)
  }, [draw])

  // Resize
  useEffect(() => {
    const resize = () => {
      const canvas = canvasRef.current
      const container = containerRef.current
      if (!canvas || !container) return
      const dpr = window.devicePixelRatio || 1
      const rect = container.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      canvas.style.width = rect.width + 'px'
      canvas.style.height = rect.height + 'px'
      const ctx = canvas.getContext('2d')
      if (ctx) ctx.scale(dpr, dpr)
    }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  // Click handler
  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    if (dragRef.current.dragging) return

    const rect = canvas.getBoundingClientRect()
    const cam = cameraRef.current
    const cx = rect.width / 2 + cam.x
    const cy = rect.height / 2 + cam.y
    const mx = e.clientX - rect.left - cx
    const my = e.clientY - rect.top - cy

    const [q, r] = pixelToHex(mx, my)
    const zone = ZONES.find(z => z.q === q && z.r === r)
    if (zone) onHexClick(q, r, zone)
  }, [onHexClick])

  // Drag to pan
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    dragRef.current = {
      dragging: false,
      startX: e.clientX,
      startY: e.clientY,
      camStartX: cameraRef.current.x,
      camStartY: cameraRef.current.y,
    }
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const d = dragRef.current
    if (d.startX === 0 && d.startY === 0) return
    const dx = e.clientX - d.startX
    const dy = e.clientY - d.startY
    if (Math.abs(dx) + Math.abs(dy) > 5) d.dragging = true
    cameraRef.current.x = d.camStartX + dx
    cameraRef.current.y = d.camStartY + dy
  }, [])

  const handleMouseUp = useCallback(() => {
    setTimeout(() => { dragRef.current = { dragging: false, startX: 0, startY: 0, camStartX: 0, camStartY: 0 } }, 50)
  }, [])

  // Touch handlers for mobile
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length !== 1) return
    const t = e.touches[0]
    dragRef.current = {
      dragging: false,
      startX: t.clientX,
      startY: t.clientY,
      camStartX: cameraRef.current.x,
      camStartY: cameraRef.current.y,
    }
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length !== 1) return
    const t = e.touches[0]
    const d = dragRef.current
    if (d.startX === 0 && d.startY === 0) return
    const dx = t.clientX - d.startX
    const dy = t.clientY - d.startY
    if (Math.abs(dx) + Math.abs(dy) > 8) d.dragging = true
    cameraRef.current.x = d.camStartX + dx
    cameraRef.current.y = d.camStartY + dy
    e.preventDefault() // prevent page scroll while panning
  }, [])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const d = dragRef.current
    if (!d.dragging && e.changedTouches.length === 1) {
      // Tap — treat as click
      const t = e.changedTouches[0]
      const canvas = canvasRef.current
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      const cam = cameraRef.current
      const cx = rect.width / 2 + cam.x
      const cy = rect.height / 2 + cam.y
      const mx = t.clientX - rect.left - cx
      const my = t.clientY - rect.top - cy
      const [q, r] = pixelToHex(mx, my)
      const zone = ZONES.find(z => z.q === q && z.r === r)
      if (zone) onHexClick(q, r, zone)
    }
    setTimeout(() => { dragRef.current = { dragging: false, startX: 0, startY: 0, camStartX: 0, camStartY: 0 } }, 50)
  }, [onHexClick])

  return (
    <div ref={containerRef} className="w-full h-full relative cursor-grab active:cursor-grabbing touch-none">
      <canvas
        ref={canvasRef}
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="block w-full h-full"
      />
    </div>
  )
}
