import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BulkImportCandidateResponse } from '../../../core/models/Response/BulkImportCandidateResponse';
import { LibraryApiService } from '../../../core/services/library-api.service';
import { forkJoin } from 'rxjs';
import { AddToLibraryRequest } from '../../../core/models';
import { LibraryStatus } from '../../../core/models/library.model';
import { from } from 'rxjs';
import { concatMap } from 'rxjs/operators';

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
    // Safely pull whatever title is available (official anime title OR raw input title)
    const titleToSearch = (item.anime?.title || item.inputTitle || item.inputTitle || '').toLowerCase();
    const query = (this.searchQuery || '').toLowerCase();

    const matchesSearch = titleToSearch.includes(query);
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
    const selectedItems = this.selectableCandidates.filter(c => c.selected && c.anime?.id);
    if (selectedItems.length === 0) return;

    this.isSaving = true;
    this.errorMessage = '';

    // Map selected items to individual API observables
    const saveObservables = selectedItems
    .filter(item => item?.anime != null)
    .map(item => {
      const request: AddToLibraryRequest = {
        malId: item.anime.malId,
        status: this.mapToLibraryStatus(item.targetStatus)
      };
      return this.libraryService.addToLibrary(request);
    });

    // Execute all API requests in parallel
  from(saveObservables)
    .pipe(concatMap((obs$) => obs$))
    .subscribe({
      complete: () => {
        this.isSaving = false;
        this.importFinished.emit();
        this.onClose();
      },
      error: (err) => {
      this.isSaving = false;
      this.errorMessage = 'Failed to save some entries to your library. Please try again.';
      console.error('Bulk save error:', err);
      }
    });
  }

  private mapToLibraryStatus(status: string): LibraryStatus {
  const normalized = status?.toLowerCase().replace(/\s+/g, '');

  switch (normalized) {
    case 'watching':
      return LibraryStatus.Watching;
    case 'completed':
      return LibraryStatus.Completed;
    case 'ongoing':
      return LibraryStatus.OnGoing;
    case 'dropped':
      return LibraryStatus.Dropped;
    case 'plantowatch':
    case 'plan_to_watch':
      return LibraryStatus.PlanToWatch;
    default:
      return LibraryStatus.PlanToWatch; // Default fallback
  }
}
}