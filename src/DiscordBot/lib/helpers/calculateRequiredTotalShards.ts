export default function calculateRequiredTotalShards(lvl: number) {
    let total = 0;

    for (let i = 1; i < lvl; i++) {
        total += shardsForLevel(i);
    }

    return total;
}

function shardsForLevel(lvl: number): number {
    // Total shards required to go from lvl → lvl
    return Math.max(1, Math.round(0.05 * Math.pow(lvl, 2)));
}