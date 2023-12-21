import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrganizationService } from '../organization.service';
import { Organization, whereToFindMe } from '../organization';
import { MmgService } from '../mmg.service';
import { Observable, map, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-oncall',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './oncall.component.html',
  styleUrl: './oncall.component.css',
})
export class OncallComponent {
  oncallDetails: object | any;
  constructor(
    private organization: OrganizationService,
    private mmgService: MmgService
  ) {}
  customerId: number | undefined;
  scheduleID: number | undefined;
  current_since: any;
  current_until: any;
  workingHour:string | undefined

  checkUntillTime(dateString: string):boolean{
    
    var targetDate: Date = new Date(dateString);

    // Get the current date and time
    var currentDate: Date = new Date();

    // Extract components from the target date
    var targetHours: number = targetDate.getHours();
    var targetDay: any = targetDate.getDate();
    var targetYear: number = targetDate.getFullYear();
    var targetMonth: number = targetDate.getMonth();

    // Extract components from the current date
    var currentHours: number = currentDate.getHours();
    var currentDay: any = currentDate.getDate();
    var currentYear: number = currentDate.getFullYear();
    var currentMonth: number = currentDate.getMonth();
    
    if(targetYear===currentYear && targetMonth===currentMonth && targetDay===currentDay){
      if(currentHours - targetHours > 0){
        return true
      }
    }
    return false
  }

  formatHoursAndMinutes(dateString: string): string | undefined {
    const dateObject: Date = new Date(dateString);
    if (isNaN(dateObject.getTime())) {
      // Invalid date-time string
      return undefined;
    }

    const hours: number = dateObject.getUTCHours();
    const minutes: number = dateObject.getUTCMinutes();

    // Format hours and minutes
    const formattedTime: string = `${String(hours).padStart(2, '0')}:${String(
      minutes
    ).padStart(2, '0')}`;

    return formattedTime;
  }

  // oncallTier:number | undefined;
  loading = true;

  @Input() inputDataID: any;

  checkdata() {
    if (this.inputDataID) {
      return (this.customerId = this.inputDataID.id);
    } else {
      console.error('input data is undefined');
      return null;
    }
  }
  oncallTier = 1;
  checkTier(tierNumber: string, team?: string) {
    if (tierNumber !== null) {
      this.oncallTier = parseInt(tierNumber, 10);
    }
    this.organization.getScheduleForCustomer(this.checkdata()).subscribe(
      (res) => {
        if (res.results && res.results.length > 0) {
          if (
            res.results.some(
              (schedule: { name: string }) => schedule.name === 'MMG On-call'
            )
          ) {
            if (this.mmgService.isWorkingHours()) {
              this.scheduleID = 191;
            } else {
              this.scheduleID = 237;
            }
          } else if (
            res.results.some((schedule: { id: number }) => schedule.id === 8)
          ) {
            if (team != undefined) {
              this.scheduleID = parseInt(team, 10);
            }
          } else {
            this.scheduleID = res.results[0].id;
          }
          this.organization
            .getOncallPerSchedule(this.scheduleID ?? 0, this.oncallTier)
            .subscribe(
              (oncallRes) => {
                this.current_since = this.formatHoursAndMinutes(
                  oncallRes.current_since
                );
                this.current_until = this.formatHoursAndMinutes(
                  oncallRes.current_until
                );
                const currentOncallId = oncallRes.current;
                const currentoncall = oncallRes.contacts.find(
                  (contact: any) => contact.id === currentOncallId
                );
                if (currentoncall || this.oncallTier) {
                  this.oncallDetails = currentoncall;
                } else {
                  console.log('No matching contact found.');
                }
              },
              (oncallError) => {
                console.error('Error fetching oncall details:', oncallError);
              }
            )
            .add(() => {
              this.loading = false;
            });
        } else {
          console.log('No schedule results found.');
          this.loading = false;
        }
      },
      (scheduleError) => {
        console.error('Error fetching schedule:', scheduleError);
        this.loading = false;
      }
    );
  }
  checkteam(team: string) {
    this.organization.getScheduleForCustomer(this.checkdata()).subscribe(
      (res) => {
        if (res.results && res.results.length > 0) {
          if (team != undefined) {
            this.scheduleID = parseInt(team, 10);
          }
          this.organization
            .getOncallPerSchedule(this.scheduleID ?? 0, this.oncallTier)
            .subscribe(
              (oncallRes) => {
                this.current_since = this.formatHoursAndMinutes(
                  oncallRes.current_since
                );
                this.current_until = this.formatHoursAndMinutes(
                  oncallRes.current_until
                );
// here
                const currentOncallId = oncallRes.current;
                const currentoncall = oncallRes.contacts.find(
                  (contact: any) => contact.id === currentOncallId
                );

                if (currentoncall || this.oncallTier) {
                  this.oncallDetails = currentoncall;
                } else {
                  console.log('No matching contact found.');
                }
              },
              (oncallError) => {
                console.error('Error fetching oncall details:', oncallError);
              }
            )
            .add(() => {
              this.loading = false;
            });
        } else {
          console.log('No schedule results found.');
          this.loading = false;
        }
      },
      (scheduleError) => {
        console.error('Error fetching schedule:', scheduleError);
        this.loading = false;
      }
    );
  }

  workingHours(customerNumber: number): Observable<any> {
    return this.organization.getWorkingHourForEachCustomer().pipe(
      map((res: any) => {
        const key = res.rows.find((item: { key: string }) => parseInt(item.key, 10) === customerNumber);
        return key?.value ?? 'None';
      }),
      catchError((error) => {
        console.error('Error:', error);
        return of('None'); // Return a default value or handle the error as needed
      })
    );
  }

  ngOnInit(): void {
    this.workingHours(this.checkdata()).subscribe((result) => {
      this.workingHour=result
    });
    this.organization.getScheduleForCustomer(this.checkdata()).subscribe(
      (res) => {
        if (res.results && res.results.length > 0) {
          if (
            res.results.some(
              (schedule: { name: string }) => schedule.name === 'MMG On-call'
            )
          ) {
            // check if mmg schedule
            if (this.mmgService.isWorkingHours()) {
              this.scheduleID = 191;
            } else {
              this.scheduleID = 237;
            }
            
          }else if (
            res.results.some((schedule: { id: number }) => schedule.id === 8)
          ) {
            this.scheduleID = 8;
          }
          
          else {
            this.scheduleID = res.results[0].id;
          }
          this.organization
            .getOncallPerSchedule(this.scheduleID ?? 0, 1)
            .subscribe(
              (oncallRes) => {
                this.current_since = this.formatHoursAndMinutes(
                  oncallRes.current_since
                );
                this.current_until = this.formatHoursAndMinutes(
                  oncallRes.current_until
                );
                if(this.checkUntillTime(oncallRes.current_until)){
                  var currentOncallId = oncallRes.next_contact;

                }else{
                   currentOncallId = oncallRes.current;

                }
                const currentoncall = oncallRes.contacts.find(
                  (contact: any) => contact.id === currentOncallId
                );

                if (currentoncall) {
                  this.oncallDetails = currentoncall;
                  
                } else {
                  console.log('No matching contact found.');
                }
              },
              (oncallError) => {
                console.error('Error fetching oncall details:', oncallError);
              }
            )
            .add(() => {
              this.loading = false;
            });
        } else {
          console.log('No schedule results found.');
          this.loading = false;
        }
      },
      (scheduleError) => {
        console.error('Error fetching schedule:', scheduleError);
        this.loading = false;
      }
    );
  }

  getchannelName(id: number, first_name: string): any {
    const contactCustomer: whereToFindMe[] = [
      { id: 119, ChannelName: 'Slack' },
      { id: 112, ChannelName: 'Slack' },
      { id: 47, ChannelName: 'Whatsapp' },
      { id: 147, ChannelName: 'Whatsapp' },
      { id: 36, ChannelName: 'Whatsapp - Bolt NOC DevOps Alerts' },
      { id: 144, ChannelName: 'Whatsapp -Bolt NOC-It' },
      { id: 114, ChannelName: 'Slack' },
      { id: 137, ChannelName: 'Slack' },
      { id: 124, ChannelName: 'Slack' },
      { id: 15, ChannelName: 'Slack - MoovingOn Channel' },
      { id: 67, ChannelName: 'Slack - Noc-mmg-Devops' },
      { id: 73, ChannelName: 'Slack - Noc Devops' },
      { id: 79, ChannelName: 'Whatsapp' },
    ];
    if (
      contactCustomer.find((item) => item.id === id && first_name == 'Maor')
    ) {
      const channel = contactCustomer.find((item) => item.id === 144);
      return channel?.ChannelName ?? 'None';
    } else {
      const channel = contactCustomer.find((item) => item.id === id);
      return channel?.ChannelName ?? 'None';
    }
  }
}
