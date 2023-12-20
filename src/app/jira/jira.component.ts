import { Component,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrganizationService } from '../organization.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-jira',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './jira.component.html',
  styleUrl: './jira.component.css'
})
export class JiraComponent {


}
