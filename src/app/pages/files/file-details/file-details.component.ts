import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { DetailsDialog } from '../../../components/dialog/details-dialog/details-dialog.component';
import { LocalStorageFilesService } from '../../../services/local-storage-files.service';
import { Router, RouterModule } from '@angular/router';
import { ConfirmDialog } from '../../../components/dialog/confirm-dialog/confirm-dialog.component';
import { DIALOG_ACTIONS } from '../../../constants/dialog-actions.constant';

@Component({
  selector: 'app-file-details',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSortModule,
    MatButtonModule,
    RouterModule,
  ],
  templateUrl: './file-details.component.html',
})
export class FileDetailsComponent implements OnInit {
  @Input() fileName!: string;
  file: any[] = [];
  displayedColumns: any[] = [];
  selectedSongRhythm: string = '';

  sortedSongs: any[] = [];
  songRhythms: any[] = [];

  constructor(
    private router: Router,
    private localStorageFilesService: LocalStorageFilesService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.file = this.localStorageFilesService.getFile(this.fileName);

    this.displayedColumns = this.file[0];
    this.sortedSongs = this.file.slice(1);

    this.loadSongRhythms();
  }

  loadSongRhythms() {
    this.songRhythms = this.file.slice(1).reduce((acc, song) => {
      const speed = song?.[2];
      if (!acc.includes(speed)) {
        acc.push(speed);
      }
      return acc;
    }, []);
  }

  selectedSongRhythmChange(event: any) {
    this.sortedSongs = this.file.filter((song) => song?.[2] === event.value);
  }

  resetFilters() {
    this.sortedSongs = this.file.slice(1);
    this.selectedSongRhythm = '';
  }

  sortSongs(sort: any) {
    if (sort.active === 'Brzina') {
      this.sortedSongs = [...this.sortedSongs].sort((a, b) => {
        let speedA = 0;
        let speedB = 0;

        if (isNaN(a?.[3])) {
          if (a?.[3]?.includes(' ')) {
            speedA = parseInt(a?.[3]?.split(' ')[0]);
          }
        } else {
          speedA = parseInt(a?.[3]);
        }

        if (isNaN(b?.[3])) {
          if (b?.[3]?.includes(' ')) {
            speedB = parseInt(b?.[3]?.split(' ')[0]);
          }
        } else {
          speedB = parseInt(b?.[3]);
        }

        if (sort.direction === 'asc') {
          return speedA - speedB;
        } else {
          return speedB - speedA;
        }
      });
    }
  }

  addSong() {
    const dialogRef = this.dialog.open(DetailsDialog, {
      data: [],
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result?.action === DIALOG_ACTIONS.SAVE) {
        this.file = this.localStorageFilesService.addSongToFile(
          this.fileName,
          result
        );
        this.sortedSongs.push(result);
        this.sortedSongs = [...this.sortedSongs];
        this.loadSongRhythms();
      }
    });
  }

  editOrDeleteSong(song: string[]) {
    const dialogRef = this.dialog.open(DetailsDialog, {
      data: [...song],
    });

    dialogRef.afterClosed().subscribe((result) => {
      switch (result?.action) {
        case DIALOG_ACTIONS.DELETE:
          this.sortedSongs = [...this.sortedSongs].filter(
            (sortedSong) => sortedSong?.[0] !== song[0]
          );
          this.file = this.localStorageFilesService.deleteSongFromFile(
            this.fileName,
            song
          );
          this.loadSongRhythms();
          return;
        case DIALOG_ACTIONS.SAVE:
          this.sortedSongs = this.sortedSongs.map((song) => {
            if (song?.[0] === song[0]) {
              return result?.data;
            }
            return song;
          });

          this.file = this.localStorageFilesService.updateSongInFile(
            this.fileName,
            result?.data,
            song[0]
          );
          this.loadSongRhythms();
          return;
      }
    });
  }

  downloadFileAsXlsx() {
    this.localStorageFilesService.downloadFileAsXlsx(this.fileName);
  }

  deleteFile() {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      data: {
        title: 'Brisanje datoteke',
        message: `Jeste li sigurni da želite obrisati datoteku ${this.fileName}?`,
        confirmButtonText: 'Izbriši',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.action === DIALOG_ACTIONS.CONFIRM) {
        this.localStorageFilesService.deleteFile(this.fileName);
        this.router.navigate(['/files']);
      }
    });
  }
}
