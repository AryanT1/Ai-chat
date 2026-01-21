import { response, type Response } from "express";
import type { AuthRequest } from "../middleware/GeneralAuth.js";
import z from "zod";
import OpenAI from "openai";
import prisma from "../db/prisma.js";
const openai = new OpenAI({
    apiKey: process.env.API_KEY,
    baseURL: "https://openrouter.ai/api/v1"
})


export const chat = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const requestData = z.object({
      message: z.string().min(1, "Message cannot be empty"),
    });
    const parsdata = requestData.safeParse(req.body);
    if (!parsdata.success) {
      return res.status(400).json({ err: "validation error" });
    }
    const { message } = parsdata.data;

    
    const messages: any[] = [{ role: "user", content: message }];

    const file = req.file;
    if (file) {
        // For now, just text files - expand later for PDFs
        const fileContent = file.buffer.toString('utf-8');
        messages[0].content = `Context from file:\n${fileContent}\n\nUser question: ${message}`;
      }
      const completion = await openai.chat.completions.create({
        model: 'openai/gpt-4o-mini',
        messages: messages
      }) 
      const aiResponse = completion.choices[0]?.message?.content || "No response"

      await prisma.chat.create({
        data:{
            userId,
            message,
            response: aiResponse,
            fileUrl: file? file.originalname: null,
            model: 'gpt-4o-mini'
        }

      })

      return res.status(200).json({
        message,
        response:aiResponse,
        model: 'gpt-4o-mini',
        hasFile: !!file
      });

  } 
  catch (error:any) {
    console.error('Chat error:', error);
    return res.status(500).json({ 
      error: 'Failed to process chat',
      details: error.message 
    });
  }
};
