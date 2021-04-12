import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbCalendar, NgbDate, NgbDateAdapter, NgbDateStruct, NgbTimeAdapter, NgbTimepicker, NgbTimepickerConfig, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { ReminderService } from '../services/reminder.service';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import { NgbTime } from '@ng-bootstrap/ng-bootstrap/timepicker/ngb-time';

@Component({
  selector: 'app-reminder',
  templateUrl: './reminder.component.html',
  styleUrls: ['./reminder.component.css'],
  providers: [NgbTimepickerConfig]
})
export class ReminderComponent implements OnInit {
  faCalender = faCalendar;
  currentTime: NgbTimeStruct = { hour: new Date().getHours(), minute: new Date().getMinutes(), second: new Date().getSeconds() }
  isDisabled = (date: NgbDate, current: { month: number, day: number }) => {
    if (date.year < new Date().getFullYear())
      return true;
    else if (date.month < new Date().getMonth() + 1)
      return true;
    else if ((date.day < new Date().getDate()) && (date.month == new Date().getMonth() + 1))
      return true;
    else
      return false;
  };

  reminderForm = new FormGroup({
    reminderId: new FormControl(''),
    reminderName: new FormControl('', Validators.required),
    reminderMessage: new FormControl(''),
    reminderDate: new FormControl(),
    reminderTime: new FormControl(),
    reminderdateonly: new FormControl()
  })

  reminderList: any = [];

  constructor(private _reminderService: ReminderService, private config: NgbTimepickerConfig, private ngbCalender: NgbCalendar) {
    config.spinners = false;
    config.meridian = true;
  }

  ngOnInit(): void {
    this.reminderForm.get('reminderdateonly').setValue(this.ngbCalender.getToday());
    this.reminderForm.get('reminderTime').setValue(this.currentTime);
    this.getReminders();
  }

  getReminders() {

    this._reminderService.getReminders().subscribe((data: any) => {
      console.log(data);
      this.reminderList = data;
    });
  }

  saveReminder() {
    console.log(this.reminderForm.get('reminderdateonly').value);
    console.log(this.reminderForm.get('reminderTime').value);
    let newDate = new Date(this.reminderForm.get('reminderdateonly').value.year, this.reminderForm.get('reminderdateonly').value.month - 1, this.reminderForm.get('reminderdateonly').value.day, this.reminderForm.get('reminderTime').value.hour, this.reminderForm.get('reminderTime').value.minute, this.reminderForm.get('reminderTime').value.second);
    this.reminderForm.get('reminderDate').setValue(newDate);
    this._reminderService.createReminder(this.reminderForm.value).subscribe((data: any) => {
      console.log(data);
      this.getReminders();
      this.reminderForm.reset();
      this.reminderForm.get('reminderdateonly').setValue(this.ngbCalender.getToday());
      this.reminderForm.get('reminderTime').setValue(this.currentTime);
    });
  }

}
