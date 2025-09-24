export default function calculateRequiredTotalMessages(lvl: number) {
    let total = 0;

    for (let i = 1; i < lvl; i++) {
        total += messagesForLevel(i);
    }

    return total;
}

function messagesForLevel(lvl: number): number {
    // Total msgs required to go from lvl → lvl
    return Math.max(1, Math.round(lvl * (1 + Math.log10(lvl))));
}