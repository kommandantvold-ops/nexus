'use client'

interface Props {
  used: number
  budget: number
  status: string
  label?: string
  size?: 'sm' | 'md' | 'lg'
}

export default function TokenGauge({ used, budget, status, label, size = 'md' }: Props) {
  const pct = budget > 0 ? Math.min(used / budget, 1) : 0
  const remaining = Math.max(budget - used, 0)

  // Size variants
  const sizes = {
    sm: { w: 80, stroke: 6, font: '10px', numFont: '14px' },
    md: { w: 120, stroke: 8, font: '11px', numFont: '18px' },
    lg: { w: 160, stroke: 10, font: '12px', numFont: '24px' },
  }
  const s = sizes[size]
  const radius = (s.w - s.stroke) / 2
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference * (1 - pct)

  // Color based on usage
  const getColor = () => {
    if (status === 'completed') return '#22C55E'
    if (status === 'failed') return '#EF4444'
    if (status === 'paused') return '#F59E0B'
    if (pct < 0.5) return '#22C55E'   // green
    if (pct < 0.8) return '#F59E0B'   // amber
    return '#EF4444'                    // red
  }

  const color = getColor()

  // Format token numbers
  const fmt = (n: number) => {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
    if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K'
    return n.toString()
  }

  const statusLabel: Record<string, string> = {
    pending: '⏳ Queued',
    active: '🔄 Working',
    paused: '⏸ Paused',
    budget_reached: '🛑 Budget Hit',
    completed: '✅ Done',
    failed: '❌ Failed',
  }

  return (
    <div className="flex flex-col items-center gap-1">
      {/* SVG gauge */}
      <div className="relative" style={{ width: s.w, height: s.w }}>
        <svg width={s.w} height={s.w} className="transform -rotate-90">
          {/* Background track */}
          <circle
            cx={s.w / 2}
            cy={s.w / 2}
            r={radius}
            fill="none"
            stroke="#F5F0E8"
            strokeWidth={s.stroke}
          />
          {/* Progress arc */}
          <circle
            cx={s.w / 2}
            cy={s.w / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={s.stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{ transition: 'stroke-dashoffset 0.5s ease, stroke 0.3s ease' }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span style={{ fontSize: s.numFont }} className="font-bold text-amber-900">
            {fmt(used)}
          </span>
          <span style={{ fontSize: s.font }} className="text-amber-500">
            / {fmt(budget)}
          </span>
        </div>
      </div>

      {/* Status */}
      <div className="text-center">
        <div className="text-xs text-amber-600">{statusLabel[status] || status}</div>
        {label && <div className="text-[10px] text-amber-400 mt-0.5">{label}</div>}
        <div className="text-[10px] text-amber-400">{fmt(remaining)} tokens remaining</div>
      </div>
    </div>
  )
}
