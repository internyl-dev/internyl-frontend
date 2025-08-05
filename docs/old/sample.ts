import { InternshipCards } from "@/lib/types/internshipCards";

export const sampleInternshipData: InternshipCards[] = [
    {
        id: "internship1",
        title: "Sewer Cleaning",
        provider: "Random University",
        description: "With this opportunity you are able to clean the sewers of New York City.",

        deadlines: [
            {
                name: "Application deadline",
                priority: "high",
                date: new Date("2025-10-04"),
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

        tags: ["public service", "humanitarian", "random university", "sewer cleaning"],

        link: "https://randomuniversity.edu/sewer-cleaning",

        contact: {
            email: "support@clean.ru.edu",
            phone: "not provided",
        },
    },

    {
        id: "internship2",
        title: "Machine Learning",
        provider: "NYU",
        description: "Introductory hands-on experience in machine learning using Python and TensorFlow.",

        deadlines: [
            {
                name: "Application deadline",
                priority: "high",
                date: new Date("2025-06-29"),
                rollingBasis: false,
                time: "11:59 PM EST",
            },
        ],

        subject: "Computer Science",

        eligibility: {
            rising: true,
            grades: ["sophomore", "junior", "senior"],
            age: {
                minimum: 14,
                maximum: 18,
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
                term: "Summer",
                start: new Date("2025-07-01"),
                end: new Date("2025-07-26"),
            },
        ],

        duration_weeks: 4,

        cost: "$3050 + Housing fee",

        stipend: {
            available: false,
            amount: null,
        },

        requirements: {
            essay_required: true,
            recommendation_required: true,
            transcript_required: true,
            other: [],
        },

        tags: ["AI", "Python", "tech", "college credit", "NYU"],

        link: "https://nyu.edu/ml-summer",

        contact: {
            email: "summer@nyu.edu",
            phone: "212-998-2000",
        },
    },

    {
        id: "internship3",
        title: "NYC Residential Summer",
        provider: "Columbia",
        description: "Live and learn on Columbia's campus with access to top-tier academic and social opportunities.",

        deadlines: [
            {
                name: "Application deadline",
                priority: "high",
                date: new Date("2025-05-15"),
                rollingBasis: false,
                time: "11:59 PM EST",
            },
        ],

        subject: "Various",

        eligibility: {
            rising: false,
            grades: ["junior", "senior"],
            age: {
                minimum: 16,
                maximum: 18,
            },
        },

        location: [
            {
                virtual: false,
                state: "New York",
                city: "New York City",
                address: "116th St & Broadway",
            },
        ],

        dates: [
            {
                term: "Summer",
                start: new Date("2025-07-10"),
                end: new Date("2025-08-01"),
            },
        ],

        duration_weeks: 3,

        cost: "$4400",

        stipend: {
            available: false,
            amount: null,
        },

        requirements: {
            essay_required: true,
            recommendation_required: true,
            transcript_required: true,
            other: [],
        },

        tags: ["Columbia", "residential", "college prep", "various subjects"],

        link: "https://precollege.columbia.edu/summer",

        contact: {
            email: "summersessions@columbia.edu",
            phone: "212-854-9889",
        },
    },

    {
        id: "internship4",
        title: "Intro to Civil Engineering",
        provider: "MITx Virtual Lab",
        description: "Discover how infrastructure shapes society and gain foundational civil engineering skills.",

        deadlines: [
            {
                name: "Priority Deadline",
                priority: "medium",
                date: new Date("2025-04-20"),
                rollingBasis: true,
                time: "not provided",
            },
        ],

        subject: "Engineering",

        eligibility: {
            rising: true,
            grades: ["junior", "senior"],
            age: {
                minimum: 15,
                maximum: 18,
            },
        },

        location: [
            {
                virtual: true,
                state: "",
                city: "",
                address: "",
            },
        ],

        dates: [
            {
                term: "Summer",
                start: new Date("2025-07-15"),
                end: new Date("2025-08-15"),
            },
        ],

        duration_weeks: 5,

        cost: "free",

        stipend: {
            available: true,
            amount: 500,
        },

        requirements: {
            essay_required: false,
            recommendation_required: false,
            transcript_required: false,
            other: [],
        },

        tags: ["engineering", "virtual", "MIT", "infrastructure"],

        link: "https://mitx.mit.edu/civil-engineering",

        contact: {
            email: "virtualprograms@mit.edu",
            phone: "not provided",
        },
    },

    {
        id: "internship5",
        title: "Climate Justice Youth Lab",
        provider: "Berkeley Environmental Institute",
        description: "Collaborate with youth activists and scientists on real-world climate justice campaigns.",

        deadlines: [
            {
                name: "Application Deadline",
                priority: "high",
                date: new Date("2025-05-20"),
                rollingBasis: false,
                time: "11:59 PM PST",
            },
        ],

        subject: "Environmental Science",

        eligibility: {
            rising: true,
            grades: ["sophomore", "junior", "senior"],
            age: {
                minimum: 15,
                maximum: 18,
            },
        },

        location: [
            {
                virtual: true,
                state: "",
                city: "",
                address: "",
            },
        ],

        dates: [
            {
                term: "Summer",
                start: new Date("2025-06-20"),
                end: new Date("2025-08-01"),
            },
        ],

        duration_weeks: 6,

        cost: "free",

        stipend: {
            available: true,
            amount: 750,
        },

        requirements: {
            essay_required: true,
            recommendation_required: true,
            transcript_required: false,
            other: ["Video introduction"],
        },

        tags: ["climate", "justice", "activism", "virtual", "Berkeley"],

        link: "https://environment.berkeley.edu/youthlab",

        contact: {
            email: "youthlab@berkeley.edu",
            phone: "510-555-3281",
        },
    },

    {
        id: "internship6",
        title: "AI4ALL Summer Lab",
        provider: "Stanford University",
        description: "A summer program introducing high school students from underrepresented backgrounds to artificial intelligence through hands-on projects and mentorship.",

        deadlines: [
            {
                name: "Application Deadline",
                priority: "high",
                date: new Date("2025-03-31"),
                rollingBasis: false,
                time: "11:59 PM PST",
            },
        ],

        subject: "Artificial Intelligence",

        eligibility: {
            rising: true,
            grades: ["junior", "senior"],
            age: {
                minimum: 15,
                maximum: 18,
            },
        },

        location: [
            {
                virtual: true,
                state: "",
                city: "",
                address: "",
            },
        ],

        dates: [
            {
                term: "Summer",
                start: new Date("2025-07-08"),
                end: new Date("2025-08-02"),
            },
        ],

        duration_weeks: 4,

        cost: "free",

        stipend: {
            available: false,
            amount: null,
        },

        requirements: {
            essay_required: true,
            recommendation_required: true,
            transcript_required: false,
            other: ["Short answer questions"],
        },

        tags: ["AI", "underrepresented", "virtual", "Stanford", "computer science"],

        link: "https://ai-4-all.org/programs/stanford",

        contact: {
            email: "ai4all@cs.stanford.edu",
            phone: "not provided",
        },
    },

    {
        id: "internship7",
        title: "Summer Journalism Academy",
        provider: "Boston University",
        description: "An immersive two-week program for high schoolers interested in journalism, reporting, and media production.",

        deadlines: [
            {
                name: "Application Deadline",
                priority: "high",
                date: new Date("2025-04-10"),
                rollingBasis: true,
                time: "not provided",
            },
        ],

        subject: "Journalism",

        eligibility: {
            rising: true,
            grades: ["sophomore", "junior", "senior"],
            age: {
                minimum: 14,
                maximum: 18,
            },
        },

        location: [
            {
                virtual: false,
                state: "Massachusetts",
                city: "Boston",
                address: "640 Commonwealth Avenue",
            },
        ],

        dates: [
            {
                term: "Summer",
                start: new Date("2025-07-07"),
                end: new Date("2025-07-21"),
            },
        ],

        duration_weeks: 2,

        cost: "$3000",

        stipend: {
            available: false,
            amount: null,
        },

        requirements: {
            essay_required: true,
            recommendation_required: false,
            transcript_required: false,
            other: [],
        },

        tags: ["writing", "journalism", "Boston", "media"],

        link: "https://combeyond.bu.edu/journalism-academy",

        contact: {
            email: "summer@bu.edu",
            phone: "617-353-1378",
        },
    },

    {
        id: "internship8",
        title: "Pre-College Program in Neuroscience",
        provider: "University of Pennsylvania",
        description: "Study the brain and nervous system through lectures, labs, and neuroscience research projects on Penn’s campus.",

        deadlines: [
            {
                name: "Application Deadline",
                priority: "high",
                date: new Date("2025-05-01"),
                rollingBasis: false,
                time: "not provided",
            },
        ],

        subject: "Neuroscience",

        eligibility: {
            rising: true,
            grades: ["junior", "senior"],
            age: {
                minimum: 16,
                maximum: 18,
            },
        },

        location: [
            {
                virtual: false,
                state: "Pennsylvania",
                city: "Philadelphia",
                address: "3451 Walnut Street",
            },
        ],

        dates: [
            {
                term: "Summer",
                start: new Date("2025-07-01"),
                end: new Date("2025-07-26"),
            },
        ],

        duration_weeks: 4,

        cost: "$4750",

        stipend: {
            available: false,
            amount: null,
        },

        requirements: {
            essay_required: true,
            recommendation_required: true,
            transcript_required: true,
            other: [],
        },

        tags: ["neuroscience", "medicine", "biology", "Penn", "pre-college"],

        link: "https://summer.sas.upenn.edu/programs/high-school/pre-college",

        contact: {
            email: "hsprogs@sas.upenn.edu",
            phone: "215-898-7326",
        },
    },

    {
        id: "internship9",
        title: "Girls Who Code Summer Immersion",
        provider: "Girls Who Code",
        description: "Free 2-week virtual summer program that teaches high school girls coding, design thinking, and career prep.",

        deadlines: [
            {
                name: "Application Deadline",
                priority: "high",
                date: new Date("2025-03-20"),
                rollingBasis: true,
                time: "not provided",
            },
        ],

        subject: "Computer Science",

        eligibility: {
            rising: true,
            grades: ["sophomore", "junior", "senior"],
            age: {
                minimum: 15,
                maximum: 18,
            },
        },

        location: [
            {
                virtual: true,
                state: "",
                city: "",
                address: "",
            },
        ],

        dates: [
            {
                term: "Summer",
                start: new Date("2025-07-10"),
                end: new Date("2025-07-24"),
            },
        ],

        duration_weeks: 2,

        cost: "free",

        stipend: {
            available: true,
            amount: 300,
        },

        requirements: {
            essay_required: false,
            recommendation_required: false,
            transcript_required: false,
            other: ["Demographic eligibility"],
        },

        tags: ["coding", "girls", "tech", "virtual", "career prep"],

        link: "https://girlswhocode.com/programs/summer-immersion-program",

        contact: {
            email: "summer@girlswhocode.com",
            phone: "not provided",
        },
    },

    {
        id: "internship10",
        title: "NASA SEES Internship",
        provider: "NASA & UT Austin",
        description: "Participate in authentic NASA Earth and space science research as a high school student, virtually and in Austin.",

        deadlines: [
            {
                name: "Application Deadline",
                priority: "high",
                date: new Date("2025-02-21"),
                rollingBasis: false,
                time: "11:59 PM CST",
            },
        ],

        subject: "Space Science",

        eligibility: {
            rising: true,
            grades: ["junior"],
            age: {
                minimum: 16,
                maximum: 18,
            },
        },

        location: [
            {
                virtual: true,
                state: "Texas",
                city: "Austin",
                address: "The University of Texas at Austin",
            },
        ],

        dates: [
            {
                term: "Summer",
                start: new Date("2025-06-24"),
                end: new Date("2025-07-26"),
            },
        ],

        duration_weeks: 5,

        cost: "free",

        stipend: {
            available: true,
            amount: 1000,
        },

        requirements: {
            essay_required: true,
            recommendation_required: true,
            transcript_required: true,
            other: ["Resume", "Parent/Guardian consent"],
        },

        tags: ["NASA", "space", "research", "Texas", "STEM"],

        link: "https://www.csr.utexas.edu/sees-internship",

        contact: {
            email: "sees@csr.utexas.edu",
            phone: "not provided",
        },
    },

    {
        id: "internship11",
        title: "Urban Sustainability Internship",
        provider: "Green Future Institute",
        description: "Work on community projects to improve urban green spaces and sustainability practices.",
        deadlines: [
            {
                name: "Application Deadline",
                priority: "medium",
                date: new Date("2025-07-10"),  // Near future
                rollingBasis: false,
                time: "5:00 PM EST",
            },
        ],
        subject: "Environmental Science",
        eligibility: {
            rising: true,
            grades: ["junior", "senior"],
            age: { minimum: 16, maximum: 18 },
        },
        location: [
            {
                virtual: false,
                state: "California",
                city: "San Francisco",
                address: "123 Greenway Blvd",
            },
        ],
        dates: [
            {
                term: "Summer",
                start: new Date("2025-07-15"),
                end: new Date("2025-08-15"),
            },
        ],
        duration_weeks: 4,
        cost: "free",
        stipend: { available: true, amount: 1000 },
        requirements: {
            essay_required: true,
            recommendation_required: true,
            transcript_required: false,
            other: ["Background check"],
        },
        tags: ["sustainability", "community", "environment", "green"],
        link: "https://greenfuture.org/urban-sustainability",
        contact: { email: "info@greenfuture.org", phone: "415-555-1234" },
    },

    {
        id: "internship12",
        title: "Tech Innovators Bootcamp",
        provider: "TechNation",
        description: "An intensive bootcamp introducing high school students to software development and innovation.",
        deadlines: [
            {
                name: "Rolling Application",
                priority: "low",
                date: null, // rolling, no specific date
                rollingBasis: true,
                time: "not provided",
            },
        ],
        subject: "Computer Science",
        eligibility: {
            rising: false,
            grades: ["sophomore", "junior", "senior"],
            age: { minimum: 15, maximum: 19 },
        },
        location: [
            {
                virtual: true,
                state: "",
                city: "",
                address: "",
            },
        ],
        dates: [
            {
                term: "Fall",
                start: new Date("2025-09-01"),
                end: new Date("2025-12-15"),
            },
        ],
        duration_weeks: 15,
        cost: "$1200",
        stipend: { available: false, amount: null },
        requirements: {
            essay_required: false,
            recommendation_required: false,
            transcript_required: true,
            other: ["Laptop required"],
        },
        tags: ["bootcamp", "coding", "virtual", "tech"],
        link: "https://technation.org/bootcamp",
        contact: { email: "contact@technation.org", phone: "not provided" },
    },

    {
        id: "internship13",
        title: "Historic Preservation Internship",
        provider: "Heritage Society",
        description: "Assist with preservation projects and historical research in local communities.",
        deadlines: [
            {
                name: "Application Deadline",
                priority: "high",
                date: new Date("2025-04-15"),  // past date
                rollingBasis: false,
                time: "11:59 PM CST",
            },
        ],
        subject: "History",
        eligibility: {
            rising: false,
            grades: ["senior"],
            age: { minimum: 17, maximum: 18 },
        },
        location: [
            {
                virtual: false,
                state: "Illinois",
                city: "Chicago",
                address: "456 Heritage St.",
            },
        ],
        dates: [
            {
                term: "Spring",
                start: new Date("2025-03-01"),
                end: new Date("2025-05-31"),
            },
        ],
        duration_weeks: 13,
        cost: "free",
        stipend: { available: false, amount: null },
        requirements: {
            essay_required: true,
            recommendation_required: false,
            transcript_required: true,
            other: [],
        },
        tags: ["history", "preservation", "research"],
        link: "https://heritagesociety.org/internship",
        contact: { email: "info@heritagesociety.org", phone: "312-555-7890" },
    },
];
