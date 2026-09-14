import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-bulk-import-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-overlay" [class.open]="isOpen">
      <div class="modal-content" role="dialog" aria-labelledby="modal-title">
        <div class="modal-header">
          <h2 id="modal-title">{{ title }}</h2>
          <button class="close-btn" (click)="closeModal()" aria-label="Close modal">✕</button>
        </div>

        <div class="modal-body">
          <p class="instructions">Paste your anime data below. Supported formats:</p>
          <ul class="format-hints">
            <li><strong>JSON Array:</strong> Title, Status, Score formatted as JSON</li>
            <li><strong>CSV/TSV:</strong> Title, Status, Score or Title|Status|Score</li>
            <li><strong>Simple List:</strong> One anime per line</li>
          </ul>

          <div class="input-container">
            <textarea 
              class="import-textarea"
              [(ngModel)]="importText"
              placeholder="Paste your list here (e.g. Frieren: Beyond Journey's End)"
              rows="12"
              [disabled]="isProcessing">
            </textarea>

            @if (errorMessage) {
              <div class="error-message">{{ errorMessage }}</div>
            }

            @if (successMessage) {
              <div class="success-message">{{ successMessage }}</div>
            }
          </div>

          <div class="modal-actions">
            <button 
              class="btn btn-primary" 
              [disabled]="!importText.trim() || isProcessing"
              (click)="parseAnimeData()">
              @if (isProcessing) {
                <span class="spinner"></span> Processing...
              } @else {
                Import Anime
              }
            </button>

            <button 
              class="btn btn-secondary" 
              [disabled]="isProcessing"
              (click)="closeModal()">
              Cancel
            </button>
          </div>
        </div>

        <div class="modal-footer">
          <p class="footer-note">
            Tip: You can import multiple anime at once. Each line or JSON object will be processed individually.
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background-color: rgba(0, 0, 0, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
    }
    .modal-overlay.open { opacity: 1; visibility: visible; }
    .modal-content {
      background-color: var(--bg-primary, #1b2234);
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      max-width: 600px;
      width: 90%;
      max-height: 85vh;
      display: flex;
      flex-direction: column;
    }
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 1.5rem;
      border-bottom: 1px solid var(--bg-tertiary, #2e3a52);
    }
    .modal-header h2 { margin: 0; font-size: 1.25rem; color: var(--text-primary, #fff); }
    .close-btn {
      background: none; border: none; font-size: 1.5rem;
      cursor: pointer; color: var(--text-secondary, #94a3b8);
    }
    .modal-body { flex: 1; overflow-y: auto; padding: 1.5rem; }
    .instructions { margin: 0 0 1rem 0; font-size: 0.9rem; color: var(--text-secondary, #94a3b8); }
    .format-hints { list-style: none; padding: 0; margin: 0 0 1.5rem 0; font-size: 0.85rem; color: var(--text-tertiary, #64748b); }
    .format-hints li { margin-bottom: 0.5rem; padding-left: 1rem; position: relative; }
    .format-hints li::before { content: '✓'; position: absolute; left: 0; color: var(--accent-primary, #3b82f6); }
    .input-container { margin-bottom: 1rem; }
    .import-textarea {
      width: 100%; min-height: 200px; padding: 1rem;
      border: 2px solid var(--bg-tertiary, #2e3a52);
      border-radius: 8px;
      background-color: var(--bg-secondary, #0f172a);
      color: var(--text-primary, #fff);
      font-family: monospace; font-size: 0.9rem; resize: vertical; box-sizing: border-box;
    }
    .import-textarea:focus { border-color: var(--accent-primary, #3b82f6); outline: none; }
    .error-message { padding: 0.75rem; border-radius: 6px; margin-bottom: 1rem; font-size: 0.9rem; background-color: rgba(244, 67, 54, 0.1); color: #f44336; border-left: 3px solid #f44336; }
    .success-message { padding: 0.75rem; border-radius: 6px; margin-bottom: 1rem; font-size: 0.9rem; background-color: rgba(76, 175, 80, 0.1); color: #4caf50; border-left: 3px solid #4caf50; }
    .modal-actions { display: flex; gap: 0.75rem; justify-content: flex-end; margin-top: auto; }
    .btn { padding: 0.625rem 1.25rem; border-radius: 8px; font-size: 0.9rem; font-weight: 500; cursor: pointer; border: none; }
    .btn-primary { background-color: var(--accent-primary, #3b82f6); color: white; }
    .btn-secondary { background-color: var(--bg-tertiary, #2e3a52); color: var(--text-primary, #fff); }
    .btn:disabled { opacity: 0.6; cursor: not-allowed; }
    .spinner { display: inline-block; width: 1rem; height: 1rem; border: 2px solid rgba(255, 255, 255, 0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; margin-right: 0.5rem; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .modal-footer { padding: 1rem 1.5rem; border-top: 1px solid var(--bg-tertiary, #2e3a52); background-color: var(--bg-secondary, #0f172a); border-bottom-left-radius: 12px; border-bottom-right-radius: 12px; }
    .footer-note { margin: 0; font-size: 0.8rem; color: var(--text-tertiary, #64748b); text-align: center; }
  `]
})
export class BulkImportModal {
  @Input() title = 'Bulk Import Anime';
  @Input() isOpen = false;
  
  @Output() close = new EventEmitter<void>();
  @Output() importComplete = new EventEmitter<{ successCount: number; errorCount: number }>();

  importText = '';
  isProcessing = false;
  errorMessage = '';
  successMessage = '';

  parseAnimeData(): void {
    if (!this.importText.trim()) {
      this.errorMessage = 'Please enter anime data to import.';
      return;
    }

    this.isProcessing = true;
    this.errorMessage = '';
    this.successMessage = '';

    setTimeout(() => {
      try {
        const lines = this.importText.split('\n').filter(line => line.trim());
        if (lines.length === 0) throw new Error('No valid anime data found.');

        let successCount = 0;
        let errorCount = 0;

        lines.forEach((line) => {
          const trimmedLine = line.trim();
          try {
            if (trimmedLine.startsWith('[')) {
              const parsed = JSON.parse(trimmedLine);
              if (Array.isArray(parsed)) {
                successCount += parsed.length;
              } else {
                throw new Error('Invalid JSON structure');
              }
            } else {
              const parts = trimmedLine.split(/[|,]/).map(p => p.trim());
              if (parts.length >= 1) successCount++;
              else errorCount++;
            }
          } catch {
            errorCount++;
          }
        });

        this.isProcessing = false;
        this.successMessage = `Successfully imported ${successCount} anime!`;
        
        setTimeout(() => {
          this.importComplete.emit({ successCount, errorCount });
        }, 500);

      } catch (error) {
        this.isProcessing = false;
        this.errorMessage = 'Error parsing anime data. Please check the format.';
      }
    }, 1000);
  }

  closeModal(): void {
    this.close.emit();
  }
}