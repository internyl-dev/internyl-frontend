"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/lib/config/firebaseConfig";
import {
    collection,
    query,
    orderBy,
    getDocs,
    getDoc,
    doc,
    updateDoc,
    deleteField,
    Timestamp,
} from "firebase/firestore";
import toast from "react-hot-toast";
import { Report } from "@/lib/types/report";
import AdminLayout from "../layout/AdminLayout";

const STATUS_OPTIONS: Report["status"][] = ["pending", "resolved", "rejected"];
const PRIORITY_OPTIONS: NonNullable<Report["priority"]>[] = ["low", "medium", "high"];

function formatDate(date: Date | Timestamp) {
    if (date instanceof Timestamp) {
        return date.toDate().toLocaleString();
    }
    return date.toLocaleString();
}

function getStatusBadgeColor(status: Report["status"]) {
    switch (status) {
        case "pending":
            return "bg-yellow-100 text-yellow-800 border-yellow-200";
        case "resolved":
            return "bg-green-100 text-green-800 border-green-200";
        case "rejected":
            return "bg-red-100 text-red-800 border-red-200";
        default:
            return "bg-gray-100 text-gray-800 border-gray-200";
    }
}

function getPriorityBadgeColor(priority: NonNullable<Report["priority"]>) {
    switch (priority) {
        case "high":
            return "bg-red-100 text-red-700 border-red-200";
        case "medium":
            return "bg-orange-100 text-orange-700 border-orange-200";
        case "low":
            return "bg-blue-100 text-blue-700 border-blue-200";
        default:
            return "bg-gray-100 text-gray-700 border-gray-200";
    }
}

// Component to display report-specific details
function ReportDetailsView({ report }: { report: Report }) {
    if (report.reportType === 'info') {
        return (
            <div className="space-y-4">
                {(report as any).internship && (
                    <div>
                        <label className="text-sm font-semibold text-gray-700">Internship:</label>
                        <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">{(report as any).internship}</p>
                    </div>
                )}
                {(report as any).incorrectInfoType && (
                    <div>
                        <label className="text-sm font-semibold text-gray-700">Incorrect Info Type:</label>
                        <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded capitalize">{(report as any).incorrectInfoType}</p>
                    </div>
                )}
                {report.correctInfo && (
                    <div>
                        <label className="text-sm font-semibold text-gray-700">Correct Info:</label>
                        <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">{report.correctInfo}</p>
                    </div>
                )}
                {report.comments && (
                    <div>
                        <label className="text-sm font-semibold text-gray-700">Comments:</label>
                        <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">{report.comments}</p>
                    </div>
                )}
            </div>
        );
    }

    if (report.reportType === 'bug') {
        return (
            <div className="space-y-4">
                {(report as any).bugTitle && (
                    <div>
                        <label className="text-sm font-semibold text-gray-700">Bug Title:</label>
                        <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">{(report as any).bugTitle}</p>
                    </div>
                )}
                {(report as any).bugDescription && (
                    <div>
                        <label className="text-sm font-semibold text-gray-700">Description:</label>
                        <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">{(report as any).bugDescription}</p>
                    </div>
                )}
                {(report as any).bugSteps && (
                    <div>
                        <label className="text-sm font-semibold text-gray-700">Steps to Reproduce:</label>
                        <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded whitespace-pre-line">{(report as any).bugSteps}</p>
                    </div>
                )}
                {(report as any).bugSeverity && (
                    <div>
                        <label className="text-sm font-semibold text-gray-700">Severity: &nbsp;</label>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${(report as any).bugSeverity === 'Critical' ? 'bg-red-100 text-red-800 border-red-200' :
                            (report as any).bugSeverity === 'High' ? 'bg-orange-100 text-orange-800 border-orange-200' :
                                (report as any).bugSeverity === 'Medium' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                                    'bg-blue-100 text-blue-800 border-blue-200'
                            }`}>
                            {(report as any).bugSeverity}
                        </span>
                    </div>
                )}
            </div>
        );
    }

    if (report.reportType === 'other') {
        return (
            <div className="space-y-4">
                {(report as any).otherSubject && (
                    <div>
                        <label className="text-sm font-semibold text-gray-700">Subject:</label>
                        <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">{(report as any).otherSubject}</p>
                    </div>
                )}
                {(report as any).otherDescription && (
                    <div>
                        <label className="text-sm font-semibold text-gray-700">Description:</label>
                        <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">{(report as any).otherDescription}</p>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="text-sm text-gray-500 italic">No specific details available</div>
    );
}

export default function AdminReports() {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(false);
    const [expandedReportId, setExpandedReportId] = useState<string | null>(null);

    const [editingReportId, setEditingReportId] = useState<string | null>(null);

    // Editable fields
    const [editStatus, setEditStatus] = useState<Report["status"]>("pending");
    const [editPriority, setEditPriority] = useState<NonNullable<Report["priority"]>>("medium");
    const [editNotes, setEditNotes] = useState("");
    const [editRejectionReason, setEditRejectionReason] = useState("");

    useEffect(() => {
        fetchReports();
    }, []);

    async function fetchReports() {
        setLoading(true);
        try {
            const q = query(collection(db, "reports"), orderBy("createdAt", "desc"));
            const snapshot = await getDocs(q);

            // Convert Firestore Timestamps to JS Dates
            const fetched: Report[] = snapshot.docs.map((doc) => {
                const data = doc.data() as Omit<Report, "id">;
                return {
                    id: doc.id,
                    ...data,
                    createdAt: (data.createdAt as Timestamp).toDate(),
                    resolvedAt: data.resolvedAt ? (data.resolvedAt as Timestamp).toDate() : undefined,
                    rejectedAt: data.rejectedAt ? (data.rejectedAt as Timestamp).toDate() : undefined,
                };
            });

            setReports(fetched);
        } catch (err) {
            console.error("Failed to fetch reports:", err);
            toast.error("Failed to fetch reports.");
        }
        setLoading(false);
    }

    function startEditing(report: Report) {
        setEditingReportId(report.id);
        setEditStatus(report.status);
        setEditPriority(report.priority ?? "medium");
        setEditNotes(report.notes ?? "");
        setEditRejectionReason(report.rejectionReason ?? "");
    }

    function cancelEditing() {
        setEditingReportId(null);
        setEditNotes("");
        setEditRejectionReason("");
    }

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        if (STATUS_OPTIONS.includes(val as Report["status"])) {
            setEditStatus(val as Report["status"]);
        }
    };

    const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        if (PRIORITY_OPTIONS.includes(val as NonNullable<Report["priority"]>)) {
            setEditPriority(val as NonNullable<Report["priority"]>);
        }
    };

    async function saveEdit() {
        if (!editingReportId) return;

        try {
            const reportRef = doc(db, "reports", editingReportId);

            const updates: Partial<Report> = {
                status: editStatus,
                priority: editPriority,
            };

            if (editNotes.trim()) {
                updates.notes = editNotes.trim();
            }

            if (editStatus === "resolved") {
                updates.resolvedAt = Timestamp.now();      // set resolvedAt to current timestamp
                updates.rejectedAt = deleteField() as any;        // remove rejectedAt field
                updates.rejectionReason = deleteField() as any;   // remove rejectionReason field
            } else if (editStatus === "rejected") {
                updates.rejectedAt = Timestamp.now();      // set rejectedAt to current timestamp
                updates.rejectionReason = editRejectionReason.trim() || "No reason provided"; // set reason
                updates.resolvedAt = deleteField() as any;        // remove resolvedAt field
            } else {
                // status neither resolved nor rejected, remove these timestamp/reason fields
                updates.resolvedAt = deleteField() as any;
                updates.rejectedAt = deleteField() as any;
                updates.rejectionReason = deleteField() as any;
            }

            // Fetch the updated document after the update
            const updatedDocSnap = await getDoc(reportRef);
            if (!updatedDocSnap.exists()) {
                toast.error("Failed to fetch updated report after saving.");
                return;
            }

            const updatedData = updatedDocSnap.data() as Report;

            const reportToNotify = {
                ...updatedData,
                id: editingReportId,  // put this AFTER spreading updatedData to override duplicate id error
                createdAt:
                    updatedData.createdAt && "toDate" in updatedData.createdAt
                        ? updatedData.createdAt.toDate()
                        : updatedData.createdAt,
                resolvedAt:
                    updatedData.resolvedAt && "toDate" in updatedData.resolvedAt
                        ? updatedData.resolvedAt.toDate()
                        : updatedData.resolvedAt,
                rejectedAt:
                    updatedData.rejectedAt && "toDate" in updatedData.rejectedAt
                        ? updatedData.rejectedAt.toDate()
                        : updatedData.rejectedAt,
                notes: updatedData.notes || "",
                rejectionReason: updatedData.rejectionReason || "",
            };


            // Send POST request to notify API
            const res = await fetch("/api/notify-report-update", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(reportToNotify),
            });

            if (!res.ok) {
                toast.error("Failed to send update notification emails.");
            } else {
                toast.success("Report updated and notifications sent.");
            }

            cancelEditing();
            fetchReports();
        } catch (err) {
            console.error("Failed to update report:", err);
            toast.error("Failed to update report");
        }
    }

    const toggleExpanded = (reportId: string) => {
        setExpandedReportId(expandedReportId === reportId ? null : reportId);
    };

    return (
        <AdminLayout>
            <div className="min-h-screen rounded-2xl">
                <div className="max-w-8xl mx-auto p-6">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">Report Management</h1>
                        <p className="text-gray-600">Manage and review user reports efficiently</p>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-16">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            <p className="ml-4 text-lg text-gray-600">Loading reports...</p>
                        </div>
                    ) : (
                        <>
                            {reports.length === 0 ? (
                                <div className="text-center py-16 bg-white rounded-lg shadow-sm">
                                    <div className="text-gray-400 text-6xl mb-4">📋</div>
                                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No reports found</h3>
                                    <p className="text-gray-500">Reports will appear here when users submit them.</p>
                                </div>
                            ) : (
                                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                                                <tr>
                                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 tracking-wider">Report ID</th>
                                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 tracking-wider">User</th>
                                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 tracking-wider">Type</th>
                                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 tracking-wider">Created</th>
                                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 tracking-wider">Status</th>
                                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 tracking-wider">Priority</th>
                                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 tracking-wider">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {reports.map((report, index) => {
                                                    const isEditing = editingReportId === report.id;
                                                    const isExpanded = expandedReportId === report.id;
                                                    return (
                                                        <React.Fragment key={report.id}>
                                                            <tr
                                                                className={`hover:bg-gray-50 transition-colors duration-200 ${isEditing ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                                                                    } ${isExpanded ? 'bg-gray-50' : ''}`}
                                                            >
                                                                <td className="px-6 py-4">
                                                                    <div className="text-sm font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded max-w-32 truncate">
                                                                        {report.id}
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4">
                                                                    <div className="text-sm font-medium text-gray-900">{report.userEmail}</div>
                                                                </td>
                                                                <td className="px-6 py-4">
                                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                                                                        {report.reportType}
                                                                    </span>
                                                                </td>
                                                                <td className="px-6 py-4">
                                                                    <div className="text-sm text-gray-700">
                                                                        {formatDate(report.createdAt)}
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4">
                                                                    {isEditing ? (
                                                                        <select
                                                                            value={editStatus}
                                                                            onChange={handleStatusChange}
                                                                            className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                                        >
                                                                            {STATUS_OPTIONS.map((status) => (
                                                                                <option key={status} value={status}>
                                                                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                                                                </option>
                                                                            ))}
                                                                        </select>
                                                                    ) : (
                                                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadgeColor(report.status)}`}>
                                                                            {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                                                                        </span>
                                                                    )}
                                                                </td>
                                                                <td className="px-6 py-4">
                                                                    {isEditing ? (
                                                                        <select
                                                                            value={editPriority}
                                                                            onChange={handlePriorityChange}
                                                                            className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                                        >
                                                                            {PRIORITY_OPTIONS.map((p) => (
                                                                                <option key={p} value={p}>
                                                                                    {p.charAt(0).toUpperCase() + p.slice(1)}
                                                                                </option>
                                                                            ))}
                                                                        </select>
                                                                    ) : (
                                                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getPriorityBadgeColor(report.priority ?? "medium")}`}>
                                                                            {(report.priority ?? "medium").charAt(0).toUpperCase() + (report.priority ?? "medium").slice(1)}
                                                                        </span>
                                                                    )}
                                                                </td>
                                                                <td className="px-6 py-4">
                                                                    <div className="flex space-x-2">
                                                                        <button
                                                                            onClick={() => toggleExpanded(report.id)}
                                                                            className="inline-flex items-center px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 border border-blue-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                                                                        >
                                                                            {isExpanded ? '🔼 Hide' : '🔽 View'}
                                                                        </button>
                                                                        {isEditing ? (
                                                                            <>
                                                                                <button
                                                                                    onClick={saveEdit}
                                                                                    className="inline-flex items-center px-3 py-1 text-xs font-medium text-white bg-green-600 hover:bg-green-700 border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200"
                                                                                >
                                                                                    ✓ Save
                                                                                </button>
                                                                                <button
                                                                                    onClick={cancelEditing}
                                                                                    className="inline-flex items-center px-3 py-1 text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                                                                                >
                                                                                    ✕ Cancel
                                                                                </button>
                                                                            </>
                                                                        ) : (
                                                                            <button
                                                                                onClick={() => startEditing(report)}
                                                                                className="inline-flex items-center px-3 py-1 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                                                                            >
                                                                                ✏️ Edit
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                            {/* Expanded Details Row */}
                                                            {isExpanded && (
                                                                <tr className="bg-gray-50 border-t-0">
                                                                    <td colSpan={7} className="px-6 py-6">
                                                                        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                                                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                                                {/* Report-specific details */}
                                                                                <div>
                                                                                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                                                                        📄 Report Details
                                                                                        <span className="ml-2 text-sm font-normal text-gray-500">
                                                                                            ({report.reportType} report)
                                                                                        </span>
                                                                                    </h4>
                                                                                    <div className="space-y-2 pb-3">
                                                                                        <div>
                                                                                            <label className="text-sm font-semibold text-gray-700">User ID:</label>
                                                                                            <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded font-mono">{report.userId}</p>
                                                                                        </div>
                                                                                        <div className="">
                                                                                            <label className="text-sm font-semibold text-gray-700">User Email:</label>
                                                                                            <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">{report.userEmail}</p>
                                                                                        </div>
                                                                                    </div>
                                                                                    <ReportDetailsView report={report} />
                                                                                </div>

                                                                                {/* Admin info */}
                                                                                <div>
                                                                                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                                                                        ⚙️ Admin Information
                                                                                    </h4>
                                                                                    <div className="space-y-4">
                                                                                        {report.notes && (
                                                                                            <div>
                                                                                                <label className="text-sm font-semibold text-gray-700">Admin Notes:</label>
                                                                                                <p className="text-sm text-gray-600 bg-blue-50 p-2 rounded border border-blue-200">{report.notes}</p>
                                                                                            </div>
                                                                                        )}
                                                                                        {report.rejectionReason && (
                                                                                            <div>
                                                                                                <label className="text-sm font-semibold text-gray-700">Rejection Reason:</label>
                                                                                                <p className="text-sm text-gray-600 bg-red-50 p-2 rounded border border-red-200">{report.rejectionReason}</p>
                                                                                            </div>
                                                                                        )}
                                                                                        {report.resolvedAt && (
                                                                                            <div>
                                                                                                <label className="text-sm font-semibold text-gray-700">Resolved At:</label>
                                                                                                <p className="text-sm text-gray-600 bg-green-50 p-2 rounded border border-green-200">{formatDate(report.resolvedAt)}</p>
                                                                                            </div>
                                                                                        )}
                                                                                        {report.rejectedAt && (
                                                                                            <div>
                                                                                                <label className="text-sm font-semibold text-gray-700">Rejected At:</label>
                                                                                                <p className="text-sm text-gray-600 bg-red-50 p-2 rounded border border-red-200">{formatDate(report.rejectedAt)}</p>
                                                                                            </div>
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            )}
                                                        </React.Fragment>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* Edit Forms */}
                            {editingReportId && (
                                <div className="mt-8 space-y-6">
                                    {editStatus === "rejected" && (
                                        <div className="bg-red-50 border border-red-200 rounded-lg p-6 shadow-sm">
                                            <div className="flex items-center mb-4">
                                                <div className="flex-shrink-0">
                                                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                                        <span className="text-red-600 font-semibold">!</span>
                                                    </div>
                                                </div>
                                                <h3 className="ml-3 text-lg font-semibold text-red-800">Rejection Reason Required</h3>
                                            </div>
                                            <label className="block text-sm font-medium text-red-700 mb-2">
                                                Please provide a reason for rejecting this report:
                                            </label>
                                            <textarea
                                                className="w-full p-4 border border-red-300 rounded-lg shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 resize-none"
                                                rows={4}
                                                value={editRejectionReason}
                                                onChange={(e) => setEditRejectionReason(e.target.value)}
                                                placeholder="Explain why this report was rejected (e.g., insufficient evidence, duplicate report, etc.)"
                                            />
                                        </div>
                                    )}

                                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                                        <div className="flex items-center mb-4">
                                            <div className="flex-shrink-0">
                                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <span className="text-blue-600 font-semibold">📝</span>
                                                </div>
                                            </div>
                                            <h3 className="ml-3 text-lg font-semibold text-gray-800">Admin Notes</h3>
                                        </div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Add internal notes about this report (optional):
                                        </label>
                                        <textarea
                                            className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                                            rows={4}
                                            value={editNotes}
                                            onChange={(e) => setEditNotes(e.target.value)}
                                            placeholder="Add any internal notes, follow-up actions, or additional context about this report..."
                                        />
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}