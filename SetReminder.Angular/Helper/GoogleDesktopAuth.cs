using Google.Apis.Auth.OAuth2;
using Google.Apis.Calendar.v3;
using Google.Apis.Calendar.v3.Data;
using Google.Apis.Services;
using Google.Apis.Util.Store;
using SetReminder.Angular.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SetReminder.Angular.Helper
{
    public class GoogleDesktopAuth
    {
        static string[] Scopes = { CalendarService.Scope.Calendar, CalendarService.Scope.CalendarReadonly };
        static string ApplicationName = "Reminder";

        static UserCredential credential;

        private void GoogleAuth()
        {
            using (var stream = new FileStream("./Config/gAuthDesktop.json", FileMode.Open, FileAccess.Read))
            {
                string credPath = "token.json";
                credential = GoogleWebAuthorizationBroker.AuthorizeAsync(GoogleClientSecrets.Load(stream).Secrets, Scopes, "smdnoobs24@gmail.com", CancellationToken.None, new FileDataStore(credPath, true)).Result;
                Console.WriteLine("Credential file saved to:" + credPath);
                // Create Google Calendar API service.
           
            }

        }

        public void ListCalenderEvents()
        {
            GoogleAuth();
            var service = new CalendarService(new BaseClientService.Initializer()
            {
                HttpClientInitializer = credential,
                ApplicationName = ApplicationName,
            });
            // Define parameters of request.
            EventsResource.ListRequest request = service.Events.List("primary");
            request.TimeMin = DateTime.Now;
            request.ShowDeleted = false;
            request.SingleEvents = true;
            request.MaxResults = 10;
            request.OrderBy = EventsResource.ListRequest.OrderByEnum.StartTime;

            // List events.
            Events events = request.Execute();
            if (events.Items != null && events.Items.Count > 0)
            {
                foreach (var eventItem in events.Items)
                {
                    string when = eventItem.Start.DateTime.ToString();
                    if (String.IsNullOrEmpty(when))
                    {
                        when = eventItem.Start.Date;
                    }
                    Console.WriteLine("{0} ({1})", eventItem.Summary, when);
                }
            }
            else
            {
                Console.WriteLine("No upcoming events found.");
            }
            Console.Read();
        }

        public void CreateEvent(List<ReminderModel> reminderModels)
        {
            GoogleAuth();
            var service = new CalendarService(new BaseClientService.Initializer()
            {
                HttpClientInitializer = credential,
                ApplicationName = ApplicationName,
            });
            Event insertEvent;
            foreach(ReminderModel reminder in reminderModels)
            {
                insertEvent = new Event();
                insertEvent.Summary = reminder.ReminderName;
                insertEvent.Description = reminder.ReminderMessage;
                insertEvent.Location = reminder.Location;
                EventDateTime eventDateTime = new EventDateTime();
                eventDateTime.DateTime = reminder.ReminderDate;
                insertEvent.Start = eventDateTime;
                EventDateTime endDateTime = new EventDateTime();
                endDateTime.DateTime = reminder.ReminderEndDate;
                insertEvent.End = endDateTime;
                EventsResource.InsertRequest request = service.Events.Insert(insertEvent, "primary");
                request.Execute();
            }
        }
    }
}
