import { useEffect, useState } from "react";
import { db } from "@/lib/config/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

import { InternshipCards } from "@/lib/types/internshipCards";
import { UserPreferences } from "@/lib/types/userPreferences";
import { scoreInternship } from "@/lib/modules/scoreInternship.algorithm";

// Accept user preferences as argument
export function useRecommendedInternships(prefs?: UserPreferences): InternshipCards[] {
    const [recommended, setRecommended] = useState<InternshipCards[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Changed from "internships-history" to "programs-display"
                const snapshot = await getDocs(collection(db, "programs-display"));
                const internships = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as InternshipCards[];

                // Score and sort internships using user preferences
                const scored = internships.map((internship) => ({
                    ...internship,
                    score: scoreInternship(internship, prefs),
                }));
                scored.sort((a, b) => b.score - a.score);
                setRecommended(scored.slice(0, 5));
            } catch (error) {
                console.error("Error fetching recommended internships:", error);
                setRecommended([]);
            }
        };
        fetchData();
    }, [prefs]);

    return recommended;
}

export function useInternshipsWithFallback(bookmarked: { [key: string]: boolean }, prefs?: UserPreferences) {
    const [recommended, setRecommended] = useState<InternshipCards[]>([]);
    const [allInternships, setAllInternships] = useState<InternshipCards[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                // Changed from "internships-history" to "programs-display"
                const allSnap = await getDocs(collection(db, "programs-display"));
                const allInternshipsData = allSnap.docs.map(doc => ({
                    ...(doc.data() as InternshipCards),
                    id: doc.id,
                }));
                setAllInternships(allInternshipsData);

                // Use real scoring function
                const scored = allInternshipsData.map((internship) => ({
                    ...internship,
                    score: scoreInternship(internship, prefs),
                }));
                scored.sort((a, b) => b.score - a.score);

                // Filter out bookmarked internships and take top 5
                const recommendedFiltered = scored
                    .filter((internship) => !bookmarked[internship.id])
                    .slice(0, 5);
                setRecommended(recommendedFiltered);
            } catch (error) {
                console.error("Error fetching internships:", error);
                setRecommended([]);
                setAllInternships([]);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [bookmarked, prefs]);

    // Fallback internships excluding bookmarked
    const fallback = allInternships.filter(
        (internship) => !bookmarked[internship.id]
    );
    
    // Show recommended if available, else fallback
    const internshipsToShow =
        recommended.length > 0 ? recommended : fallback.slice(0, 5);
    
    return { internshipsToShow, loading };
}