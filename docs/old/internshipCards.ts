export interface Deadline {
  name: string; // e.g. "application deadline" or "none"
  priority: "high" | "medium" | "low" | "none";
  date: Date | null; // Use Date object or null if "not provided"
  rollingBasis: boolean;
  time: string; // e.g. "morning", "12:30 PM", or "not provided"
  timeRemaining?: string;
}

export type Grade = "freshman" | "sophomore" | "junior" | "senior" | "undergraduate" | "not provided";

export interface AgeRange {
  minimum: number | null; // null if none or not provided
  maximum: number | null;
}

export interface Eligibility {
  rising: boolean;
  grades: Grade[];
  age: AgeRange;
}

export interface Location {
  virtual: boolean;
  state: string;   // e.g. "NY", or "none", or "not provided"
  city: string;    // same options
  address: string; // same options
}

export interface DateRange {
  term: "spring" | "summer" | "fall" | "winter" | string; // string to allow <other> or "not provided"
  start: Date | null;  // Date object or null if "not provided"
  end: Date | null;
}

export interface Stipend {
  available: boolean;
  amount: number | null; // null if "not provided"
}

export interface Requirements {
  essay_required: boolean;
  recommendation_required: boolean;
  transcript_required: boolean;
  other: string[] | ["not provided"];
}

export interface InternshipCards {
  id: string;
  
  title: string;
  provider: string; // or "not provided"
  description: string;
  
  deadlines: Deadline[];

  subject: string; // or "not provided"

  eligibility: Eligibility;

  location: Location[];

  dates: DateRange[];

  duration_weeks: number | null; // null if "not provided"

  cost: number | "free" | "not provided" | string;

  stipend: Stipend;

  requirements: Requirements;

  tags: string[];

  link: string;

  contact: {
    email: string;  // or "not provided"
    phone: string;  // or "not provided"
  };
}
