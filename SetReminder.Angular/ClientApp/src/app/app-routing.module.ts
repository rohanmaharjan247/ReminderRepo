import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CounterComponent } from './counter/counter.component';
import { FetchDataComponent } from './fetch-data/fetch-data.component';
import { HomeComponent } from './home/home.component';
import { ReminderComponent } from './reminder/reminder.component';

const routes: Routes = [{ path: '', redirectTo: 'reminder', pathMatch: 'full' },
{ path: 'counter', component: CounterComponent },
{ path: 'fetch-data', component: FetchDataComponent },
{ path: 'reminder', component: ReminderComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy', initialNavigation: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
