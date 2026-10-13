import pool from '../config/db'
import { QueryResult } from 'pg'
import { User,Groups } from '../types/user.types'
import { AppError } from '../utils/AppError';


export const insertUser = async (user: User): Promise<User> => {
    const result: QueryResult<User> = await pool.query(
        `INSERT INTO users (id, username, email, password_hash)
        VALUES ($1, $2, $3, $4)
        RETURNING *`,
        [user.id, user.username, user.email, user.password_hash]
    );

    const inserted = result.rows[0];
    if (!inserted) {
        throw new AppError('User insertion failed', 500);
    }

    return inserted;
};

export const findUser = async (email: string): Promise<User | null> => {
    const result: QueryResult<User> = await pool.query(
        `SELECT id, username, email, password_hash FROM users WHERE email = $1`,
        [email]
    );

    return result.rows[0] || null;
};

export const getTheUsers = async (): Promise<User[]> => {
    const result: QueryResult<User> = await pool.query(
        `SELECT id, username, email FROM users`
    );
    return result.rows;
};

export const getTheGroups = async (member_id:string): Promise<Groups[]> => {
    const result: QueryResult<Groups> = await pool.query(
        `SELECT
            g.id as group_id,
            g.creator_id,
            g.name as group_name,
            gm.role,
            u.username as creator_username
        FROM groups_name AS g
        JOIN group_members AS gm
            ON gm.group_id = g.id
        JOIN users AS u
            ON u.id = g.creator_id
        WHERE gm.member_id = $1;`,
        [member_id]);
    return result.rows;
}