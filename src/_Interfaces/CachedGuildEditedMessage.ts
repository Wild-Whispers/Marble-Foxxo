export interface CachedGuildEditedMessage {
    authorID: string,
    guildID: string,
    channelID: string,
    createdTimestamp: string,
    editedTimestamp: string,
    oldContent: string,
    newContent: string,
    [key: string]: string
}