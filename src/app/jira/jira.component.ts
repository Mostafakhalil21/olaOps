import { Component,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrganizationService } from '../organization.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { enviroment } from '../../../enviroment'; 

@Component({
  selector: 'app-jira',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './jira.component.html',
  styleUrl: './jira.component.css'
})
export class JiraComponent {
  constructor(private organization:OrganizationService,private http: HttpClient){}
  authorization=enviroment.mv_token
  private allCurstomersurl = 'https://api.xiteit.co/api/customers/?format=json';


  getallorganization(): Observable<any> {
    const headers = new HttpHeaders({
     'Content-Type': 'application/json',
     'Authorization': this.authorization,
   });

   return this.http.get(this.allCurstomersurl, { headers });
 }
  
  def(){
   this.getallorganization().subscribe((res) => {
    console.log(res)
   })
  }



}
