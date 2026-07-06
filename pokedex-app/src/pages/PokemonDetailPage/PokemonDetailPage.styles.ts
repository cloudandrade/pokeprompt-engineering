export const pokemonDetailPageStyles = {
  page: 'mx-auto min-h-svh max-w-md bg-slate-100',
  hero: 'relative px-4 pb-24 pt-6 text-white',
  heroTop: 'mb-8 flex items-center justify-between',
  heroId: 'text-sm font-semibold text-white/80',
  heroName: 'text-4xl font-bold capitalize',
  heroImageWrapper: 'pointer-events-none absolute bottom-0 left-1/2 h-44 w-44 -translate-x-1/2 translate-y-1/2',
  heroImage: 'h-full w-full object-contain drop-shadow-2xl',
  sheet: 'relative -mt-16 rounded-t-[2rem] bg-white px-6 pb-10 pt-8 shadow-xl',
  aboutGrid: 'grid grid-cols-2 gap-4',
  aboutItem: 'rounded-2xl bg-slate-50 px-4 py-3',
  aboutLabel: 'text-xs uppercase tracking-wide text-slate-400',
  aboutValue: 'mt-1 text-sm font-semibold capitalize text-slate-900',
  loading: 'flex min-h-svh items-center justify-center text-slate-500',
  error: 'mx-auto max-w-md px-4 py-16 text-center text-red-600',
} as const

export const STAT_COLORS: Record<string, string> = {
  hp: '#FF5959',
  attack: '#F5AC78',
  defense: '#FAE078',
  'special-attack': '#9DB7F5',
  'special-defense': '#A7DB8D',
  speed: '#FA92B2',
}
