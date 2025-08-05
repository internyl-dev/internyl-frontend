import { useState, useEffect } from 'react';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';

interface SearchBarProps {
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  initialValue?: string;
}

export default function SearchBar({ setSearch, initialValue }: SearchBarProps) {
  const [search, setLocalSearch] = useState('');

  useEffect(() => {
    if (initialValue !== undefined) {
      setLocalSearch(initialValue);
      setSearch(initialValue);
    }
  }, [initialValue, setSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(search);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearch(e.target.value);
    setSearch(e.target.value);
  };

  return (
    <div className="pt-30 flex justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-xl relative">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-900">
          <SearchOutlinedIcon />
        </div>
        <input
          type="text"
          value={search}
          onChange={handleChange}
          placeholder="search for internships"
          className="w-full pl-12 pr-6 py-4 text-base bg-white rounded-full shadow-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black transition"
        />
      </form>
    </div>
  );
}
