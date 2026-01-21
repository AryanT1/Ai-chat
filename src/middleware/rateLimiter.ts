import type { Response, NextFunction } from "express";
import type { AuthRequest } from "./GeneralAuth.js";
import redis from "../db/redis.js";
import prisma from "../db/prisma.js";
import { get3AMExpiry, today } from "../utils/time.js";

export const rateLimit = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(402).json({ error: "unauthorized" });
    }
    const userkey = `user:${userId}`;
    let isPro = false;
    const chashedUser = await redis.get(userkey);

    if (chashedUser) {
      const user = JSON.parse(chashedUser);
      isPro = user.isPro;
    } else {
      const dbUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { isPro: true },
      });

      isPro = dbUser?.isPro || false;
    }
    if (isPro) {
      return next();
    }

    const chatKey = `chat:${userId}:${today}`;
    const chats = await redis.get(chatKey);
    const chatCount = parseInt(chats || "0");

    if (chatCount >= 10) {
      return res.status(429).json({
        error: "Daily limit reached",
        message: "Upgrade to Pro for unlimited chats",
        chatsUsed: chatCount,
        limit: 10,
      });
    }

    await redis.incr(chatKey);
    await redis.expireat(chatKey, get3AMExpiry());
    next();
  } catch (error) {
    console.error("Rate limit error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
