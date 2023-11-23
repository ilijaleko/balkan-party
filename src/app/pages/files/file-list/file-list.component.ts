import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { LocalStorageFilesService } from '../../../services/local-storage-files.service';
import { FileImportComponent } from '../../../components/file-import/file-import.component';

@Component({
  selector: 'app-files',
  standalone: true,
  imports: [CommonModule, MatButtonModule, RouterModule, FileImportComponent],
  templateUrl: './file-list.component.html',
})
export class FileListComponent {
  files: any[] = [];

  constructor(private localStorageFilesService: LocalStorageFilesService) {
    this.files = this.localStorageFilesService.getFilesList();
  }
}
