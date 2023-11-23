import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import * as XLSX from 'xlsx';
import { HEADERS } from '../../constants/headers.constant';
import { LocalStorageFilesService } from '../../services/local-storage-files.service';
import { MessageDialog } from '../dialog/message-dialog/message-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-file-import',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './file-import.component.html',
})
export class FileImportComponent {
  selectedFileName: string = '';

  constructor(
    private router: Router,
    private localStorageFilesService: LocalStorageFilesService,
    private dialog: MatDialog
  ) {}

  onFileSelected(event: any): void {
    this.selectedFileName = event.target.files[0].name ?? '';

    const target: DataTransfer = <DataTransfer>event.target;

    if (target.files.length !== 1) throw new Error('Cannot use multiple files');

    const reader: FileReader = new FileReader();

    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const workbook: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      const firstSheetName = workbook.SheetNames[0];
      const worksheet: XLSX.WorkSheet = workbook.Sheets[firstSheetName];
      const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      if (
        !this.localStorageFilesService.checkIsFileHeaderValid(
          data[0] as string[]
        )
      ) {
        this.dialog.open(MessageDialog, {
          data: {
            title: 'Greška',
            message: `
              Zaglavlje datoteke nije ispravno! 
              Ispravno zaglavlje je: ${JSON.stringify(HEADERS)}
              Vaše zaglavlje je: ${JSON.stringify(data[0])}
            `,
          },
        });
        return;
      }

      if (
        this.localStorageFilesService.checkAreRhythmsValid(
          data.slice(1) as string[]
        )
      ) {
        this.dialog.open(MessageDialog, {
          data: {
            title: 'Greška',
            message: `
              Svi ritmovi bi trebali biti brojevi kako bi sortiranje
              radilo ispravno! 
            `,
          },
        });
        return;
      }

      this.saveToLocalStorage(this.selectedFileName, data);
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/files']);
      });
    };

    reader.readAsBinaryString(target.files[0]);
  }

  saveToLocalStorage(filename: string, data: any) {
    this.localStorageFilesService.saveFile(filename, data);
  }
}
