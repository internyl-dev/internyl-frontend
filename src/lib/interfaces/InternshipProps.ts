import { InternshipCards as InternshipType } from "../interfaces/internshipCards";

export interface Props {
  internships: InternshipType[];
  bookmarked: { [key: string]: boolean };
  toggleBookmark: (internshipId: string) => void;
}