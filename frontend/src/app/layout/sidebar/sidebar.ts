import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationService } from '../../core/services/navigation.service';
import { CategoryService } from '../../core/services/category.service';
import { Theme } from '../../core/services/theme';
import { AuthService } from '../../core/services/auth.service';
import { ANIME_CATEGORIES, AnimeCategory } from '../../core/constants/categories';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  readonly categories = ANIME_CATEGORIES;
  activeCategory: AnimeCategory = this.categories[0];
  isLibraryExpanded = false;

  currentUser$;

  constructor(
    private nav: NavigationService,
    private categoryService: CategoryService,
    public themeService: Theme,
    private authService: AuthService
  ) {
    this.currentUser$ = this.authService.currentUser$;
  }

  navigate(route: string) {
    this.nav.navigateTo(route);
  }

  toggleLibrary() {
    this.isLibraryExpanded = !this.isLibraryExpanded;
    if (this.isLibraryExpanded) {
      this.nav.goToLibrary();
    }
  }

  selectCategory(category: AnimeCategory) {
    this.activeCategory = category;
    this.categoryService.setCategory(category);
    this.nav.goToLibrary();
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  logout() {
    this.authService.logout();
  }

  getCategoryDisplayName(category: AnimeCategory): string {
    const displayNames: Record<AnimeCategory, string> = {
      'Watching': 'Watching',
      'Completed': 'Completed',
      'PlanToWatch': 'Plan to Watch',
      'OnGoing': 'On Going',
      'Dropped': 'Dropped'
    };
    return displayNames[category];
  }
}
