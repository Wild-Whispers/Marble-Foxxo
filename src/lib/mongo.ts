import { WildMongo } from "wildmongowhispers";

let mongo: WildMongo | null = null;

export function getMongo(): WildMongo {
    if (!mongo) {
        if (!process.env.MONGO_URI) throw new Error("Missing process.env.MONGO_URI");

        mongo = new WildMongo("FoxyBot", process.env.MONGO_URI);
    }

    return mongo;
}