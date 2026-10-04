import { Component, OnInit, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, registerables } from 'chart.js';
import { AnalyticsService } from '../../core/services/analytics.service';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  private analyticsService = inject(AnalyticsService);

  readonly isLoading = this.analyticsService.isLoading;
  readonly error = this.analyticsService.error;
  readonly analytics = this.analyticsService.analytics;

  readonly topStudiosList = computed(() => {
    const data = this.analytics()?.topStudios;
    if (!data) return [];

    // Handles both Dictionary Record<string, number> or Array of objects
    if (Array.isArray(data)) {
      return data;
    }

    return Object.entries(data).map(([name, count]) => ({
      name,
      count
    })).sort((a, b) => b.count - a.count);
  });

  readonly demographicsChartData = computed(() => {
    const data = this.analytics()?.demographics ?? {};
    return {
      labels: ['Shounen', 'Seinen', 'Shoujo', 'Josei'],
      datasets: [{
        data: [
          data['Shounen'] ?? 0,
          data['Seinen'] ?? 0,
          data['Shoujo'] ?? 0,
          data['Josei'] ?? 0
        ],
        backgroundColor: ['#f87171', '#60a5fa', '#f472b6', '#c084fc']
      }]
    };
  });

  readonly genresChartData = computed(() => {
    const data = this.analytics()?.topGenres ?? {};
    return {
      labels: Object.keys(data),
      datasets: [{
        label: 'Anime Count',
        data: Object.values(data),
        backgroundColor: '#3b82f6',
        indexAxis: 'y' as const
      }]
    };
  });

  readonly themesChartData = computed(() => {
    const data = this.analytics()?.topThemes ?? {};
    return {
      labels: Object.keys(data),
      datasets: [{
        label: 'Anime Count',
        data: Object.values(data),
        backgroundColor: '#10b981',
        indexAxis: 'y' as const
      }]
    };
  });

  ngOnInit(): void {
    this.analyticsService.loadUserAnalytics();
  }
}