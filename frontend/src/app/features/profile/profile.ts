import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimeApiService } from '../../core/services/anime-api.service';
import { Theme } from '../../core/services/theme';
import { Anime, AnimeStatus } from '../../core/models/anime.model';

@Component({
  selector: 'app-profile',
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  currentlyWatching: Anime[] = [];

  user = {
    username: 'AnimeUser123',
    avatar: 'https://placehold.co/120x120/3b82f6/ffffff?text=AU',
    stats: {
      totalWatched: 45,
      hoursWatched: 520,
      favorites: 12
    }
  };

  constructor(
    private animeService: AnimeApiService,
    public themeService: Theme
  ) {
    const allAnimes = this.animeService.getDummyAnimes();
    this.currentlyWatching = allAnimes.filter(anime => anime.status === AnimeStatus.WATCHING);
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  isDarkMode(): boolean {
    return this.themeService.isDark();
  }

  getCurrentlyWatchingDisplay(): string {
    if (this.currentlyWatching.length === 0) {
      return 'None';
    }
    if (this.currentlyWatching.length === 1) {
      return this.currentlyWatching[0].title;
    }
    return `${this.currentlyWatching[0].title} +${this.currentlyWatching.length - 1}`;
  }
}
