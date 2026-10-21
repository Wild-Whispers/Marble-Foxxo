import { getSettings } from "@/getSettings";

const settings = getSettings();

export const TAGS_BLACKLIST: Array<string> = settings.art_settings.tags_blacklist;