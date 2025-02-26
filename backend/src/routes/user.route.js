import { Router } from "express";
import { getUserDetail } from "../controllers/user.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/me").get(authenticateUser,getUserDetail)

export default router