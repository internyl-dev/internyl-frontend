// OVERVIEW
export interface Overview {
  title: string;
  provider: string;
  description: string;
  link: string;
  subject: string[];
  tags: string[];
}

// REQUIREMENTS
export interface Requirements {
  essay_required: boolean | "not provided";
  recommendation_required: boolean | "not provided";
  transcript_required: boolean | "not provided";
  other: string[];
}

// ELIGIBILITY
export type Grade =
  | "freshman"
  | "sophomore"
  | "junior"
  | "senior"
  | "undergraduate"
  | "not provided";

export interface AgeRange {
  minimum: number | "not provided";
  maximum: number | "not provided";
}

export interface EligibilityDetails {
  grades: Grade[];
  age: AgeRange;
}

export interface EligibilitySection {
  requirements: Requirements;
  eligibility: EligibilityDetails;
}

// DEADLINE
export interface Deadline {
  name: string;
  priority: "high" | "medium" | "low" | "none" | "not provided";
  term: string; // e.g. "spring", "Session A Summer 2025", etc.
  date: string | "not provided"; // e.g. "06-30-2025"
  rolling_basis: boolean | "not provided";
  time: string;
}

// DATES
export interface DateRange {
  term: string;
  start: string | "not provided";
  end: string | "not provided";
}

export interface DatesSection {
  deadlines: Deadline[];
  dates: DateRange[];
  duration_weeks: number | "not provided";
}

// LOCATION
export interface Location {
  virtual: boolean | "not provided";
  state: string;
  city: string;
  address: string;
}

export interface LocationsSection {
  locations: Location[];
}

// COSTS
export interface CostItem {
  name: string;
  free: boolean | "not provided";
  lowest: number | "not provided";
  highest: number | "not provided";
  "financial-aid-available": boolean | "not provided";
}

export interface Stipend {
  available: boolean | "not provided";
  amount: number | "not provided";
}

export interface CostsSection {
  costs: CostItem[];
  stipend: Stipend;
}

// CONTACT
export interface ContactInfo {
  email: string;
  phone: string;
}

export interface ContactSection {
  contact: ContactInfo;
}

// METADATA
export interface Metadata {
  date_added: string;
  favicon: string;
  time_added: string;
  total_input_tokens: number;
  total_output_tokens: number;
}

// FULL INTERNSHIP TYPE
export interface InternshipCards {
  id: string;
  
  overview: Overview;
  eligibility: EligibilitySection;
  dates: DatesSection;
  locations: LocationsSection;
  costs: CostsSection;
  contact: ContactSection;
  metadata?: Metadata;
}
