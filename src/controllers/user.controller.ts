import z from "zod";
import bcrypt from "bcrypt";
import type { Response, Request } from "express";

import prisma from "../db/prisma.js";
import { generateTOKEN } from "../utils/generateTOKEN.js";
import type { AuthRequest } from "../middleware/GeneralAuth.js";
import redis from "../db/redis.js";
import { get3AMExpiry, today } from "../utils/time.js";

export const signup = async (req: Request, res: Response) => {
  try {
    const requestdata = z.object({
      email: z.string().email("Invalid email address"),
      password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(100, "Password too long"),
    });
    const parsdata = requestdata.safeParse(req.body);
    if (!parsdata.success) {
      return res.status(400).json({ err: "validation error" });
    }
    const {  email, password } = parsdata.data;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      return res.status(400).json({ error: "user already exist" });
    }
    const newuser = await prisma.user.create({
      data: {
       
        email,
        password: hashedPassword,
      },
    });
    if (newuser) {
      const token = generateTOKEN(newuser.id);
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
      return res
        .status(200)
        .json({ id: newuser.id,  email: newuser.email });
    }
  } catch (err: any) {
    console.log("Error in signup controller:", err);
    console.log("Error message:", err.message);
    return res.status(500).json({ error: "internal server error in signup" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const requiredData = z.object({
      email: z.string().email("Invalid email address"),
      password: z.string().min(6, "Password is required"),
    });

    const parsdata = requiredData.safeParse(req.body);
    if (!parsdata.success) {
      return res.status(400).json({ err: "validation error" });
    }

    const { email, password } = parsdata.data;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "user does not exist" });
    }

    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
      return res.status(400).json({ error: "invalid password" });
    }
    const token = generateTOKEN(user.id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    return res
      .status(200)
      .json({ id: user.id,  email: user.email });
  } catch (err: any) {
    console.log("error in login controller");
    return res.status(500).json({ error: "internal server error in login" });
  }
};

export const me = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res
        .status(401)
        .json({ error: "Unauthorized - user not found on request" });
    }
    
    const redisKey = `user:${userId}`;
    const chatKey = `chat:${userId}:${today}`;
    let cashedUser = await redis.get(redisKey);
    if (cashedUser) {
      const user = JSON.parse(cashedUser);

      const chatsTodayRedis = await redis.get(chatKey);
      user.chatsToday = parseInt(chatsTodayRedis || "0");

      return res
        .status(200)
        .json({
          id: user.id,
          email: user.email,
          isPro: user.isPro,
          planId: user.planId,
          chatsToday: user.chatsToday,
        });
    }
    const dbuser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        isPro: true,
        planId: true,
        chatsToday: true,
      },
    });

    if (!dbuser) {
      return res.status(404).json({ error: "User not found" });
    }
    const chatsTodayRedis = await redis.get(chatKey);
    const chatsToday = parseInt(chatsTodayRedis || "0");
    const userToCashe = {
      id: dbuser.id,
      email: dbuser.email,
      isPro: dbuser.isPro,
      planId: dbuser.planId,
    };

    await redis.set(redisKey, JSON.stringify(userToCashe));
    await redis.expireat(redisKey, get3AMExpiry());

    return res.status(200).json({
      id: dbuser.id,
      email: dbuser.email,
      isPro: dbuser.isPro,
      planId: dbuser.planId,
      chatsToday: chatsToday,
    });
  } catch (err: any) {
    console.log("error in me controller");
    return res.status(500).json({ error: "internal server error in me" });
  }
};
