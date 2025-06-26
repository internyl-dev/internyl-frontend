import { InternshipCards } from "../types/internshipCards";

export const sampleInternshipData: InternshipCards[] = [{
    title: "Sewer Cleaning",
    provider: "Random University",
    description: "With this opportunity you are able to clean the sewers of New York City.",

    deadlines: [
        {
            name: "Application deadline",
            priority: "high",
            date: new Date("2025-06-04"), // MM-DD-YYYY ➝ ISO format
            rollingBasis: false,
            time: "not provided",
        },
    ],

    subject: "Homelessness",

    eligibility: {
        rising: false,
        grades: ["freshman", "sophomore", "junior", "senior"],
        age: {
            minimum: null,
            maximum: null,
        },
    },

    location: [
        {
            virtual: false,
            state: "New York",
            city: "New York City",
            address: "not provided",
        },
    ],

    dates: [
        {
            term: "not provided",
            start: new Date("2025-06-11"),
            end: new Date("2025-06-25"),
        },
    ],

    duration_weeks: 2,

    cost: "free",

    stipend: {
        available: false,
        amount: null,
    },

    requirements: {
        essay_required: true,
        recommendation_required: false,
        transcript_required: false,
        other: ["not provided"],
    },

    tags: [
        "public service",
        "humanitarian",
        "random university",
        "sewer cleaning",
    ],

    link: "https://randomuniversity.edu/sewer-cleaning",

    contact: {
        email: "support@clean.ru.edu",
        phone: "not provided",
    },
}
];
