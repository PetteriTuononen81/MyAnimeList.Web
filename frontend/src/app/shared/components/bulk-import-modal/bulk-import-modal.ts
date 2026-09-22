import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LibraryApiService } from '../../../core/services/library-api.service';
import { Anime } from '../../../core/models';
import { BulkImportCandidateResponse } from '../../../core/models/Response/BulkImportCandidateResponse';

@Component({
  selector: 'app-bulk-import-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bulk-import-modal.component.html',
  styleUrl: './bulk-import-modal.component.css'
})
export class BulkImportModal {
  @Input() title = 'Bulk Import Anime';
  @Input() isOpen = false;
  
  @Output() close = new EventEmitter<void>();
  @Output() importComplete = new EventEmitter<BulkImportCandidateResponse[]>();

  importText = '';
  isProcessing = false;
  errorMessage = '';
  successMessage = '';
  constructor(private libraryService: LibraryApiService) {}

  parseAnimeData(): void {
    const rawText = this.importText;
    if (!rawText) return;

    this.isProcessing = true;
    this.errorMessage = '';

    // Pass the raw text payload directly to your backend API service
    this.libraryService.bulkImportAnime(rawText).subscribe({
    next: (results: BulkImportCandidateResponse[]) => {
      this.isProcessing = false;
      this.importComplete.emit(results);
      this.closeModal();
  },
  error: (err) => {
    this.isProcessing = false;
    this.errorMessage = err?.message || 'Failed to import anime list. Please try again.';
    }
  });
  }

closeModal(): void {
  this.importText = '';
  this.errorMessage = '';
  this.successMessage = '';
  this.close.emit();
}
}