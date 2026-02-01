"use client";

import { useEffect, useRef, useState } from "react";
import { InternshipCards } from "@/lib/interfaces/internshipCards";
import { fetchInternshipsPage } from "@/lib/modules/fetchInternshipsPaginated";
import { QueryDocumentSnapshot, DocumentData } from "firebase/firestore";

export function useInternshipsPaginated() {
    const [internships, setInternships] = useState<InternshipCards[]>([]);
    const [lastDoc, setLastDoc] =
        useState<QueryDocumentSnapshot<DocumentData> | null>(null);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const sentinelRef = useRef<HTMLDivElement | null>(null);

    async function loadNext() {
        if (loading || !hasMore) return;

        setLoading(true);
        const res = await fetchInternshipsPage(lastDoc);

        setInternships(prev => [...prev, ...res.internships]);
        setLastDoc(res.lastDoc);
        setHasMore(res.hasMore);
        setLoading(false);
    }

    /** initial load */
    useEffect(() => {
        loadNext();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /** infinite scroll observer */
    useEffect(() => {
        if (!sentinelRef.current || !hasMore) return;

        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting) {
                    loadNext();
                }
            },
            { rootMargin: "300px" }
        );

        observer.observe(sentinelRef.current);
        return () => observer.disconnect();
    }, [hasMore, lastDoc]);

    return {
        internships,
        loading,
        hasMore,
        sentinelRef,
    };
}
