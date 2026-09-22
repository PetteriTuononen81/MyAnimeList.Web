import { Anime } from '../anime.model';

export interface BulkImportCandidateResponse {
  anime: Anime;
  status: string;
  confidence?: number;
  rawTitle?: string;
}