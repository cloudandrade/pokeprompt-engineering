import { useEffect, useRef } from 'react'

interface UseInfiniteScrollOptions {
  onLoadMore: () => void
  hasMore: boolean
  isLoading: boolean
}

export function useInfiniteScroll({
  onLoadMore,
  hasMore,
  isLoading,
}: UseInfiniteScrollOptions) {
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const sentinelElement = sentinelRef.current
    if (!sentinelElement || !hasMore) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry?.isIntersecting && !isLoading) {
          onLoadMore()
        }
      },
      { rootMargin: '120px' },
    )

    observer.observe(sentinelElement)
    return () => observer.disconnect()
  }, [hasMore, isLoading, onLoadMore])

  return sentinelRef
}
