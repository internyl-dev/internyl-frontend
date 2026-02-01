export const formatDuration = (duration: string | number | null | undefined): string => {
    if (duration === null || duration === undefined || duration === "not provided" || duration === "") {
      return "Not provided";
    }

    // If it's a number (integer), add "weeks"
    if (typeof duration === 'number' || (typeof duration === 'string' && !isNaN(Number(duration)))) {
      const weeks = typeof duration === 'number' ? duration : Number(duration);
      return `${weeks} weeks`;
    }

    // If it's already a string with descriptive text, return as is
    if (typeof duration === 'string') {
      return duration;
    }

    return "Not provided";
  };