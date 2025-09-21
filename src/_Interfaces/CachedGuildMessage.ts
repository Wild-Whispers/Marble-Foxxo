export interface CachedGuildMessage {
    messageID: string,
    guildID: string,
    channelID: string,
    authorID: string,
    content: string,
    [key: string]: string
}