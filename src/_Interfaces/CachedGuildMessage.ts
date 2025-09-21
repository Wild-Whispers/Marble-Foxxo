export interface CachedGuildMessage {
    messageID: string,
    guildID: string,
    channelID: string,
    authorID: string,
    [key: string]: string
}