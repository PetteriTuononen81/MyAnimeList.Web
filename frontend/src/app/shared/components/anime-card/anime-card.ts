import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Anime } from '../../../core/models/anime.model';
import { LibraryStatus } from '../../../core/models/library.model';
import { LibraryApiService } from '../../../core/services/library-api.service';

@Component({
  selector: 'app-anime-card',
  imports: [CommonModule],
  templateUrl: './anime-card.html',
  styleUrl: './anime-card.css',
})
export class AnimeCard {
  @Input() anime!: Anime;
  @Input() showLibraryButton = false;
  @Input() showMoveButton = false;
  @Input() currentStatus?: string;
  @Input() showInLibraryStyle = false;
  @Input() showLibraryOptions = false;
  @Output() toggleLibraryOptions = new EventEmitter<void>();
  @Output() libraryOptionSelected = new EventEmitter<void>();
  @Output() animeMoved = new EventEmitter<void>();

  showMoveOptions = false;
  LibraryStatus = LibraryStatus;

  libraryStatuses = [
    { value: LibraryStatus.Watching, label: 'Watching', icon: '👁️' },
    { value: LibraryStatus.Completed, label: 'Completed', icon: '✅' },
    { value: LibraryStatus.OnGoing, label: 'On Going', icon: '⏳' },
    { value: LibraryStatus.PlanToWatch, label: 'Plan to Watch', icon: '📝' },
    { value: LibraryStatus.Dropped, label: 'Dropped', icon: '❌' }
  ];

  constructor(private libraryService: LibraryApiService) {}

  onToggleLibraryOptions() {
    this.toggleLibraryOptions.emit();
  }

  addToLibrary(status: LibraryStatus) {
    if (this.isInLibrary) {
      // If already in library, update/move it
      this.moveToStatus(status);
    } else {
      // Add new entry
      this.libraryService.addToLibrary({
        malId: this.anime.malId,
        status: status
      }).subscribe({
        next: () => {
          console.log(`Added ${this.anime.title} to library with status: ${status}`);
          this.libraryOptionSelected.emit();
          this.animeMoved.emit(); // Also emit moved event so search updates status
        },
        error: (error) => {
          console.error('Error adding to library:', error);
        }
      });
    }
  }

  onToggleMoveOptions() {
    this.showMoveOptions = !this.showMoveOptions;
  }

  moveToStatus(status: LibraryStatus) {
    this.libraryService.updateLibraryEntry(this.anime.malId, status).subscribe({
      next: () => {
        console.log(`Moved ${this.anime.title} to ${status}`);
        this.showMoveOptions = false;
        this.animeMoved.emit();
      },
      error: (error) => {
        console.error('Error moving anime:', error);
        // If anime doesn't exist in library, try adding it instead
        if (error.status === 404) {
          this.libraryService.addToLibrary({
            malId: this.anime.malId,
            status: status
          }).subscribe({
            next: () => {
              console.log(`Added ${this.anime.title} to library with status: ${status}`);
              this.animeMoved.emit();
            },
            error: (addError) => {
              console.error('Error adding to library:', addError);
            }
          });
        }
      }
    });
  }

  get availableMoveStatuses() {
    return this.libraryStatuses.filter(status => status.value !== this.currentStatus);
  }

  get isInLibrary(): boolean {
    return !!this.currentStatus;
  }

  get libraryButtonText(): string {
    if (this.isInLibrary) {
      const statusObj = this.libraryStatuses.find(s => s.value === this.currentStatus);
      return statusObj ? `✓ In ${statusObj.label}` : '✓ In Library';
    }
    return 'Add to Library';
  }

  get libraryButtonIcon(): string {
    if (this.isInLibrary) {
      const statusObj = this.libraryStatuses.find(s => s.value === this.currentStatus);
      return statusObj ? statusObj.icon : '✓';
    }
    return '📚';
  }
}
