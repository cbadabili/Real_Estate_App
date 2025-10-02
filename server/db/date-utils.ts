export const daysAgo = (n: number): Date => new Date(Date.now() - n * 24 * 60 * 60 * 1000);
