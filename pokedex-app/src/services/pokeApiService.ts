import axios from 'axios'
import {
  pokemonListResponseSchema,
  pokemonSummarySchema,
  type PokemonSummary,
} from '@/schemas/pokemon.schema'

const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2'
const DEFAULT_PAGE_SIZE = 20

export const pokeApiClient = axios.create({
  baseURL: POKEAPI_BASE_URL,
  timeout: 15000,
  headers: {
    Accept: 'application/json',
  },
})

function extractPokemonIdFromUrl(url: string): number {
  const match = url.match(/\/pokemon\/(\d+)\/?$/)
  if (!match) {
    throw new Error(`Invalid pokemon URL: ${url}`)
  }
  return Number(match[1])
}

async function fetchPokemonSummaryById(id: number): Promise<PokemonSummary> {
  const response = await pokeApiClient.get(`/pokemon/${id}`)
  return pokemonSummarySchema.parse(response.data)
}

export async function fetchPokemonPage(
  offset = 0,
  limit = DEFAULT_PAGE_SIZE,
): Promise<{ items: PokemonSummary[]; hasMore: boolean; nextOffset: number }> {
  const listResponse = await pokeApiClient.get('/pokemon', {
    params: { limit, offset },
  })
  const list = pokemonListResponseSchema.parse(listResponse.data)

  const items = await Promise.all(
    list.results.map((result) =>
      fetchPokemonSummaryById(extractPokemonIdFromUrl(result.url)),
    ),
  )

  return {
    items,
    hasMore: list.next !== null,
    nextOffset: offset + limit,
  }
}

export async function fetchPokemonById(id: number | string): Promise<PokemonSummary> {
  const response = await pokeApiClient.get(`/pokemon/${id}`)
  return pokemonSummarySchema.parse(response.data)
}

export async function fetchPokemonByName(name: string): Promise<PokemonSummary> {
  const normalizedName = name.trim().toLowerCase()
  if (!normalizedName) {
    throw new Error('Pokemon name is required')
  }
  return fetchPokemonById(normalizedName)
}

export { DEFAULT_PAGE_SIZE }
