import { Component, Input , OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import ClipboardJS from 'clipboard';
import { ChangeDetectorRef } from '@angular/core';
import { OrganizationService } from '../organization.service';

@Component({
  selector: 'app-active-template',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './active-template.component.html',
  styleUrl: './active-template.component.css'
})
export class ActiveTemplateComponent {
  constructor(private cdr: ChangeDetectorRef , private organization:OrganizationService) {}
  @Input() inputDataID:any
  customerId:number | undefined;
  activeAlerts:any[]=[] 
  data = [
    { parameter1: 'Value1', parameter2: 'ValueA' },
    { parameter1: 'Value2', parameter2: 'ValueB' },
    { parameter1: 'Value3', parameter2: 'ValueC' },
    // Add more items as needed
  ];
  clickedItemIndex: number | null = null;
  handleCopy(content: string, index: number): void {
    const textArea = document.createElement('textarea');
    textArea.value = content;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);

    // Set the clickedItemIndex for animation
    this.clickedItemIndex = index;

    // Deactivate the animation after a short delay
    setTimeout(() => {
      this.clickedItemIndex = null;
    }, 300); // Adjust the duration as needed
  }

  ngOnInit(): void {
    this.organization.getActiveAlertsPerorganization(this.inputDataID.id).subscribe((res)=> {
      this.activeAlerts=res.results
    })
  }
  
}
