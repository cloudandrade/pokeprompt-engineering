import { pokeballWatermarkStyles } from './PokeballWatermark.styles'

export function PokeballWatermark() {
  return (
    <div className={pokeballWatermarkStyles.container} aria-hidden="true">
      <svg className={pokeballWatermarkStyles.svg} viewBox="0 0 100 100" fill="currentColor">
        <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="4" />
        <path d="M2 50 H98" stroke="currentColor" strokeWidth="4" />
        <circle cx="50" cy="50" r="14" fill="none" stroke="currentColor" strokeWidth="4" />
        <circle cx="50" cy="50" r="7" fill="currentColor" />
      </svg>
    </div>
  )
}
