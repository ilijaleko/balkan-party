import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { FileImportComponent } from '../../components/file-import/file-import.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, FileImportComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent {}
