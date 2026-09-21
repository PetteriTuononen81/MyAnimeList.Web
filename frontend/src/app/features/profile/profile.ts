import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LibraryApiService } from '../../core/services/library-api.service';
import { Theme } from '../../core/services/theme';
import { LibraryEntry } from '../../core/models/library.model';

@Component({
  selector: 'app-profile',
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  currentlyWatching: LibraryEntry[] = [];

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
    private libraryService: LibraryApiService,
    public themeService: Theme
  ) {}

  ngOnInit() {
    this.libraryService.getLibrary('WATCHING').subscribe(entries => {
      this.currentlyWatching = entries;
    });
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
      return this.currentlyWatching[0].anime?.title || 'Unknown';
    }
    return `${this.currentlyWatching[0].anime?.title || 'Unknown'} +${this.currentlyWatching.length - 1}`;
  }
}