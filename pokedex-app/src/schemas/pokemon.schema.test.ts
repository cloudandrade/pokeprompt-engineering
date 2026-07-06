import { describe, expect, it } from 'vitest'
import { pokemonSummarySchema } from '@/schemas/pokemon.schema'

describe('pokemonSummarySchema', () => {
  it('parses a valid pokemon payload', () => {
    const parsed = pokemonSummarySchema.parse({
      id: 1,
      name: 'bulbasaur',
      height: 7,
      weight: 69,
      sprites: {
        front_default: 'https://example.com/1.png',
        other: {
          'official-artwork': {
            front_default: 'https://example.com/art/1.png',
          },
        },
      },
      types: [{ slot: 1, type: { name: 'grass' } }],
      stats: [{ base_stat: 45, effort: 0, stat: { name: 'hp' } }],
      abilities: [{ ability: { name: 'overgrow' }, is_hidden: false, slot: 1 }],
    })

    expect(parsed.name).toBe('bulbasaur')
    expect(parsed.id).toBe(1)
  })
})
