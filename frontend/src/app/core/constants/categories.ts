export const ANIME_CATEGORIES = [
  'Watching',
  'Completed',
  'PlanToWatch',
  'OnGoing',
  'Dropped'
] as const;

export type AnimeCategory = typeof ANIME_CATEGORIES[number];
