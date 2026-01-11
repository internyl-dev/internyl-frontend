import { Button } from "@mui/material";
import { ReactNode } from "react";

export function DashboardCard({
    title,
    count,
    subtitle,
    color,
    onRefresh,
    setStatus,
}: {
    title: string;
    count: number;
    subtitle: ReactNode; // 👈 changed from string → ReactNode
    color: string;
    onRefresh: () => Promise<void>;
    setStatus: (v: string) => void;
}) {
    return (
        <div
            className="flex flex-col items-center justify-center w-full max-w-sm p-8 rounded-3xl border border-white/30 shadow-lg backdrop-blur-lg bg-white/30 hover:bg-white/40 transition-all duration-300"
            style={{
                boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.1)",
                WebkitBackdropFilter: "blur(12px)",
                backdropFilter: "blur(12px)",
            }}
        >
            <h3 className={`text-${color}-700 font-bold text-xl mb-4`}>{title}</h3>
            <p className="text-5xl font-extrabold text-gray-900 mb-2">{count}</p>
            <p className="text-gray-600 text-sm mb-6 text-center">{subtitle}</p>
            <Button
                size="small"
                variant="outlined"
                onClick={async () => {
                    setStatus("loading");
                    await onRefresh();
                    setStatus("done");
                }}
                className="px-4 py-2 text-xs rounded-lg border-gray-300 hover:border-purple-400 hover:text-purple-600 transition-all"
                style={{ minWidth: "80px" }}
            >
                Refresh
            </Button>
        </div>
    );
}
