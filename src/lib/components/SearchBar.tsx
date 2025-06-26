import { useState } from 'react';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';

export default function SearchBar() {
    const [search, setSearch] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Search term:', search);
    };

    return (
        <div className="pt-30 flex justify-center">
            <form onSubmit={handleSubmit} className="w-full max-w-xl relative">
                {/* Magnifying glass icon */}
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-900">
                    <SearchOutlinedIcon />
                </div>

                {/* Input field with left padding for the icon */}
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="search for internships"
                    className="w-full pl-12 pr-6 py-4 text-base bg-white rounded-full shadow-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black transition"
                />
            </form>
        </div>
    );
}
