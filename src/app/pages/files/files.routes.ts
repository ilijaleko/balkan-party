import { Routes } from '@angular/router';
import { FileListComponent } from './file-list/file-list.component';
import { FileDetailsComponent } from './file-details/file-details.component';

export const routes: Routes = [
  {
    path: '',
    component: FileListComponent,
  },
  {
    path: 'details/:fileName',
    component: FileDetailsComponent,
    pathMatch: 'full',
  },
];
