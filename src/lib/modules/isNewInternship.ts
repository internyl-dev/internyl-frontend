// Helper function to check if internship was added in the last week
export const isNewInternship = (dateAdded: string | null | undefined): boolean => {
    if (!dateAdded) {
        console.log('No dateAdded provided');
        return false;
    }

    try {
        // Parse the date string (format: "YYYY-MM-DD")
        const addedDate = new Date(dateAdded);
        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        console.log('Parsed addedDate:', addedDate);
        console.log('Current date (now):', now);
        console.log('One week ago:', oneWeekAgo);
        console.log('Is addedDate >= oneWeekAgo?:', addedDate >= oneWeekAgo);

        return addedDate >= oneWeekAgo;
    } catch (error) {
        console.error('Error parsing date:', error);
        return false;
    }
};