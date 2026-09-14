export interface Anime {
  id: number;
  malId: number;
  title: string;
  englishTitle?: string;
  synopsis?: string;
  episodes?: number;
  status?: string;
  score?: number;
  imageUrl?: string;
  genre?: string;
  airedFrom?: string;
  airedTo?: string;
  createdAt?: string;
  updatedAt?: string;
}

export enum AnimeStatus {
  WATCHED = 'watched',
  WATCHING = 'watching',
  FINISHED = 'finished',
  ONGOING = 'ongoing',
  UNLIKED = 'unliked'
}
