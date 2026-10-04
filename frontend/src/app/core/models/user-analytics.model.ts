export interface UserAnalytics {
  totalCompleted: number;
  planToWatch: number;
  totalEpisodesWatched: number;
  recentlyCompletedTitle: string;
  demographics: Record<string, number>;
  topGenres: Record<string, number>;
  topThemes: Record<string, number>;
  topStudios: Record<string, number> | Array<{ name: string; count: number }>;
}