import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { GoogleLoginProvider, SocialAuthService } from 'angularx-social-login';
import { GoogleAuth } from '../models/google-auth.interface';

@Injectable({
  providedIn: 'root'
})
export class ReminderService {
  apiUrl = '';

  constructor(private http: HttpClient, @Inject('BASE_URL') baseUrl: string, private googleAuthService: SocialAuthService) {
    this.apiUrl = baseUrl;
  }

  getReminders() {
    return this.http.get(`${this.apiUrl}api/ReminderSet/AllReminders`);
  }

  createReminder(reminderModel) {
    return this.http.post(`${this.apiUrl}api/ReminderSet/SaveReminder`, reminderModel);
  }

  editReminder(reminderId, reminderModel) {
    return this.http.put(`${this.apiUrl}api/ReminderSet/PutReminder/${reminderId}`, reminderModel);
  }

  getReminderById(reminderId) {
    return this.http.get(`${this.apiUrl}api/ReminderSet/Reminder/${reminderId}`);
  }

  deleteReminder(reminderId) {
    return this.http.delete(`${this.apiUrl}api/ReminderSet/DeleteReminder/${reminderId}`);
  }

  googleAuth() {
    return this.http.get(`${this.apiUrl}api/ReminderSet/AuthGoogle`);
  }

  signinGoogle() {
    return this.googleAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  validateAuth(googleAuth: GoogleAuth) {
    return this.http.post(`${this.apiUrl}api/ReminderSet/ValidateToken`, googleAuth);
  }

  checkBackDates() {
    return this.http.get(`${this.apiUrl}api/ReminderSet/CheckAndUpdateBackDates`);
  }
}
