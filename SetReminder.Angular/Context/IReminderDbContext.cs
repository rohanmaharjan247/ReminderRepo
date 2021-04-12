using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SetReminder.Angular.Context
{
    public interface IReminderDbContext
    {
        string ReminderCollection { get; set; }
        string ConnectionStrings { get; set; }
        string DatabaseName { get; set; }
    }
}
