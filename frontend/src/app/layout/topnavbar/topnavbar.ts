import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../core/services/category.service';
import { ANIME_CATEGORIES, AnimeCategory } from '../../core/constants/categories';

@Component({
  selector: 'app-topnavbar',
  imports: [FormsModule, CommonModule],
  templateUrl: './topnavbar.html',
  styleUrl: './topnavbar.css',
})
export class Topnavbar {
  readonly categories = ANIME_CATEGORIES;
  activeCategory: AnimeCategory = this.categories[0];
  searchQuery = '';

  constructor(private categoryService: CategoryService) {}

  selectCategory(category: AnimeCategory) {
    this.activeCategory = category;
    this.categoryService.setCategory(category);
  }

  onSearch() {
    if (this.searchQuery.trim()) {
      // Search functionality
    }
  }
}
