import { useEffect, useState } from "react";
import { auth, db } from "@/lib/config/firebaseConfig";
import {
    doc,
    getDoc,
    collection,
    getDocs
} from "firebase/firestore";

import { InternshipCards } from "@/lib/types/internshipCards";
import { UserPreferences } from "@/lib/types/userPreferences";
import { scoreInternship } from "@/lib/modules/scoreInternship.algorithm";

// export const useRecommendedInternships = () => {
//   const [recommended, setRecommended] = useState<InternshipCards[]>([]);

//   useEffect(() => {
//     const fetchRecommendations = async () => {
//       const user = auth.currentUser;
//       if (!user) return;

//       const userSnap = await getDoc(doc(db, "users", user.uid));
//       const userData = userSnap.data();

//       if (!userData || !userData.preferences) return;

//       const prefs: UserPreferences = userData.preferences;

//       const internshipsSnap = await getDocs(collection(db, "internships"));
//       const internships: InternshipCards[] = [];

//       internshipsSnap.forEach((docSnap) => {
//         const raw = docSnap.data() as Omit<InternshipCards, "id">;
//         internships.push({ id: docSnap.id, ...raw });
//       });

//       const scored = internships.map((internship) => {
//         const score = scoreInternship(internship, prefs);
//         return { ...internship, score };
//       });

//       scored.sort((a, b) => b.score - a.score);
//       setRecommended(scored.slice(0, 5));
//     };

//     fetchRecommendations();
//   }, []);

//   return recommended;
// };

export function useRecommendedInternships(): InternshipCards[] {
    const [recommended, setRecommended] = useState<InternshipCards[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            // fetch real internships from Firestore
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

            // Suppose you have your scoring function and preferences logic here
            // For demo: just pick top 5 by some scoring or criteria
            // You can replace this with your actual recommendation logic
            const scored = allInternshipsData.map((internship) => ({
                ...internship,
                score: Math.random(), // dummy score — replace with your real scoring fn
            }));

            scored.sort((a, b) => b.score - a.score);

            // Filter out bookmarked
            const recommendedFiltered = scored
                .filter((internship) => !bookmarked[internship.id])
                .slice(0, 5);

            setRecommended(recommendedFiltered);

            setLoading(false);
        }

        fetchData();
    }, [bookmarked]);

    // Prepare fallback internships filtered by bookmarked
    const fallback = allInternships.filter(
        (internship) => !bookmarked[internship.id]
    );

    // Decide what to show: recommended if any, else fallback
    const internshipsToShow =
        recommended.length > 0 ? recommended : fallback.slice(0, 5);

    return { internshipsToShow, loading };
}
