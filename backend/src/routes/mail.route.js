import { Router } from "express";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { 
  UpdateMailStatus, 
  addMails, 
  deleteMailByID, 
  getMailbyID, 
  getMaybeSpamMails, 
  getUnreadMails 
} from "../controllers/mail.controller.js";
import { manualScanEmails } from "../schedulers/mailScheduler.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

const router = Router();

router.route("/getmails").get(authenticateUser, getUnreadMails);
router.route("/scanmails").get(authenticateUser, addMails);
router.route("/get/maybespam").get(authenticateUser, getMaybeSpamMails);
router.route("/get/mailbyid").get(authenticateUser, getMailbyID);
router.route("/updatemail").get(authenticateUser, UpdateMailStatus);
router.route("/deletemail").post(authenticateUser, deleteMailByID);

// Add a manual trigger for the scheduler
router.route("/trigger-scan").post(
  asyncHandler(async (req, res) => {
    // Start the scan process in the background
    manualScanEmails().catch(err => console.error("Manual scan error:", err));
    
    // Return immediately to not block the request
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Email scan triggered successfully"));
  })
);

export default router;