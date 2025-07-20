export interface Report {
    id: string;
    userId: string;
    userEmail: string;

    reportType: 'info' | 'bug' | 'other';
    reportDetails: string;
    createdAt: Date;

    status: 'pending' | 'resolved' | 'rejected';
    resolvedAt?: Date;
    rejectedAt?: Date;
    rejectionReason?: string;

    resolvedBy?: string; // User ID of the admin who resolved the report
    rejectedBy?: string; // User ID of the admin who rejected the report
    notes?: string; // Additional notes from the admin
    attachments?: string[]; // URLs to any attachments related to the report
    priority?: 'low' | 'medium' | 'high'; // Priority level of the report
    comments?: string; // User comments added to the report
    correctInfo?: string; // User-provided correct information
}