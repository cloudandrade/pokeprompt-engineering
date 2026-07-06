import { PokeballWatermark } from '@/components/PokeballWatermark/PokeballWatermark'
import { TypeBadgeList } from '@/components/TypeBadge/TypeBadge'
import { getPrimaryTypeColor } from '@/lib/typeColors'
import {
  getPokemonSpriteUrl,
  getPrimaryTypeName,
  type PokemonSummary,
} from '@/schemas/pokemon.schema'
import { pokemonCardStyles } from './PokemonCard.styles'

interface PokemonCardProps {
  pokemon: PokemonSummary
  onClick: (pokemonId: number) => void
}

export function PokemonCard({ pokemon, onClick }: PokemonCardProps) {
  const primaryType = getPrimaryTypeName(pokemon)
  const backgroundColor = getPrimaryTypeColor(primaryType)
  const spriteUrl = getPokemonSpriteUrl(pokemon)
  const typeNames = pokemon.types.map((entry) => entry.type.name)

  return (
    <button
      type="button"
      className={pokemonCardStyles.button}
      style={{ backgroundColor }}
      onClick={() => onClick(pokemon.id)}
      aria-label={`Open details for ${pokemon.name}`}
    >
      <PokeballWatermark />
      <div className={pokemonCardStyles.content}>
        <div>
          <h3 className={pokemonCardStyles.name}>{pokemon.name}</h3>
          <TypeBadgeList types={typeNames} />
        </div>
      </div>
      {spriteUrl && (
        <div className={pokemonCardStyles.imageWrapper}>
          <img
            src={spriteUrl}
            alt={pokemon.name}
            className={pokemonCardStyles.image}
            loading="lazy"
          />
        </div>
      )}
    </button>
  )
}
