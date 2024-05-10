export const generateCurrentTimestampInSeconds = (): number => {
    return Math.floor(Date.now() / 1000);
}