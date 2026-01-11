import { InternshipCards } from "@/lib/types/internshipCards";

export const sampleInternshipData: InternshipCards[] = [
    {
        id: "sample-internship-1",
        overview: {
            title: "NYC Residential Summer",
            provider: "Columbia University",
            description:
                "For a truly immersive college experience, students who are 15 years of age or older are eligible to reside on our Morningside Campus: a serene academic community where they will always be mere steps away from classrooms, libraries, amenities—and New York City.",
            link: "https://precollege.sps.columbia.edu/programs/summer-programs/nyc-residential-summer",
            subject: [],
            tags: ["residential"],
        },

        eligibility: {
            requirements: {
                essay_required: "not provided",
                recommendation_required: "not provided",
                transcript_required: "not provided",
                other: [
                    "Must be 15 years of age or older and turn 16 by December 31 of the attendance year",
                ],
            },
            eligibility: {
                grades: ["not provided"],
                age: {
                    minimum: 15,
                    maximum: "not provided",
                },
            },
        },

        dates: {
            deadlines: [
                {
                    name: "not provided",
                    priority: "not provided",
                    term: "not provided",
                    date: "not provided",
                    rolling_basis: "not provided",
                    time: "not provided",
                },
            ],
            dates: [
                {
                    term: "Session A Summer 2025",
                    start: "06-30-2025",
                    end: "07-18-2025",
                },
                {
                    term: "Session B Summer 2025",
                    start: "07-22-2025",
                    end: "08-08-2025",
                },
                {
                    term: "Session AB Summer 2025",
                    start: "06-30-2025",
                    end: "08-08-2025",
                },
            ],
            duration_weeks: 3,
        },

        locations: {
            locations: [
                {
                    virtual: false,
                    state: "New York",
                    city: "New York City",
                    address: "not provided",
                },
            ],
        },

        costs: {
            costs: [
                {
                    name: "Program Cost",
                    free: false,
                    lowest: 12764,
                    highest: 12764,
                    "financial-aid-available": "not provided",
                },
            ],
            stipend: {
                available: "not provided",
                amount: "not provided",
            },
        },

        contact: {
            contact: {
                email: "hsp@columbia.edu",
                phone: "212-853-7400",
            },
        },
    }
]