'use client';

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function useSearchNavigation() {
    const router = useRouter();

    const searchParams = useSearchParams();
    const initialSearch = searchParams.get("search") || "";
    const [searchTerm, setSearchTerm] = useState(initialSearch);

    const handleSearch = (value: React.FormEvent<HTMLFormElement>) => {
        value.preventDefault();
        if (!searchTerm.trim()) {
            router.push(`/pages/internships?search=${encodeURIComponent(searchTerm.trim())}`);
        }
    };
}