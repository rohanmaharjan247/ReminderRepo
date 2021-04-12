using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SetReminder.Angular.Interfaces;
using SetReminder.Angular.Models;
//using SetReminder.Angular.Models;

namespace SetReminder.Angular.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReminderSetController : ControllerBase
    {
        private readonly IReminderSetServices _reminderSetService;
        public ReminderSetController(IReminderSetServices reminderSetServices)
        {
            _reminderSetService = reminderSetServices;
        }

        [HttpGet("AllReminders")]
        public ActionResult<IEnumerable<ReminderModel>> GetReminders()
        {
            try
            {
                List<ReminderModel> reminderList = new List<ReminderModel>();
                reminderList = _reminderSetService.Get();
                return reminderList;
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [HttpGet("Reminder/{id}")]
        public ActionResult<ReminderModel> GetReminder(string id)
        {
            try
            {
                ReminderModel reminder = new ReminderModel();
                reminder = _reminderSetService.Get(id);
                if (reminder == null)
                    return NotFound("No reminder found");
                return reminder;
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [HttpPost]
        [Route("SaveReminder")]
        public ActionResult<ReminderModel> SaveReminder(ReminderModel model)
        {
            ReminderModel reponseModel = _reminderSetService.Create(model);
            return reponseModel;
        }

        [HttpPut("PutReminder/{id}")]
        public IActionResult UpdateReminder(string id, ReminderModel model)
        {
            try
            {
                _reminderSetService.Update(id, model);
                return Ok("Updated");
            }
            catch(Exception ex)
            {
                return BadRequest(ex);
            }            
        }

        [HttpDelete("DeleteReminder/{id}")]
        public IActionResult DeleteReminder(string id)
        {
            try
            {
                _reminderSetService.Delete(id);
                return Ok("Deleted");
            }
            catch(Exception ex)
            {
                return BadRequest(ex);
            }
        }
    }
}