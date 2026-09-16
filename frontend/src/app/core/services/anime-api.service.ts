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

}
