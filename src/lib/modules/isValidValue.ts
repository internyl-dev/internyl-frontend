// Helper function to check if value is valid (not "not provided", null, undefined, or empty)
export const isValidValue = (value: string | number | boolean | null | undefined): boolean => {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') {
        return value.trim() !== "" && value !== "not provided";
    }
    if (typeof value === 'number') return true;
    if (typeof value === 'boolean') return true;
    return false;
};