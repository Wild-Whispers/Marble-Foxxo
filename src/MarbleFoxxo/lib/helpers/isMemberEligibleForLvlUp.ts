import calculateRequiredTotalMessages from "./calculateRequiredTotalMessages";
import calculateRequiredTotalShards from "./calculateRequiredTotalShards";

export default function isMemberEligibleForLvlUp(memberCurrentLvl: number, memberTotalMsgs: number, memberTotalShards: number):
{
    eligible: boolean,
    requiredTotalMessages: number,
    requiredTotalShards: number
}
    
{
    const nextLvl = memberCurrentLvl + 1;
    const requiredTotalMessages = calculateRequiredTotalMessages(nextLvl);
    const requiredTotalShards = calculateRequiredTotalShards(nextLvl);

    if (
        memberTotalMsgs >= requiredTotalMessages
        &&
        memberTotalShards >= requiredTotalShards
    ) return {
        eligible: true,
        requiredTotalMessages: requiredTotalMessages,
        requiredTotalShards: requiredTotalShards
    };

    return {
        eligible: false,
        requiredTotalMessages: requiredTotalMessages,
        requiredTotalShards: requiredTotalShards
    };
}