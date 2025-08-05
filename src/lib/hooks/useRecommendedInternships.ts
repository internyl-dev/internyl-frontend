import { useEffect, useState } from "react";
import { db } from "@/lib/config/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

import { InternshipCards } from "@/lib/types/internshipCards";

export function useRecommendedInternships(): InternshipCards[] {
    const [recommended, setRecommended] = useState<InternshipCards[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            // Fetch internships from Firestore
            const snapshot = await getDocs(collection(db, "internships"));
            const internships = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as InternshipCards[];

            // Optionally apply filtering or ranking here
            setRecommended(internships.slice(0, 5)); // Take top 5 for now
        };

        fetchData();
    }, []);

    return recommended;
}

export function useInternshipsWithFallback(bookmarked: { [key: string]: boolean }) {
    const [recommended, setRecommended] = useState<InternshipCards[]>([]);
    const [allInternships, setAllInternships] = useState<InternshipCards[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);

            // Fetch all internships
            const allSnap = await getDocs(collection(db, "internships"));
            const allInternshipsData = allSnap.docs.map(doc => ({
                ...(doc.data() as InternshipCards),
                id: doc.id,
            }));

            setAllInternships(allInternshipsData);

            // Dummy scoring function for demo; replace with real scoring
            const scored = allInternshipsData.map((internship) => ({
                ...internship,
                score: Math.random(),
            }));

            scored.sort((a, b) => b.score - a.score);

            // Filter out bookmarked internships and take top 5
            const recommendedFiltered = scored
                .filter((internship) => !bookmarked[internship.id])
                .slice(0, 5);

            setRecommended(recommendedFiltered);
            setLoading(false);
        }

        fetchData();
    }, [bookmarked]);

    // Fallback internships excluding bookmarked
    const fallback = allInternships.filter(
        (internship) => !bookmarked[internship.id]
    );

    // Show recommended if available, else fallback
    const internshipsToShow =
        recommended.length > 0 ? recommended : fallback.slice(0, 5);

    return { internshipsToShow, loading };
}
