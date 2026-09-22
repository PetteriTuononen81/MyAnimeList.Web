import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, BehaviorSubject, combineLatest } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { AnimeCard } from '../../shared/components/anime-card/anime-card';
import { BulkImportModal } from '../../shared/components/bulk-import-modal/bulk-import-modal';
import { SearchFacade } from './search.facade';
import { AuthService } from '../../core/services/auth.service';
import { LibraryApiService } from '../../core/services/library-api.service';
import { LibraryEntry } from '../../core/models/library.model';
import { Anime } from '../../core/models/anime.model';
import { BulkImportResultModalComponent, SelectableImportCandidate } from '../../shared/components/bulk-import-result-modal/bulk-import-result-modal';
import { BulkImportCandidateResponse } from '../../core/models/Response/BulkImportCandidateResponse';

@Component({
  selector: 'app-search',
  imports: [CommonModule, FormsModule, AnimeCard, BulkImportModal, BulkImportResultModalComponent],
  providers: [SearchFacade],
  templateUrl: './search.html',
  styleUrl: './search.css',
})
export class Search implements OnInit, OnDestroy {
  searchQuery = '';

  // Expose facade observables
  readonly animes$;
  readonly loading$;
  readonly filteredAnimes$;

  private readonly searchSubject = new Subject<string>();
  private readonly SCROLL_THRESHOLD = 200;

  openLibraryDropdownId: number | null = null;
  libraryStatusMap = new Map<number, string>();
  showFilters = false;
  selectedFilter: 'all' | 'movie' | 'tv' = 'all';

  private filterSubject = new BehaviorSubject<'all' | 'movie' | 'tv'>('all');

  // Bulk import modal state
  showBulkImportModal = false;
  
  showBulkImportResultModal = false;
  bulkImportCandidates: BulkImportCandidateResponse[] = [];

  constructor(
    private facade: SearchFacade,
    public authService: AuthService,
    private libraryService: LibraryApiService
  ) {
    this.animes$ = this.facade.animes$;
    this.loading$ = this.facade.loading$;

    // Create filtered animes observable that combines animes and filter
    this.filteredAnimes$ = combineLatest([
      this.animes$,
      this.filterSubject
    ]).pipe(
      map(([animes, filter]) => this.filterAnimes(animes, filter))
    );
  }

  ngOnInit() {
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe((query) => this.facade.search(query));

    // Initial load
    this.facade.search('');

    // Load user's library if authenticated
    if (this.authService.isAuthenticated) {
      this.loadUserLibrary();
    }
  }

  ngOnDestroy() {
    this.searchSubject.complete();
  }

  onSearchInput() {
    this.searchSubject.next(this.searchQuery);
  }

  clearSearch() {
    this.searchQuery = '';
    this.searchSubject.next('');
  }

  @HostListener('window:scroll')
  onScroll() {
    const scrollPosition = window.innerHeight + window.scrollY;
    const documentHeight = document.documentElement.scrollHeight;

    if (scrollPosition >= documentHeight - this.SCROLL_THRESHOLD) {
      this.facade.loadMore();
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const clickedInsideDropdown = target.closest('.library-actions');

    if (!clickedInsideDropdown && this.openLibraryDropdownId !== null) {
      this.openLibraryDropdownId = null;
    }
  }

  toggleLibraryDropdown(animeId: number) {
    if (this.openLibraryDropdownId === animeId) {
      this.openLibraryDropdownId = null;
    } else {
      this.openLibraryDropdownId = animeId;
    }
  }

  isLibraryDropdownOpen(animeId: number): boolean {
    return this.openLibraryDropdownId === animeId;
  }

  loadUserLibrary() {
    this.libraryService.getLibrary().subscribe({
      next: (entries) => {
        this.libraryStatusMap.clear();
        entries.forEach(entry => {
          this.libraryStatusMap.set(entry.malId, entry.status);
        });
      },
      error: (error) => {
        console.error('Error loading user library:', error);
      }
    });
  }

  getAnimeLibraryStatus(malId: number): string | undefined {
    return this.libraryStatusMap.get(malId);
  }

  onAnimeAddedOrMoved() {
    // Reload library status map after adding or moving anime
    this.loadUserLibrary();
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  selectFilter(filter: 'all' | 'movie' | 'tv') {
    this.selectedFilter = filter;
    this.filterSubject.next(filter);
  }

  private filterAnimes(animes: Anime[], filter: 'all' | 'movie' | 'tv'): Anime[] {
    if (filter === 'all') {
      return animes;
    }

    return animes.filter(anime => {
      if (filter === 'movie') {
        // Movies typically have 1 episode
        return anime.episodes === 1;
      } else {
        // TV shows have more than 1 episode
        return anime.episodes && anime.episodes > 1;
      }
    });
  }

  // Bulk import methods
  openBulkImportModal(): void {
    this.showBulkImportModal = true;
  }

  closeBulkImportModal(): void {
    this.showBulkImportModal = false;
  }

  onBulkImportComplete(results: BulkImportCandidateResponse[]): void {
    this.closeBulkImportModal();
    this.bulkImportCandidates = results;
    this.showBulkImportResultModal = true;
  }

  // --- Modal 2 Handlers ---
  closeBulkImportResultModal(): void {
    this.showBulkImportResultModal = false;
    this.bulkImportCandidates = [];
  }

  onBulkImportFinished(): void {
    this.closeBulkImportResultModal();
    this.loadUserLibrary();
  }
}