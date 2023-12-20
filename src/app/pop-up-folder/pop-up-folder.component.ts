import { Component, Input, Inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Organization } from '../organization';
import { OncallComponent } from '../oncall/oncall.component';
import { JiraComponent } from '../jira/jira.component';
import { ActiveTemplateComponent } from '../active-template/active-template.component';
import { AppsComponent } from '../apps/apps.component';
@Component({
  selector: 'app-pop-up-folder',
  standalone: true,
  imports: [
    CommonModule,
    OncallComponent,
    JiraComponent,
    ActiveTemplateComponent,
    AppsComponent
  ],
  templateUrl: './pop-up-folder.component.html',
  styleUrl: './pop-up-folder.component.css',
})
export class PopUpFolderComponent {
  selectedComponent: number | null = null;

  @Input() organization: any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: { organization: any }) {
    this.organization = this.data.organization;
  }

  showComponent(componentNumber: number): void {
    if (this.selectedComponent != null) {
      this.hideComponent(this.selectedComponent);
    }
    this.selectedComponent = componentNumber;
  }
  hideComponent(componentNumber: number): void {
    if (this.selectedComponent === componentNumber) {
      this.selectedComponent = null;
    }
  }
}
