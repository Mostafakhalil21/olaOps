import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Organization } from '../organization';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PopUpFolderComponent } from '../pop-up-folder/pop-up-folder.component';
import { DialogConfig } from '@angular/cdk/dialog';
import { OrganizationService } from '../organization.service';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
})
export class MainComponent implements OnInit {
  data: any[] = [];
  constructor(
    private dialogRef: MatDialog,
    private organization: OrganizationService
  ) {}

  openDialog(organization: any): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = '60%';
    dialogConfig.height = '60%';
    dialogConfig.data = { organization };
    this.dialogRef.open(PopUpFolderComponent, dialogConfig);
  }
  //this will be changed with api calls

  ngOnInit(): void {
    this.organization.getallorganization().subscribe((res) => {
      this.data = res.children;
    });
  }
  // addIsOncallAvailableAttribute(data:any[]): any{
  //   return data.map(item =>({
  //     ...item,
  //     isOncallAvailable: item.hasOwnProperty('isOncallAvailable') ? item.isOncallAvailable:true,
  //   }))
  // }
  shouldIgnore(organization: any): boolean {
    const ignore = [
      'Artlist.io',
      'FeedVisor',
      'GreenRoad',
      'Sisense',
      'Trafficpoint',
      'Taboola',
      'Milloh-CS',
    ];
    return ignore.includes(organization.name);
  }

  filterArrayOfOrganizations(): any[] {
    if (Array.isArray(this.data)) {
      return this.data.filter(
        (organization) => !this.shouldIgnore(organization)
      );
    } else {
      console.error('this.data is not an array');
      return [];
    }
  }
  
}
