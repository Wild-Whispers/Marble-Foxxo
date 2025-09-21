import { readdirSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

/**
 * An container object containing dynamically loaded database actions.
 */
export const Actions: Record<string, any> = {}; /* eslint-disable-line @typescript-eslint/no-explicit-any */

export async function initActions() {
    const foldersPath = path.join(__dirname);
    const propFolders = readdirSync(foldersPath);

    for (const folder of propFolders) {
        if (folder === "Actions.ts") continue;

        const propsPath = path.join(foldersPath, folder);
        const propFiles = readdirSync(propsPath).filter(file => file.endsWith(".ts"));

        for (const file of propFiles) {
            if (file === "Actions.ts") continue;

            const filePath = path.join(propsPath, file);
            const fileModule = await import(pathToFileURL(filePath).href);
            const prop = fileModule.default ?? fileModule;

            // Add to class
            Object.assign(Actions, prop);
        }
    }
}