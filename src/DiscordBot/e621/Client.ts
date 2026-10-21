import { TAGS_BLACKLIST } from "./TAGS_BLACKLIST";

export class E6Client {
    private headers: Record<string, string>;
    private blacklist: Array<string>;
    
    protected limitPerPage: number = 320;

    constructor(username: string, secret: string) {
        this.headers = {
            "Authorization": "Basic " + btoa(`${username}:${secret}`),
            "User-Agent": "MarbleFoxxo/1.0 (by QuietWindUponTheMoor [QuietWind01 on e621] and team"
        };

        this.blacklist = TAGS_BLACKLIST;
    }

    protected async _fetch(tags: string) {
        return await fetch(`https://e621.net/posts.json?tags=${tags}+-${this.blacklist.join("+-")}&limit=${this.limitPerPage}`, { headers: this.headers });
    }
}