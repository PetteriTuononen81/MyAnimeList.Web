import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Anime, AnimeStatus, PaginatedResponse } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnimeApiService {
  private readonly apiUrl = `${environment.apiUrl}/anime`;

  constructor(private http: HttpClient) {}

  /**
   * Get paginated anime
   */
  getPaginatedAnime(page: number, pageSize: number): Observable<PaginatedResponse<Anime>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    const url = `${this.apiUrl}/`;
    return this.http.get<PaginatedResponse<Anime>>(url, { params }).pipe(
      tap(response => console.debug('AnimeApiService.getPaginatedAnime response:', {
        url,
        params: { page, pageSize },
        response
      }))
    );
  }

  /**
   * Search anime with pagination
   */
  searchAnime(query: string, page: number, pageSize: number): Observable<PaginatedResponse<Anime>> {
    const params = new HttpParams()
      .set('query', query)
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    const url = `${this.apiUrl}/search`;
    return this.http.get<PaginatedResponse<Anime>>(url, { params }).pipe(
      tap(response => console.debug('AnimeApiService.searchAnime response:', {
        url,
        params: { query, page, pageSize },
        response
      }))
    );
  }

  // Legacy method for backward compatibility
  getDummyAnimes(): Anime[] {
    return [
      {
        id: 1,
        malId: 20,
        title: 'Naruto',
        englishTitle: 'Naruto',
        synopsis: 'A young ninja who seeks recognition from his peers and dreams of becoming the Hokage.',
        imageUrl: 'https://placehold.co/300x400/FF6B35/ffffff?text=Naruto',
        status: AnimeStatus.WATCHED,
        score: 8.5,
        episodes: 220,
        genre: 'Action, Adventure, Martial Arts'
      },
      {
        id: 2,
        malId: 21,
        title: 'One Piece',
        englishTitle: 'One Piece',
        synopsis: 'Follows the adventures of Monkey D. Luffy and his pirate crew in order to find the greatest treasure ever left.',
        imageUrl: 'https://placehold.co/300x400/4ECDC4/ffffff?text=One+Piece',
        status: AnimeStatus.WATCHING,
        score: 9.0,
        episodes: 1000,
        genre: 'Action, Adventure, Comedy'
      },
      {
        id: 3,
        malId: 16498,
        title: 'Attack on Titan',
        englishTitle: 'Attack on Titan',
        synopsis: 'Humans are nearly exterminated by giant creatures called Titans.',
        imageUrl: 'https://placehold.co/300x400/FF6B6B/ffffff?text=Attack+on+Titan',
        status: AnimeStatus.FINISHED,
        score: 9.2,
        episodes: 87,
        genre: 'Action, Drama, Horror'
      },
      {
        id: 4,
        malId: 31964,
        title: 'My Hero Academia',
        englishTitle: 'My Hero Academia',
        synopsis: 'A superhero-loving boy without any powers enrolls in a prestigious hero academy.',
        imageUrl: 'https://placehold.co/300x400/95E1D3/ffffff?text=My+Hero',
        status: AnimeStatus.ONGOING,
        score: 8.7,
        episodes: 113,
        genre: 'Action, Comedy, School'
      },
      {
        id: 5,
        malId: 11757,
        title: 'Sword Art Online',
        englishTitle: 'Sword Art Online',
        synopsis: 'Players are trapped in a virtual reality MMORPG.',
        imageUrl: 'https://placehold.co/300x400/C7CEEA/ffffff?text=SAO',
        status: AnimeStatus.UNLIKED,
        score: 7.2,
        episodes: 96,
        genre: 'Action, Adventure, Fantasy'
      },
      {
        id: 6,
        malId: 1535,
        title: 'Death Note',
        englishTitle: 'Death Note',
        synopsis: 'A high school student discovers a supernatural notebook.',
        imageUrl: 'https://placehold.co/300x400/2D4059/ffffff?text=Death+Note',
        status: AnimeStatus.WATCHED,
        score: 9.0,
        episodes: 37,
        genre: 'Mystery, Psychological, Thriller'
      }
    ];
  }
}
