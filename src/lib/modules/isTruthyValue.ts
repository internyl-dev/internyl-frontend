// Helper function to check if value is truthy (for yes/no fields)
export const isTruthyValue = (value: string | number | boolean | null | undefined): boolean => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
        const lower = value.toLowerCase();
        return lower === 'yes' || lower === 'true' || lower === '1';
    }
    return false;
};