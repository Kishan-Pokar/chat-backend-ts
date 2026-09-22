import { createUser,getUsers,findUserByEmail } from "../services/user.services";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express';
import { UserInput } from "../types/user.types";
import { config } from '../config/index'

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
    try{
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            res.status(400).json({ error: 'username,email and password are required' });
            return;
        }
        const user : UserInput = {
            username:username,
            email:email,
            password:password
        }
        const newUser = await createUser(user);
        if(!newUser){
            res.status(409).json({
                error: "User already exists"
            });
            return
        }
        res.status(201).json({
            message: "user registered successfully",
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
            },
        });
        return
    } catch (error) {
        next(error)
    }
}


export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
    try{
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({
                error: "email and password are required"
            });
            return
        }
        const user = await findUserByEmail(email);
        if (!user) {
            res.status(401).json({
                error: "Invalid Credentials"
            })
            return
        }
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            res.status(401).json({
                error: "Invalid Credentials"
            })
            return
        }
        const token = jwt.sign(
            { userId: user.id },
            config.jwtSecret,
            { expiresIn: '1h' }
        )
        res.json({ token })
        return
    } catch (error) {
        next(error)
    }
}

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
    try{
        const users = await getUsers();
        res.json(users);
        return
    } catch (error) {
        next(error)
    }
}