export function isTimestamp(value: unknown): value is { toDate: () => Date } {
    return (
        value !== null &&
        typeof value === "object" &&
        "toDate" in value &&
        typeof (value as { toDate?: unknown }).toDate === "function"
    );
}