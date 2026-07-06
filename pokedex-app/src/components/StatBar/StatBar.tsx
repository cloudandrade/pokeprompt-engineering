import { STAT_BAR_MAX_VALUE, statBarStyles } from './StatBar.styles'

interface StatBarProps {
  label: string
  value: number
  color: string
}

export function StatBar({ label, value, color }: StatBarProps) {
  const widthPercentage = Math.min(100, Math.round((value / STAT_BAR_MAX_VALUE) * 100))

  return (
    <div className={statBarStyles.row}>
      <span className={statBarStyles.label}>{label}</span>
      <span className={statBarStyles.value}>{value}</span>
      <div className={statBarStyles.track}>
        <div
          className={statBarStyles.fill}
          style={{ width: `${widthPercentage}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}
