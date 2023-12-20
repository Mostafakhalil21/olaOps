import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../environments/environment';
import { dictionaries } from './organization';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {

  
  private endPointUrl =environment.apiUrl
  authorization=environment.apiKey
  private allCurstomersurl = `${this.endPointUrl}/api/customers/?format=json`;
  private schedulePerCustomerurl = `${this.endPointUrl}/api/ocs/?format=json&customer=`
  private schedulePerCustomerLimit ='&limit=25&ordering=-updated&page=1'
  private oncallPerScheduleUrl=`${this.endPointUrl}/api/ocs-tier/`
  private oncallPerScheduleTier='/?format=json'
  private activeAlertsperOrganization=`${this.endPointUrl}/api/events/?page=1&limit=25&status=active&open_alerts=%7B%7D&group_by=host&format=json&customer=`
  private workingHourForCustomers=`${this.endPointUrl}/api/tagging-dictionaries/35/?format=json`
  private taggingDictionaries=`${this.endPointUrl}/api/tagging-dictionaries/36/?format=json`
  private templateUrl=`${this.endPointUrl}/api/template/`
  private templateUrljson='/?format=json' // this is as same as oncallPerScheduleTier 
  
  constructor(private http: HttpClient) { }


    //get all organizations
  getallorganization(): Observable<any> {
     const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.authorization,
      
    });

    return this.http.get(this.allCurstomersurl, { headers });
  }


  getScheduleForCustomer(CustomerNumber:number):Observable<any>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.authorization,
    });
    const url =`${this.schedulePerCustomerurl}${CustomerNumber}${this.schedulePerCustomerLimit}`
    return this.http.get(url,{headers})
  }

 
  getOncallPerSchedule(scheduleNumber:number,tierNumber:number):Observable<any>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.authorization,
    });
    const url =`${this.oncallPerScheduleUrl}${scheduleNumber}_${tierNumber}${this.oncallPerScheduleTier}`
    return this.http.get(url,{headers})
  }

  getActiveAlertsPerorganization(organizationNumber:number):Observable<any>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.authorization,
    });
    const url =`${this.activeAlertsperOrganization}${organizationNumber}`
    return this.http.get(url,{headers})
  }

  getWorkingHourForEachCustomer():Observable<any>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.authorization,
    });

    return this.http.get(this.workingHourForCustomers,{headers})
  }

  getTemplate(templateId:string):Observable<any>{
    var id = parseInt(templateId,10)
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.authorization,
    });

    return this.http.get(`${this.templateUrl}${id}${this.templateUrljson}`,{headers})
  }


  getTaggingDictionaries():Observable<any>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.authorization,
    });

    return this.http.get<{ rows: { key: string, value: string }[] }>(this.taggingDictionaries, { headers })
    .pipe(
      map((response) => {
        return response.rows.map((row) => {
          const valueArray = row.value.split(',').map((item) => {
            const [name, url] = item.split('@');
            const icon = this.getIconForName(name, url);
            return { name, url , icon };
          });

          return {
            key: row.key,
            valueArray: valueArray,
          };
        });
      })
    );
  }

  getIconForName(name: string, url: string): string {
    if (!name || !url) {
      return 'default-icon.png';
    }
    const iconMap:any = {
      'PRTG': 'assets/images/pngwing.com.png',
      'datadog': 'assets/images/datadog.239x256.png',
      'docs':'assets/images/1492616969-6-forms-google-data-document-file_83409.png',
      'splunk':'assets/images/icons8-splunk-240.png',
      'Grafana':'assets/images/grafana.256x256.png',
      'MSD':'assets/images/Merck Sharp & Dohme MSD.png',
      'teams':'assets/images/icons8-microsoft-teams-2019-256.png',
      'icinga':'assets/images/Icinga_logo.svg',
      'coralogix':'assets/images/Coralogix-01.png',
      'argocd':'assets/images/Argo CD.png',
      'jenkins':'assets/images/Jenkins.png',
      'aws':'assets/images/AWS.png',
      'zendesk':'assets/images/4691530_zendesk_icon.png',
      
      // Add more mappings as needed
    };
    const matchedName = Object.keys(iconMap).find((key) =>
    name.toLowerCase().includes(key.toLowerCase()) || url.toLowerCase().includes(key.toLowerCase())
  );
    
  return matchedName !== undefined ? iconMap[matchedName] : 'default-icon.png';
  }
}
