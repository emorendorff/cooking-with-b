import { useState, useEffect } from 'react'
import { getAllTags } from '../lib/api'

interface SearchBarProps {
  onSearch: (query: string) => void
  onTagsChange: (tags: string[]) => void
  selectedTags: string[]
}

const SearchBar = ({ onSearch, onTagsChange, selectedTags }: SearchBarProps) => {
  const [query, setQuery] = useState('')
  const [availableTags, setAvailableTags] = useState<string[]>([])

  useEffect(() => {
    getAllTags().then(setAvailableTags).catch(console.error)
  }, [])

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    onSearch(value)
  }

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter(t => t !== tag))
    } else {
      onTagsChange([...selectedTags, tag])
    }
  }

  return (
    <div className="mb-6">
      <input
        type="text"
        placeholder="Search recipes..."
        value={query}
        onChange={handleQueryChange}
        className="w-full px-4 py-3 border border-tan rounded-lg text-base mb-3 focus:outline-none focus:border-burgundy"
      />
      {availableTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {availableTags.map(tag => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`border-none rounded-2xl px-3 py-1.5 text-sm cursor-pointer transition-all ${
                selectedTags.includes(tag)
                  ? 'bg-burgundy text-white hover:bg-burgundy-hover'
                  : 'bg-tan text-gray-700 hover:bg-tan-hover'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default SearchBar
