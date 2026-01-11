'use client';

import { useRouter } from "next/navigation";

export function useSearchNavigation() {
    const router = useRouter();

    const handleSearch = (value: string) => {
        e.preventDefault();
        if (!value.trim()) {
            router.push(`/pages/internships?search=${encodeURIComponent(searchTerm.trim())}`);
        }
    };
}