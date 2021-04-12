import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReminderService {
  apiUrl = '';

  constructor(private http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.apiUrl = baseUrl;
  }

  getReminders() {
    return this.http.get(`${this.apiUrl}api/ReminderSet/AllReminders`);
  }

  createReminder(reminderModel) {
    return this.http.post(`${this.apiUrl}api/ReminderSet/SaveReminder`, reminderModel);
  }
}
