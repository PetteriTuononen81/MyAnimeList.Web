import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AnimeCategory, ANIME_CATEGORIES } from '../constants/categories';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private selectedCategorySubject = new BehaviorSubject<AnimeCategory>(ANIME_CATEGORIES[0]);
  selectedCategory$ = this.selectedCategorySubject.asObservable();

  setCategory(category: AnimeCategory) {
    this.selectedCategorySubject.next(category);
  }

  getCategory(): AnimeCategory {
    return this.selectedCategorySubject.value;
  }
}
