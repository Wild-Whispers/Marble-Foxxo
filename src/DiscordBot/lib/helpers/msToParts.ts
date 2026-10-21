export function msToParts(ms: number, useYears: boolean = false): string {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours   = Math.floor(minutes / 60);
    const days    = Math.floor(hours / 24);

    const s = (seconds % 60).toString().padStart(2, "0");
    const m = (minutes % 60).toString().padStart(2, "0");
    const h = (hours   % 24).toString().padStart(2, "0");
    const d = (days    % 365).toString().padStart(2, "0");

    if (useYears) {
        const years = Math.floor(days / 365);
        const y = years.toString().padStart(2, "0");

        return `${y}:${d}:${h}:${m}:${s}`;
    }

    return `${d}:${h}:${m}:${s}`;
}