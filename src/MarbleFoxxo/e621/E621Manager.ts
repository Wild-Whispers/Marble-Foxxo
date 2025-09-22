import { E6Client } from "./Client";

export class E621Manager extends E6Client {

    constructor(username: string, secret: string) {
        super(username, secret);
    }

    async fetchOne(tags: Array<string>) {
        const res = await this._fetch(tags.join("+"));

        const json = await res.json();

        // Select random post
        const randIndex = Math.round(Math.random() * (this.limitPerPage - 1) + 1);
        return json.posts[randIndex];
    }

    async fetchMultiple(tags: Array<string>, amount: number) {
        const res = await this._fetch(tags.join("+"));

        const json = await res.json();

        // Select X random posts
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        const posts: any = [];
        for (let i = 0; i < amount; i++) {
            const randIndex = Math.round(Math.random() * (this.limitPerPage - 1) + 1);
            const post = json.posts[randIndex];

            posts.push(post);
        }
        
        return posts;
    }
}