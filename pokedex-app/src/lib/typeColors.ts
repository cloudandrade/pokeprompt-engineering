const TYPE_COLORS: Record<string, string> = {
  normal: '#AAA67F',
  fire: '#F57D31',
  water: '#6493EB',
  electric: '#F9CF30',
  grass: '#74CB48',
  ice: '#9AD6DF',
  fighting: '#C12239',
  poison: '#A43E9E',
  ground: '#DEC16B',
  flying: '#A891EC',
  psychic: '#FB5584',
  bug: '#A7B723',
  rock: '#B69E31',
  ghost: '#70559B',
  dragon: '#7037FF',
  dark: '#75574C',
  steel: '#B7B7CE',
  fairy: '#E69EAC',
}

const DEFAULT_TYPE_COLOR = '#77BDF8'

export function getPrimaryTypeColor(typeName: string): string {
  return TYPE_COLORS[typeName.toLowerCase()] ?? DEFAULT_TYPE_COLOR
}

export function formatPokemonId(id: number): string {
  return `#${String(id).padStart(3, '0')}`
}

export function capitalizeName(name: string): string {
  return name.charAt(0).toUpperCase() + name.slice(1)
}
