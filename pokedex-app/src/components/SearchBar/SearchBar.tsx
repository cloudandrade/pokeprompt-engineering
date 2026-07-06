import { Search } from 'lucide-react'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { searchBarStyles } from './SearchBar.styles'

interface SearchBarProps {
  initialValue?: string
  placeholder?: string
  onSearch: (query: string) => void
}

export function SearchBar({
  initialValue = '',
  placeholder = 'Search pokemon by name...',
  onSearch,
}: SearchBarProps) {
  const [query, setQuery] = useState(initialValue)

  const handleSubmit = () => {
    onSearch(query.trim())
  }

  return (
    <div className={searchBarStyles.wrapper}>
      <Input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            handleSubmit()
          }
        }}
        placeholder={placeholder}
        className={searchBarStyles.input}
        aria-label="Search pokemon by name"
      />
      <button
        type="button"
        className={searchBarStyles.button}
        onClick={handleSubmit}
        aria-label="Search"
      >
        <Search className="h-4 w-4" />
      </button>
    </div>
  )
}
