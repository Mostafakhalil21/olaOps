import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AddFeatureComponent } from '../add-feature/add-feature.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, AddFeatureComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  constructor(private dialogRef: MatDialog) {}

  openDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = '50%';
    dialogConfig.height = '70%';
    this.dialogRef.open(AddFeatureComponent, dialogConfig);
  }
}
