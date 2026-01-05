import { useState, useEffect, useRef } from 'react';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';

interface SearchBarProps {
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  initialValue?: string;
  padding?: string;
  suggestions?: string[];
}

export default function SearchBar({ setSearch, initialValue, padding = 'pt-30', suggestions = [] }: SearchBarProps) {
  const [search, setLocalSearch] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialValue !== undefined) {
      setLocalSearch(initialValue);
      setSearch(initialValue);
    }
  }, [initialValue, setSearch]);

  useEffect(() => {
    if (search.trim() === '') {
      setFilteredSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const filtered = suggestions
      .filter(suggestion => 
        suggestion.toLowerCase().includes(search.toLowerCase())
      )
      .slice(0, 8); // Limit to 8 suggestions

    setFilteredSuggestions(filtered);
    setShowSuggestions(filtered.length > 0);
    setSelectedIndex(-1);
  }, [search, suggestions]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(search);
    setShowSuggestions(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearch(e.target.value);
    setSearch(e.target.value);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setLocalSearch(suggestion);
    setSearch(suggestion);
    setShowSuggestions(false);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || filteredSuggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredSuggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        if (selectedIndex >= 0 && selectedIndex < filteredSuggestions.length) {
          e.preventDefault();
          handleSuggestionClick(filteredSuggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  return (
    <div className={`${padding} flex justify-center`}>
      <form onSubmit={handleSubmit} className="w-full max-w-xl relative">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-900">
          <SearchOutlinedIcon />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={search}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (filteredSuggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
          placeholder="search for internships"
          className="w-full pl-12 pr-6 py-4 text-base bg-white rounded-full shadow-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black transition"
          autoComplete="off"
        />
        
        {/* Suggestions Dropdown */}
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div
            ref={suggestionsRef}
            className="absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
          >
            {filteredSuggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSuggestionClick(suggestion)}
                className={`w-full text-left px-6 py-3 hover:bg-gray-50 transition-colors ${
                  index === selectedIndex ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <SearchOutlinedIcon className="text-gray-400" fontSize="small" />
                  <span className="text-gray-800">{suggestion}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </form>
    </div>
  );
}