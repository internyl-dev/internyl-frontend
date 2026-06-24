import { useEffect, useState, useMemo } from "react";
import { db } from "@/lib/config/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

import { InternshipCards } from "@/lib/types/internshipCards";
import { UserPreferences } from "@/lib/types/userPreferences";
import { scoreInternship } from "@/lib/modules/scoreInternship.algorithm";

/** Simple hook for when you just want scored recommendations with no bookmark filtering. */
export function useRecommendedInternships(prefs?: UserPreferences): InternshipCards[] {
    const [allInternships, setAllInternships] = useState<InternshipCards[]>([]);

    // Fetch once — prefs changes don't need a re-fetch, only re-scoring
    useEffect(() => {
        getDocs(collection(db, "programs-display"))
            .then((snap) => {
                setAllInternships(
                    snap.docs.map((d) => ({ id: d.id, ...d.data() } as InternshipCards))
                );
            })
            .catch((err) => console.error("Error fetching internships:", err));
    }, []);

    return useMemo(() => {
        if (!allInternships.length) return [];
        return [...allInternships]
            .map((i) => ({ ...i, _score: scoreInternship(i, prefs) }))
            .sort((a, b) => b._score - a._score)
            .slice(0, 5);
    }, [allInternships, prefs]);
}

/**
 * Fetches all internships once, then reactively scores + filters based on
 * bookmarks and preferences — no extra Firestore calls on bookmark toggles.
 */
export function useInternshipsWithFallback(
    bookmarked: { [key: string]: boolean },
    prefs?: UserPreferences
) {
    const [allInternships, setAllInternships] = useState<InternshipCards[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch ONCE on mount — bookmark/pref changes only trigger re-scoring in useMemo
    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        getDocs(collection(db, "programs-display"))
            .then((snap) => {
                if (cancelled) return;
                setAllInternships(
                    snap.docs.map((d) => ({ ...(d.data() as InternshipCards), id: d.id }))
                );
            })
            .catch((err) => console.error("Error fetching internships:", err))
            .finally(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, []);

    // Score + filter reactively — cheap in-memory operation, no extra network call
    const internshipsToShow = useMemo(() => {
        if (!allInternships.length) return [];
        return [...allInternships]
            .filter((i) => !bookmarked[i.id])
            .map((i) => ({ ...i, _score: scoreInternship(i, prefs) }))
            .sort((a, b) => b._score - a._score)
            .slice(0, 5);
    }, [allInternships, bookmarked, prefs]);

    return { internshipsToShow, loading };
}