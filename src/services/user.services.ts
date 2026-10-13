import { hash } from 'bcrypt'
import { findUser, getTheUsers, insertUser,getTheGroups } from '../repositories/user.repository'
import { v4 } from 'uuid'
import { type User, type UserInput, Groups } from '../types/user.types'
import { promises } from 'dns'


export const createUser = async (userInput: UserInput): Promise<User | null> => {
    const existingUser = await findUser(userInput.email);
    if (existingUser) {
        return null
    }
    const hashedPassword = await hash(userInput.password, 10)

    const user: User = {
        id: v4(),
        username: userInput.username,
        email: userInput.email,
        password_hash: hashedPassword
    }
    const inserted = await insertUser(user);
    return inserted;
}


export const findUserByEmail = async (email: string): Promise<User | null> => {
    const user = await findUser(email)
    return user
}


export const getUsers = async (): Promise<User[] | null> => {
    const users = getTheUsers();
    return users;
}

export const getGroups = async (member_id:string): Promise<Groups[] | null> => {
    const groups = getTheGroups(member_id);
    return groups;
}