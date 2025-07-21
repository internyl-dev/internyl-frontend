import { Timestamp } from "firebase/firestore";

export interface Report {
  id: string;
  userId: string;
  userEmail: string;
  reportType: 'info' | 'bug' | 'other';
  reportDetails: string;
  createdAt: Date | Timestamp;

  status: 'pending' | 'resolved' | 'rejected';
  resolvedAt?: Date | Timestamp;
  rejectedAt?: Date | Timestamp;
  rejectionReason?: string;

  resolvedBy?: string;
  rejectedBy?: string;
  notes?: string;
  attachments?: string[];
  priority?: 'low' | 'medium' | 'high';
  comments?: string;
  correctInfo?: string;
}
