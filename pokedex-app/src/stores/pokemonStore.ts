import { create } from 'zustand'
import {
  DEFAULT_PAGE_SIZE,
  fetchPokemonByName,
  fetchPokemonPage,
} from '@/services/pokeApiService'
import type { PokemonSummary } from '@/schemas/pokemon.schema'

interface PokemonState {
  items: PokemonSummary[]
  offset: number
  hasMore: boolean
  isLoading: boolean
  isLoadingMore: boolean
  isSearchActive: boolean
  searchQuery: string
  errorMessage: string | null
  loadInitialList: () => Promise<void>
  loadMore: () => Promise<void>
  searchByName: (name: string) => Promise<void>
  clearSearch: () => Promise<void>
}

export const usePokemonStore = create<PokemonState>((set, get) => ({
  items: [],
  offset: 0,
  hasMore: true,
  isLoading: false,
  isLoadingMore: false,
  isSearchActive: false,
  searchQuery: '',
  errorMessage: null,

  loadInitialList: async () => {
    set({ isLoading: true, errorMessage: null })
    try {
      const page = await fetchPokemonPage(0, DEFAULT_PAGE_SIZE)
      set({
        items: page.items,
        offset: page.nextOffset,
        hasMore: page.hasMore,
        isSearchActive: false,
        searchQuery: '',
        isLoading: false,
      })
    } catch (error) {
      set({
        isLoading: false,
        errorMessage: error instanceof Error ? error.message : 'Failed to load pokemon list',
      })
    }
  },

  loadMore: async () => {
    const { hasMore, isLoading, isLoadingMore, isSearchActive, offset } = get()
    if (!hasMore || isLoading || isLoadingMore || isSearchActive) {
      return
    }

    set({ isLoadingMore: true, errorMessage: null })
    try {
      const page = await fetchPokemonPage(offset, DEFAULT_PAGE_SIZE)
      set((state) => ({
        items: [...state.items, ...page.items],
        offset: page.nextOffset,
        hasMore: page.hasMore,
        isLoadingMore: false,
      }))
    } catch (error) {
      set({
        isLoadingMore: false,
        errorMessage: error instanceof Error ? error.message : 'Failed to load more pokemon',
      })
    }
  },

  searchByName: async (name: string) => {
    const trimmedName = name.trim()
    if (!trimmedName) {
      await get().clearSearch()
      return
    }

    set({ isLoading: true, errorMessage: null, searchQuery: trimmedName, isSearchActive: true })
    try {
      const pokemon = await fetchPokemonByName(trimmedName)
      set({
        items: [pokemon],
        hasMore: false,
        isLoading: false,
      })
    } catch (error) {
      set({
        items: [],
        hasMore: false,
        isLoading: false,
        errorMessage: error instanceof Error ? error.message : 'Pokemon not found',
      })
    }
  },

  clearSearch: async () => {
    set({ isSearchActive: false, searchQuery: '' })
    await get().loadInitialList()
  },
}))
