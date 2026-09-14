import { Anime } from './anime.model';

export enum LibraryStatus {
  Watching = 'Watching',
  Completed = 'Completed',
  OnGoing = 'OnGoing',
  Dropped = 'Dropped',
  PlanToWatch = 'PlanToWatch'
}

export interface LibraryEntry {
  malId: number;
  status: LibraryStatus;
  score?: number;
  anime?: Anime;
}

export interface AddToLibraryRequest {
  malId: number;
  status: LibraryStatus;
}
