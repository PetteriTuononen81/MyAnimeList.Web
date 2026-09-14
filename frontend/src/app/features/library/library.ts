import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { AnimeCard } from '../../shared/components/anime-card/anime-card';
import { LibraryApiService } from '../../core/services/library-api.service';
import { CategoryService } from '../../core/services/category.service';
import { Anime } from '../../core/models/anime.model';
import { LibraryEntry } from '../../core/models/library.model';
import { AnimeCategory } from '../../core/constants/categories';

@Component({
  selector: 'app-library',
  imports: [CommonModule, AnimeCard],
  templateUrl: './library.html',
  styleUrl: './library.css',
})
export class Library implements OnInit, OnDestroy {
  animes: Anime[] = [];
  libraryEntries: LibraryEntry[] = [];
  currentCategory: AnimeCategory = 'Watching';
  private categorySubscription?: Subscription;
  loading = false;

  constructor(
    private libraryService: LibraryApiService,
    private categoryService: CategoryService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Load library immediately with current category
    this.loadLibrary();

    // Then subscribe to category changes
    this.categorySubscription = this.categoryService.selectedCategory$.subscribe(
      category => {
        this.currentCategory = category;
        this.loadLibrary();
      }
    );
  }

  ngOnDestroy() {
    this.categorySubscription?.unsubscribe();
  }

  loadLibrary() {
    this.loading = true;
    this.cdr.detectChanges();

    this.libraryService.getLibrary(this.currentCategory).subscribe({
      next: (entries) => {
        console.log('Library entries received:', entries);
        console.log('Entries type:', typeof entries, Array.isArray(entries));

        // Ensure entries is an array
        const entriesArray = Array.isArray(entries) ? entries : [entries];

        this.libraryEntries = entriesArray;
        this.animes = entriesArray
          .filter(entry => entry && entry.anime)
          .map(entry => entry.anime!);

        console.log('Animes extracted:', this.animes);
        console.log('Loading set to false');
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading library:', error);
        this.animes = [];
        this.libraryEntries = [];
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  get totalAnime(): number {
    return this.animes.length;
  }

  get totalEpisodes(): number {
    return this.animes.reduce((sum, anime) => sum + (anime.episodes || 0), 0);
  }

  get completedCount(): number {
    return this.libraryEntries.filter(entry => entry.status === 'Completed').length;
  }

  get watchingCount(): number {
    return this.libraryEntries.filter(entry => entry.status === 'Watching').length;
  }

  getCategoryDisplayName(): string {
    const displayNames: Record<AnimeCategory, string> = {
      'Watching': 'Watching',
      'Completed': 'Completed',
      'PlanToWatch': 'Plan to Watch',
      'OnGoing': 'On Going',
      'Dropped': 'Dropped'
    };
    return displayNames[this.currentCategory];
  }

  onAnimeMoved() {
    // Reload the library after an anime is moved to another category
    this.loadLibrary();
  }
}
