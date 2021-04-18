using SetReminder.Angular.Models;
using System.Collections.Generic;

namespace SetReminder.Angular.Interfaces
{
    public interface IReminderSetServices
    {
        List<ReminderModel> Get();
        ReminderModel Get(string Id);
        ReminderModel Create(ReminderModel reminder);
        void Update(string id, ReminderModel reminder);
        void Delete(ReminderModel reminderIn);
        void Delete(string id);
        void AuthenticateGoogle();
    }
}