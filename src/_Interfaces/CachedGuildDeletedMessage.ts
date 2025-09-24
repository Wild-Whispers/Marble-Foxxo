export interface CachedGuildDeletedMessage {
    authorID: string,
    guildID: string,
    channelID: string,
    createdTimestamp: string,
    editedTimestamp: string,
    content: string
    [key: string]: string
}