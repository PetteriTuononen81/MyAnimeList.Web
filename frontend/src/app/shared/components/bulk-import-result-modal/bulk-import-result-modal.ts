import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BulkImportCandidateResponse } from '../../../core/models/Response/BulkImportCandidateResponse';
import { LibraryApiService } from '../../../core/services/library-api.service';

export interface SelectableImportCandidate extends BulkImportCandidateResponse {
  selected: boolean;
  targetStatus: string;
}

@Component({
  selector: 'app-bulk-import-result-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bulk-import-result-modal.component.html',
  styleUrl: './bulk-import-result-modal.component.css'
})
export class BulkImportResultModalComponent {
  @Input() isOpen = false;
  
  private _candidates: BulkImportCandidateResponse[] = [];
  @Input() 
  set candidates(values: BulkImportCandidateResponse[]) {
    this._candidates = values || [];
    this.selectableCandidates = this._candidates.map(candidate => ({
      ...candidate,
      selected: candidate.status !== 'AMBIGUOUS',
      targetStatus: 'WATCHING'
    }));
  }
  
  @Output() close = new EventEmitter<void>();
  @Output() importFinished = new EventEmitter<void>();

  selectableCandidates: SelectableImportCandidate[] = [];
  searchQuery = '';
  statusFilter = 'ALL';
  isSaving = false;
  errorMessage = '';

  constructor(private libraryService: LibraryApiService) {}

  get filteredCandidates(): SelectableImportCandidate[] {
    return this.selectableCandidates.filter(item => {
      const matchesSearch = item.anime?.title?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                            item.rawTitle?.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesStatus = this.statusFilter === 'ALL' || item.status === this.statusFilter;
      return matchesSearch && matchesStatus;
    });
  }

  get selectedCount(): number {
    return this.selectableCandidates.filter(c => c.selected).length;
  }

  get isAllSelected(): boolean {
    return this.filteredCandidates.length > 0 && this.filteredCandidates.every(c => c.selected);
  }

  toggleSelectAll(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.filteredCandidates.forEach(c => c.selected = checked);
  }

  onClose(): void {
    this.close.emit();
  }

  onConfirm(): void {
    const selectedItems = this.selectableCandidates.filter(c => c.selected);
    if (selectedItems.length === 0) return;

    this.isSaving = true;
    this.errorMessage = '';

    // Example logic: map candidates to AddToLibraryRequest objects or pass selected array
    // Update this call to match your actual bulk save / add endpoint in LibraryApiService
    const requests = selectedItems.map(item => ({
      animeId: item.anime.id,
      status: item.targetStatus
    }));

    // Perform API save logic internally
    // Example: this.libraryService.saveBulkToLibrary(requests).subscribe(...)
    this.isSaving = false;
    this.importFinished.emit();
    this.onClose();
  }
}