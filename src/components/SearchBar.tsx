import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { getAllTags } from '../lib/api'

const Container = styled.div`
  margin-bottom: 24px;
`

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #c6b7a8;
  border-radius: 8px;
  font-size: 16px;
  margin-bottom: 12px;

  &:focus {
    outline: none;
    border-color: #6a0d2b;
  }
`

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`

const TagChip = styled.button<{ $selected: boolean }>`
  background-color: ${props => props.$selected ? '#6a0d2b' : '#c6b7a8'};
  color: ${props => props.$selected ? 'white' : '#484848'};
  border: none;
  border-radius: 16px;
  padding: 6px 12px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${props => props.$selected ? '#8a1d3b' : '#b5a699'};
  }
`

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
    <Container>
      <SearchInput
        type="text"
        placeholder="Search recipes..."
        value={query}
        onChange={handleQueryChange}
      />
      {availableTags.length > 0 && (
        <TagsContainer>
          {availableTags.map(tag => (
            <TagChip
              key={tag}
              $selected={selectedTags.includes(tag)}
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </TagChip>
          ))}
        </TagsContainer>
      )}
    </Container>
  )
}

export default SearchBar
