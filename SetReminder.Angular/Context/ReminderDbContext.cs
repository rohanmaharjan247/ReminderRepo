using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SetReminder.Angular.Context
{
    public class ReminderDbContext : IReminderDbContext
    {
        public string ReminderCollection { get; set; }
        public string ConnectionStrings { get; set; }
        public string DatabaseName { get; set; }
    }
}
