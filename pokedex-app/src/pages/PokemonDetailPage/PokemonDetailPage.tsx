import { ArrowLeft, Heart } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PokeballWatermark } from '@/components/PokeballWatermark/PokeballWatermark'
import { StatBar } from '@/components/StatBar/StatBar'
import { TypeBadgeList } from '@/components/TypeBadge/TypeBadge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { capitalizeName, formatPokemonId, getPrimaryTypeColor } from '@/lib/typeColors'
import {
  getPokemonSpriteUrl,
  getPrimaryTypeName,
  type PokemonSummary,
} from '@/schemas/pokemon.schema'
import { fetchPokemonById } from '@/services/pokeApiService'
import { pokemonDetailPageStyles, STAT_COLORS } from './PokemonDetailPage.styles'

type DetailTab = 'about' | 'stats'

export function PokemonDetailPage() {
  const navigate = useNavigate()
  const { pokemonId } = useParams<{ pokemonId: string }>()
  const [pokemon, setPokemon] = useState<PokemonSummary | null>(null)
  const [activeTab, setActiveTab] = useState<DetailTab>('about')
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!pokemonId) {
      return
    }

    let isMounted = true

    const loadPokemon = async () => {
      setIsLoading(true)
      setErrorMessage(null)
      try {
        const data = await fetchPokemonById(pokemonId)
        if (isMounted) {
          setPokemon(data)
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error instanceof Error ? error.message : 'Failed to load pokemon details')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void loadPokemon()

    return () => {
      isMounted = false
    }
  }, [pokemonId])

  if (!pokemonId) {
    return (
      <div className={pokemonDetailPageStyles.error}>
        <p>Pokemon id is required</p>
        <Button className="mt-4" onClick={() => navigate('/')}>
          Back to list
        </Button>
      </div>
    )
  }

  if (isLoading) {
    return <div className={pokemonDetailPageStyles.loading}>Loading pokemon details...</div>
  }

  if (errorMessage || !pokemon) {
    return (
      <div className={pokemonDetailPageStyles.error}>
        <p>{errorMessage ?? 'Pokemon not found'}</p>
        <Button className="mt-4" onClick={() => navigate('/')}>
          Back to list
        </Button>
      </div>
    )
  }

  const primaryType = getPrimaryTypeName(pokemon)
  const heroColor = getPrimaryTypeColor(primaryType)
  const spriteUrl = getPokemonSpriteUrl(pokemon)
  const typeNames = pokemon.types.map((entry) => entry.type.name)
  const visibleAbilities = pokemon.abilities
    .map((entry) => capitalizeName(entry.ability.name.replace('-', ' ')))
    .join(', ')

  return (
    <main className={pokemonDetailPageStyles.page}>
      <section className={pokemonDetailPageStyles.hero} style={{ backgroundColor: heroColor }}>
        <PokeballWatermark />
        <div className={pokemonDetailPageStyles.heroTop}>
          <Button variant="ghost" size="icon" onClick={() => navigate('/')} aria-label="Go back">
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <span className={pokemonDetailPageStyles.heroId}>{formatPokemonId(pokemon.id)}</span>
          <Button variant="ghost" size="icon" aria-label="Favorite pokemon">
            <Heart className="h-6 w-6" />
          </Button>
        </div>

        <h1 className={pokemonDetailPageStyles.heroName}>{pokemon.name}</h1>
        <TypeBadgeList types={typeNames} />

        {spriteUrl && (
          <div className={pokemonDetailPageStyles.heroImageWrapper}>
            <img
              src={spriteUrl}
              alt={pokemon.name}
              className={pokemonDetailPageStyles.heroImage}
            />
          </div>
        )}
      </section>

      <section className={pokemonDetailPageStyles.sheet}>
        <Tabs>
          <TabsList>
            <TabsTrigger
              isActive={activeTab === 'about'}
              onClick={() => setActiveTab('about')}
            >
              About
            </TabsTrigger>
            <TabsTrigger
              isActive={activeTab === 'stats'}
              onClick={() => setActiveTab('stats')}
            >
              Base Stats
            </TabsTrigger>
          </TabsList>

          {activeTab === 'about' && (
            <TabsContent>
              <div className={pokemonDetailPageStyles.aboutGrid}>
                <div className={pokemonDetailPageStyles.aboutItem}>
                  <p className={pokemonDetailPageStyles.aboutLabel}>Height</p>
                  <p className={pokemonDetailPageStyles.aboutValue}>{pokemon.height / 10} m</p>
                </div>
                <div className={pokemonDetailPageStyles.aboutItem}>
                  <p className={pokemonDetailPageStyles.aboutLabel}>Weight</p>
                  <p className={pokemonDetailPageStyles.aboutValue}>{pokemon.weight / 10} kg</p>
                </div>
                <div className={`${pokemonDetailPageStyles.aboutItem} col-span-2`}>
                  <p className={pokemonDetailPageStyles.aboutLabel}>Abilities</p>
                  <p className={pokemonDetailPageStyles.aboutValue}>{visibleAbilities}</p>
                </div>
              </div>
            </TabsContent>
          )}

          {activeTab === 'stats' && (
            <TabsContent>
              {pokemon.stats.map((statEntry) => (
                <StatBar
                  key={statEntry.stat.name}
                  label={statEntry.stat.name.replace('-', ' ')}
                  value={statEntry.base_stat}
                  color={STAT_COLORS[statEntry.stat.name] ?? '#94A3B8'}
                />
              ))}
            </TabsContent>
          )}
        </Tabs>
      </section>
    </main>
  )
}
