import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { HEADERS } from '../constants/headers.constant';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageFilesService {
  getFilesList() {
    const files = [];
    const keys = Object.keys(localStorage);
    for (const key of keys) {
      if (key.includes('xlsx')) {
        files.push({ name: key });
      }
    }
    return files;
  }

  saveFile(fileName: string, data: any) {
    const timestamp = Date.now();
    const filenameWithoutExtension = fileName.split('.').shift();
    const fileExtension = fileName.split('.').pop();
    localStorage.setItem(
      `${filenameWithoutExtension}_${timestamp}.${fileExtension}`,
      JSON.stringify(data)
    );
  }

  downloadFileAsXlsx(fileName: string) {
    const file = localStorage.getItem(fileName);

    const worksheet = XLSX.utils.json_to_sheet(JSON.parse(file || '[]'), {
      skipHeader: true,
    });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, fileName);
  }

  checkIsFileHeaderValid(header: string[]) {
    const validHeaders = HEADERS;
    return JSON.stringify(header) === JSON.stringify(validHeaders);
  }

  checkAreRhythmsValid(data: string[]) {
    for (const rhythm of data) {
      if (isNaN(Number(rhythm))) {
        return false;
      }
    }
    return true;
  }

  getFile(fileName: string) {
    const file = localStorage.getItem(fileName);
    return JSON.parse(file || '[]');
  }

  updateFile(fileName: string, file: string) {
    localStorage.setItem(fileName, file);
  }

  addSongToFile(fileName: string, song: string[]) {
    const file = this.getFile(fileName);
    file.push(song);
    localStorage.setItem(fileName, JSON.stringify(file));
    return file;
  }

  updateSongInFile(
    fileName: string,
    editedSongData: string[],
    currentSongName: string
  ) {
    const file = this.getFile(fileName);
    const updatedFile = file.map((item: any[]) => {
      if (item?.[0] === currentSongName) {
        return editedSongData;
      }
      return item;
    });

    localStorage.setItem(fileName, JSON.stringify(updatedFile));
    return updatedFile;
  }

  deleteSongFromFile(fileName: string, song: string[]) {
    const file = this.getFile(fileName);
    const updatedFile = file.filter((item: any[]) => item?.[0] !== song[0]);
    localStorage.setItem(fileName, JSON.stringify(updatedFile));
    return updatedFile;
  }

  deleteFile(fileName: string) {
    console.log(fileName);
    localStorage.removeItem(fileName);
  }
}
