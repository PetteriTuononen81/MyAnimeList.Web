import { Anime } from '../anime.model';

export interface BulkImportCandidateResponse {
  anime: Anime;
  inputTitle: string;
  status: string;
  confidence?: number;
  rawTitle?: string;
}