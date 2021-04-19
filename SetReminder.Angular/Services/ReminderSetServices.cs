using MongoDB.Driver;
using SetReminder.Angular.Context;
using SetReminder.Angular.Helper;
using SetReminder.Angular.Interfaces;
using SetReminder.Angular.Models;
using System;
using System.Collections.Generic;

namespace SetReminder.Angular.Services
{
    public class ReminderSetServices : IReminderSetServices
    {
        private readonly IMongoCollection<ReminderModel> _reminders;

        public ReminderSetServices(IReminderDbContext settings)
        {
            var client = new MongoClient(settings.ConnectionStrings);
            var database = client.GetDatabase(settings.DatabaseName);

            _reminders = database.GetCollection<ReminderModel>(settings.ReminderCollection);
        }

        public List<ReminderModel> Get() => _reminders.Find(reminder => reminder.IsActive == true).SortBy(r=>r.ReminderDate).ToList();
        public ReminderModel Get(string Id) => _reminders.Find(reminder => reminder.ReminderId == Id).FirstOrDefault();

        public ReminderModel Create(ReminderModel reminder)
        {
            _reminders.InsertOne(reminder);
            return reminder;
        }

        public void Update(string id, ReminderModel reminder) => _reminders.ReplaceOne(reminder => reminder.ReminderId == id, reminder);
        //By model
        public void Delete(ReminderModel reminderIn) => _reminders.DeleteOne(reminder => reminder.ReminderId == reminderIn.ReminderId);
        //By id
        public void Delete(string id) => _reminders.DeleteOne(reminder => reminder.ReminderId == id);

        public void AuthenticateGoogle()
        {
            GoogleDesktopAuth auth = new GoogleDesktopAuth();

            List<ReminderModel> reminders = _reminders.Find(reminder => reminder.IsActive == true).ToList();

            auth.CreateEvent(reminders);
        }

        public void CheckandUpdateBackDates()
        {
            try
            {
                List<ReminderModel> backDateList = _reminders.Find(reminder => reminder.IsActive == true && reminder.ReminderEndDate < DateTime.Now).ToList();
                if(backDateList!=null)
                {
                    if(backDateList.Count > 0)
                    {
                        foreach(ReminderModel backDate in backDateList)
                        {
                            backDate.IsActive = false;
                            _reminders.ReplaceOne(backDate.ReminderId, backDate);                          
                        }
                    }
                }
            }
            catch(Exception ex)
            {
                throw ex;
            }
        }
    }
}