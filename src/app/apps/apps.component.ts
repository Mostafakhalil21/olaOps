import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrganizationService } from '../organization.service';
import { value } from '../organization';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-apps',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './apps.component.html',
  styleUrl: './apps.component.css'
})
export class AppsComponent {
  loading = true;
  @Input() inputDataID: any;
  appsArray:any[]=[]
  constructor(
    private organization: OrganizationService
  ) {}

  displayCustomer(CustomerId:number,array:any){
    
      var id = CustomerId.toString()
      const matchedCustomer = array.find((item: any) => item.key === id);

      if(matchedCustomer){
       this.appsArray = matchedCustomer.valueArray

      }else{
        console.log("Customer not found");

      }

    
  }

  ngOnInit(): void {
    this.organization.getTaggingDictionaries().subscribe((res) => {
      this.displayCustomer(this.inputDataID.id, res);
  
      // Move the loading check inside the subscribe callback
      if (!this.appsArray || this.appsArray.length === 0) {
        console.log('No matching apps found.');
      }
  
      // Set loading to false after handling the response
      this.loading = false;
    });

  }

}
