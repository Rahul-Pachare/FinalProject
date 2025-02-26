import { Router } from "express";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { UpdateMailStatus, addMails, deleteMailByID, getMailbyID, getMaybeSpamMails, getUnreadMails } from "../controllers/mail.controller.js";

const router = Router();

router.route("/getmails").get(authenticateUser,getUnreadMails)
router.route("/scanmails").get(authenticateUser,addMails)
router.route("/get/maybespam").get(authenticateUser,getMaybeSpamMails)
router.route("/get/mailbyid").get(authenticateUser,getMailbyID)
router.route("/updatemail").get(authenticateUser,UpdateMailStatus)
router.route("/deletemail").post(authenticateUser,deleteMailByID)
export default router