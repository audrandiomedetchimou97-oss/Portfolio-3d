import { createJsonStore, getStoreConfig } from "@/lib/content-store";
import type { Experience } from "@/data/content";

export { getStoreConfig };
export { slugify } from "@/lib/slug";

const store = createJsonStore<Experience>("src/data/experiences.json");
export const readExperiences = store.read;
export const writeExperiences = store.write;
