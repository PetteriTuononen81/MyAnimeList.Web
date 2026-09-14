import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LibraryEntry, AddToLibraryRequest } from '../models/library.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LibraryApiService {
  private readonly apiUrl = `${environment.apiUrl}/library`;

  constructor(private http: HttpClient) {}

  addToLibrary(request: AddToLibraryRequest): Observable<LibraryEntry> {
    return this.http.post<LibraryEntry>(this.apiUrl, request);
  }

  removeFromLibrary(animeId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${animeId}`);
  }

  updateLibraryEntry(animeId: number, status: string, score?: number): Observable<LibraryEntry> {
    return this.http.put<LibraryEntry>(`${this.apiUrl}/${animeId}`, { status, score });
  }

  getLibrary(status?: string): Observable<LibraryEntry[]> {
    const url = status ? `${this.apiUrl}?status=${status}` : this.apiUrl;
    return this.http.get<LibraryEntry[]>(url);
  }
}
