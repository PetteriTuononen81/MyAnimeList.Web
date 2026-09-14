import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { AnimeApiService } from '../../core/services/anime-api.service';
import { Anime, PaginatedResponse } from '../../core/models';

@Injectable()
export class SearchFacade {
  private readonly animesSubject = new BehaviorSubject<Anime[]>([]);
  private readonly loadingSubject = new BehaviorSubject<boolean>(false);
  private readonly hasMoreSubject = new BehaviorSubject<boolean>(true);

  readonly animes$ = this.animesSubject.asObservable();
  readonly loading$ = this.loadingSubject.asObservable();
  readonly hasMore$ = this.hasMoreSubject.asObservable();

  private currentPage = 1;
  private readonly pageSize = 20;
  private totalPages = 0;
  private currentQuery = '';

  constructor(private animeService: AnimeApiService) {}

  get isLoading(): boolean {
    return this.loadingSubject.value;
  }

  get hasMore(): boolean {
    return this.hasMoreSubject.value;
  }

  search(query: string): void {
    this.currentQuery = query;
    this.reset();
    this.load();
  }

  loadMore(): void {
    if (this.isLoading || !this.hasMore) return;

    this.currentPage++;
    this.load();
  }

  private reset(): void {
    this.currentPage = 1;
    this.animesSubject.next([]);
    this.hasMoreSubject.next(true);
  }

  private load(): void {
    this.loadingSubject.next(true);

    const request$ = this.currentQuery.trim()
      ? this.animeService.searchAnime(this.currentQuery, this.currentPage, this.pageSize)
      : this.animeService.getPaginatedAnime(this.currentPage, this.pageSize);

    request$
      .pipe(finalize(() => this.loadingSubject.next(false)))
      .subscribe({
        next: (response) => this.handleResponse(response),
        error: (error) => this.handleError(error)
      });
  }

  private handleResponse(response: PaginatedResponse<Anime>): void {
    if (!response?.data) return;

    const currentAnimes = this.animesSubject.value;
    this.animesSubject.next([...currentAnimes, ...response.data]);

    // Handle nested or direct pagination
    const pagination = (response as any).pagination || response;
    this.totalPages = pagination.totalPages ?? 0;
    const currentPage = pagination.currentPage || this.currentPage;
    this.hasMoreSubject.next(currentPage < this.totalPages);
  }

  private handleError(error: any): void {
    // Error handling is in interceptor, but you can add specific logic here
    console.error('Facade error:', error);
  }
}
