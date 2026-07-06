import { z } from 'zod'

const namedResourceSchema = z.object({
  name: z.string(),
})

export const pokemonListResponseSchema = z.object({
  count: z.number(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
  results: z.array(
    z.object({
      name: z.string(),
      url: z.string(),
    }),
  ),
})

export const pokemonTypeSchema = z.object({
  slot: z.number(),
  type: namedResourceSchema,
})

export const pokemonStatSchema = z.object({
  base_stat: z.number(),
  effort: z.number(),
  stat: namedResourceSchema,
})

export const pokemonAbilitySchema = z.object({
  ability: namedResourceSchema,
  is_hidden: z.boolean(),
  slot: z.number(),
})

export const pokemonSpritesSchema = z.object({
  front_default: z.string().nullable(),
  other: z
    .object({
      'official-artwork': z
        .object({
          front_default: z.string().nullable(),
        })
        .optional(),
    })
    .optional(),
})

export const pokemonSummarySchema = z.object({
  id: z.number(),
  name: z.string(),
  height: z.number(),
  weight: z.number(),
  sprites: pokemonSpritesSchema,
  types: z.array(pokemonTypeSchema).min(1),
  stats: z.array(pokemonStatSchema),
  abilities: z.array(pokemonAbilitySchema),
})

export type PokemonListResponse = z.infer<typeof pokemonListResponseSchema>
export type PokemonSummary = z.infer<typeof pokemonSummarySchema>
export type PokemonStat = z.infer<typeof pokemonStatSchema>

export function getPokemonSpriteUrl(pokemon: PokemonSummary): string | null {
  return (
    pokemon.sprites.other?.['official-artwork']?.front_default ??
    pokemon.sprites.front_default
  )
}

export function getPrimaryTypeName(pokemon: PokemonSummary): string {
  return pokemon.types[0]?.type.name ?? 'normal'
}
