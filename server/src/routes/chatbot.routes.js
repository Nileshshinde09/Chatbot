import { Router } from "express";
import { handleCredentials, handleMessage } from "../controllers/chatbot.controller.js";

const router = Router();

router.route("/message").post(handleMessage);
router.route("/credentials").post(handleCredentials)

export default router;
