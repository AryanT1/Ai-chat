import { Router } from "express";
export const chatRoute = Router()
import multer from 'multer' 

import { GeneralAuth } from "../middleware/GeneralAuth.js";
import { chat } from "../controllers/chat.controller.js";
import { rateLimit } from "../middleware/rateLimiter.js";

const upload = multer({
    storage : multer.memoryStorage(),
    limits: {fileSize:5 * 1024 * 1024}
})


chatRoute.post("/chat",GeneralAuth,rateLimit, upload.single('file'),chat)

