export interface EligibilityItem {
  id: string;
  label: string;
  required: boolean;
  description?: string;
}

export interface UserEligibilityData {
  [internshipId: string]: {
    [itemId: string]: boolean;
  };
}