import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '@/components/PageHeader/PageHeader'
import { PokemonCard } from '@/components/PokemonCard/PokemonCard'
import { SearchBar } from '@/components/SearchBar/SearchBar'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import { usePokemonStore } from '@/stores/pokemonStore'
import { homePageStyles } from './HomePage.styles'

export function HomePage() {
  const navigate = useNavigate()
  const {
    items,
    hasMore,
    isLoading,
    isLoadingMore,
    isSearchActive,
    searchQuery,
    errorMessage,
    loadInitialList,
    loadMore,
    searchByName,
    clearSearch,
  } = usePokemonStore()

  useEffect(() => {
    void loadInitialList()
  }, [loadInitialList])

  const sentinelRef = useInfiniteScroll({
    onLoadMore: () => {
      void loadMore()
    },
    hasMore: hasMore && !isSearchActive,
    isLoading: isLoading || isLoadingMore,
  })

  const handleSearch = (query: string) => {
    if (!query) {
      void clearSearch()
      return
    }
    void searchByName(query)
  }

  return (
    <main className={homePageStyles.page}>
      <PageHeader title="Pokédex" />
      <section className={homePageStyles.searchSection}>
        <SearchBar initialValue={searchQuery} onSearch={handleSearch} />
      </section>

      {errorMessage && <p className={homePageStyles.errorText}>{errorMessage}</p>}

      {isLoading && items.length === 0 ? (
        <p className={homePageStyles.loadingText}>Loading pokemon...</p>
      ) : (
        <>
          <section className={homePageStyles.grid}>
            {items.map((pokemon) => (
              <PokemonCard
                key={pokemon.id}
                pokemon={pokemon}
                onClick={(pokemonId) => navigate(`/pokemon/${pokemonId}`)}
              />
            ))}
          </section>

          {!isLoading && items.length === 0 && (
            <p className={homePageStyles.emptyText}>No pokemon found for this search.</p>
          )}

          {!isSearchActive && <div ref={sentinelRef} className={homePageStyles.sentinel} />}
          {isLoadingMore && <p className={homePageStyles.loadingText}>Loading more pokemon...</p>}
        </>
      )}
    </main>
  )
}
