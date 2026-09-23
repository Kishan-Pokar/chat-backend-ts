import { asyncHandler } from "../utils/asyncHandler";
import { Request,Response } from "express";
import { AppError } from "../utils/AppError";
import { getChatHistory } from "../services/message.services";


export const getMessageHistory = asyncHandler(async (req: Request, res: Response) => {
    const currentUserId = req.userId!; 
    const { otherUserId }   = req.params;

    if (!otherUserId) {
        throw new AppError("otherUserId is required", 400);
    }
    if(typeof(otherUserId) !== 'string'){
        throw new AppError("before must be a single value", 400);
    }

    const messages = await getChatHistory(
        currentUserId,
        otherUserId
    );

    res.json(messages);
});