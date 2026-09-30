import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface UserAnalytics {
  demographics: Record<string, number>;
  topGenres: Record<string, number>;
  topThemes: Record<string, number>;
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  private readonly apiUrl = `${environment.apiUrl}/analytics`;
  
  private http = inject(HttpClient);
  
  readonly analytics = signal<UserAnalytics | null>(null);
  readonly isLoading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

 loadUserAnalytics(): void {
  this.isLoading.set(true);
  this.error.set(null);
  const token = localStorage.getItem('token');
  
  this.http.get<UserAnalytics>(this.apiUrl,
    { headers: { Authorization: `Bearer ${token}` } }
  ).subscribe({
    next: (data) => {
      this.analytics.set(data);
      this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load analytics data.');
        this.isLoading.set(false);
      }
    });
  }
}