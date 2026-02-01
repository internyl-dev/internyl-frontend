import {
    collection,
    query,
    orderBy,
    limit,
    startAfter,
    getDocs,
    QueryDocumentSnapshot,
    DocumentData,
} from "firebase/firestore";
import { db } from "@/lib/config/firebaseConfig";
import { InternshipCards, Deadline } from "@/lib/interfaces/internshipCards";

const COLLECTION_NAME =
    process.env.NEXT_PUBLIC_INTERNSHIPS_COLLECTION_DISPLAY!;
const PAGE_SIZE = 12;

/** Timestamp guard */
function isTimestamp(value: unknown): value is { toDate: () => Date } {
    return (
        value !== null &&
        typeof value === "object" &&
        "toDate" in value &&
        typeof (value as { toDate?: unknown }).toDate === "function"
    );
}

function normalizeInternship(
    docSnap: QueryDocumentSnapshot<DocumentData>
): InternshipCards {
    const data = docSnap.data();

    const deadlines = (data.dates?.deadlines ?? []).map((d: Deadline) => {
        const val = d.date;
        return {
            ...d,
            date: isTimestamp(val)
                ? val.toDate().toISOString().split("T")[0]
                : typeof val === "string"
                    ? val
                    : null,
        };
    });

    return {
        id: docSnap.id,
        overview: data.overview,
        eligibility: data.eligibility,
        dates: { ...data.dates, deadlines },
        locations: data.locations,
        costs: data.costs,
        contact: data.contact,
        metadata: data.metadata,
    };
}

export async function fetchInternshipsPage(
    lastDoc?: QueryDocumentSnapshot<DocumentData> | null
) {
    const q = query(
        collection(db, COLLECTION_NAME),
        orderBy("metadata.date_added", "desc"),
        ...(lastDoc ? [startAfter(lastDoc)] : []),
        limit(PAGE_SIZE)
    );

    const snapshot = await getDocs(q);

    return {
        internships: snapshot.docs.map(normalizeInternship),
        lastDoc: snapshot.docs.at(-1) ?? null,
        hasMore: snapshot.docs.length === PAGE_SIZE,
    };
}
