import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbCalendar, NgbDate, NgbDateAdapter, NgbDateStruct, NgbTimeAdapter, NgbTimepicker, NgbTimepickerConfig, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { ReminderService } from '../services/reminder.service';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reminder',
  templateUrl: './reminder.component.html',
  styleUrls: ['./reminder.component.css'],
  providers: [NgbTimepickerConfig]
})
export class ReminderComponent implements OnInit {
  faCalender = faCalendar;
  currentTime: NgbTimeStruct = { hour: new Date().getHours(), minute: new Date().getMinutes(), second: new Date().getSeconds() }
  currentEndTime: NgbTimeStruct = { hour: new Date().getHours() + 1, minute: new Date().getMinutes(), second: new Date().getSeconds() }
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
    location: new FormControl('', Validators.required),
    reminderEndDate: new FormControl(),
    isActive: new FormControl(true)
  })

  reminderList: any = [];

  noOfDays = new FormControl(0);
  reminderTime = new FormControl();
  reminderdateonly = new FormControl();
  reminderEndTime = new FormControl();
  reminderEnddateonly = new FormControl();

  editMode = false;
  get reminderFormControl() {
    return this.reminderForm.controls;
  }

  constructor(private _reminderService: ReminderService, private config: NgbTimepickerConfig, private ngbCalender: NgbCalendar) {
    config.spinners = false;
    config.meridian = true;
  }

  ngOnInit(): void {
    this.reminderdateonly.setValue(this.ngbCalender.getToday());
    this.reminderTime.setValue(this.currentTime);
    this.reminderEnddateonly.setValue(this.ngbCalender.getToday());
    this.reminderEndTime.setValue(this.currentEndTime);
    let newDate = new Date(this.reminderdateonly.value.year, this.reminderdateonly.value.month - 1, this.reminderdateonly.value.day, this.reminderTime.value.hour, this.reminderTime.value.minute, this.reminderTime.value.second);
    this.reminderForm.get('reminderDate').setValue(newDate);
    this.reminderForm.get('reminderEndDate').setValue(newDate);
    this.getReminders();
    
  }

  getReminders() {

    this._reminderService.getReminders().subscribe((data: any) => {
      console.log(data);
      this.reminderList = data;
    });
  }

  saveReminder() {
    let startDate = new Date(this.reminderdateonly.value.year, this.reminderdateonly.value.month - 1, this.reminderdateonly.value.day, this.reminderTime.value.hour, this.reminderTime.value.minute, this.reminderTime.value.second);
    let endDate = new Date(this.reminderEnddateonly.value.year, this.reminderEnddateonly.value.month - 1, this.reminderEnddateonly.value.day, this.reminderEndTime.value.hour, this.reminderEndTime.value.minute, this.reminderEndTime.value.second);
    this.reminderForm.get('reminderDate').setValue(startDate);
    this.reminderForm.get('reminderEndDate').setValue(endDate);
    if (!this.editMode) {
      this._reminderService.createReminder(this.reminderForm.value).subscribe((data: any) => {
        console.log(data);
        if (data.result) {
          Swal.fire('Reminder', data.responseMessage, 'success');
          this.getReminders();
          this.reset();
        }
        else {

        }
      });
    }
    else {
      this._reminderService.editReminder(this.reminderFormControl.reminderId.value, this.reminderForm.value).subscribe((data: any) => {
        console.log(data);
        if (data.result) {
          Swal.fire('Reminder', data.responseMessage, 'success');
          this.getReminders();
          this.reset();
        }
        else {

        }
      });
    }
    
  }

  authGoogle() {
    this._reminderService.googleAuth().subscribe((data: any) => {
      console.log(data);
    });
  }

  checkBackDates() {
    this._reminderService.checkBackDates().subscribe((data: any) => {
      console.log(data);
    })
  }

  getReminderById(reminderId) {
    this._reminderService.getReminderById(reminderId).subscribe((data: any) => {
      console.log("by id", data);
      this.reminderForm.setValue(data);
      let startDate = new Date(data.reminderDate);
      let endDate = new Date(data.reminderEndDate);

      var sDate: NgbDateStruct = {
        day: startDate.getDate(),
        month: startDate.getMonth() + 1,
        year: startDate.getFullYear()
      }

      var eDate: NgbDateStruct = {
        day: endDate.getDate(),
        month: endDate.getMonth() + 1,
        year: endDate.getFullYear()
      }

      var sTime: NgbTimeStruct = {
        hour: startDate.getHours(),
        minute: startDate.getMinutes(),
        second: startDate.getSeconds()
      }

      var eTime: NgbTimeStruct = {
        hour: endDate.getHours(),
        minute: endDate.getMinutes(),
        second: endDate.getSeconds()
      }

      this.reminderdateonly.setValue(sDate);
      this.reminderEnddateonly.setValue(eDate);

      this.reminderTime.setValue(sTime);
      this.reminderEndTime.setValue(eTime);
      
      //let startDate: NgbDateStruct = {
      //  day: data.reminderDate.get
      //}
      this.editMode = true;
    });
  }

  deleteReminder(reminderId) {
    Swal.fire({
      title: 'Are you sure want to remove?',
      text: 'You will not be able to recover this file!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this._reminderService.deleteReminder(reminderId).subscribe((data: any) => {
          console.log(data)
          if (data.result) {
            Swal.fire(
              'Deleted!',
              data.responseMessage,
              'success'
            )
            this.getReminders();
          }
          else {
            Swal.fire('Error!', data.responseMessage, 'error');
          }
        })
      
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Your file is safe :)',
          'error'
        )
      }
    })
   
  }

  dateAdd() {
    let date: Date = this.reminderFormControl.reminderDate.value;
    date.setDate(date.getDate() + Number(this.noOfDays.value));
    let bootstrapDate: NgbDateStruct = {
      day: date.getDate(),
      month: date.getMonth(),
      year: date.getFullYear()
    }
    this.reminderFormControl.reminderdateonly.setValue(bootstrapDate);


    //this.reminderForm.get('reminderdateonly').setValue(new Date().setDate(new Date().getDate() + this.noOfDays.value));
  }

  reset() {
    this.reminderForm.reset();
    this.reminderdateonly.setValue(this.ngbCalender.getToday());
    this.reminderTime.setValue(this.currentTime);
    this.reminderEnddateonly.setValue(this.ngbCalender.getToday());
    this.reminderEndTime.setValue(this.currentEndTime);
    this.noOfDays.setValue(0);
  }

}
