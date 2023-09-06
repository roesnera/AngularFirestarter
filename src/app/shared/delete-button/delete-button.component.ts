import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-delete-button',
  templateUrl: './delete-button.component.html',
  styleUrls: ['./delete-button.component.scss']
})
export class DeleteButtonComponent {
  canDelete!: boolean;

  constructor() {
    this.canDelete = false;
  }

  @Output() delete = new EventEmitter<boolean>();

  prepareForDelete(): void {
    this.canDelete = true;
  }

  cancel(): void {
    this.canDelete = false;
  }

  deleteBoard(): void {
    this.delete.emit(true);
    this.canDelete = false;
  }
}
