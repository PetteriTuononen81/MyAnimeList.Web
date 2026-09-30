import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { UserAnalytics } from '../../core/models/user-analytics.model';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private readonly apiUrl = `${environment.apiUrl}/analytics`;

  readonly analytics = signal<UserAnalytics | null>(null);
  readonly isLoading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  loadUserAnalytics(): void {
    this.isLoading.set(true);
    this.error.set(null);
    const token = localStorage.getItem('token');

    this.http.get<UserAnalytics>(this.apiUrl, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (data) => {
        this.analytics.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('Failed to load analytics data.');
        this.isLoading.set(false);
      }
    });
  }
}