using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SetReminder.Angular.Models
{
    public class ReminderModel
    {
        [BsonId]
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        public string ReminderId { get; set; }
        public string ReminderName { get; set; }
        public string ReminderMessage { get; set; }
        public DateTime ReminderDate { get; set; }
    }
}
