using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
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
        private IConfigurationSection _configuration;
        public ReminderSetController(IReminderSetServices reminderSetServices, IConfiguration configuration)
        {
            _reminderSetService = reminderSetServices;
            _configuration = configuration.GetSection("GoogleAuthSettings");
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
        public ActionResult<ResponseModel> SaveReminder(ReminderModel model)
        {
            ResponseModel responseModel = new ResponseModel();
            try
            {
                ReminderModel reminderModel = _reminderSetService.Create(model);
                responseModel.ResponseMessage = "Created Successfully";
                responseModel.Result = true;
                return responseModel;
            }
            catch (Exception ex)
            {
                responseModel.ResponseMessage = ex?.InnerException?.InnerException?.Message ?? ex?.InnerException?.Message ?? ex?.Message;
                responseModel.Result = false;
                return responseModel;
            }
        }

        [HttpPut("PutReminder/{id}")]
        public IActionResult UpdateReminder(string id, ReminderModel model)
        {
            try
            {
                ResponseModel responseModel = new ResponseModel();
                _reminderSetService.Update(id, model);
                responseModel.ResponseMessage = "Updated Successfully";
                responseModel.Result = true;
                return Ok(responseModel);
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [HttpDelete("DeleteReminder/{id}")]
        public IActionResult DeleteReminder(string id)
        {
            ResponseModel response = new ResponseModel();
            try
            {

                _reminderSetService.Delete(id);
                response.Result = true;
                response.ResponseMessage = "Deleted Successfully";
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [HttpGet("AuthGoogle")]
        public IActionResult AuthGoogle()
        {
            try
            {
                _reminderSetService.AuthenticateGoogle();

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }
    }
}