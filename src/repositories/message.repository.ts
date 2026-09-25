import pool from '../config/db';
import { Message } from '../types/message.types';


export const saveMessage = async (message: Message): Promise<void> => {
    const query = `
    INSERT INTO messages (id, sender_id, receiver_id, content, timestamp, status)
    VALUES ($1, $2, $3, $4, $5, $6)
    `;
    const values = [
        message.id,
        message.from,
        message.to,
        message.content,
        message.timestamp,
        message.status
    ];
    await pool.query(query, values)
}

export const updateMessageStatus = async (
    id: string,
    status: string
): Promise<{ id: string; sender_id: string } | null> => {
    const { rows } = await pool.query(
        `UPDATE messages SET status = $1 WHERE id = $2 RETURNING id, sender_id`,
        [status, id]
    );
    return rows[0] || null;
};

export const getUndeliveredMessages = async (userId: string): Promise<Message[] | null> => {
    const { rows } = await pool.query(
        `SELECT 
            id,
            sender_id as "from",
            receiver_id as "to",
            content,
            timestamp,
            status
        FROM messages
        WHERE receiver_id = $1 AND status != 'DELIVERED' AND status != 'READ'
        ORDER BY timestamp ASC`,
        [userId]
    );
    return rows;
}

export const getAllMessages = async (sender_id: string, receiver_id: string): Promise<Message[] | null> => {
    const { rows } = await pool.query(
        `SELECT
            id,
            sender_id as "from",
            receiver_id as "to",
            content,
            timestamp,
            status
        FROM messages
        WHERE (sender_id = $1 AND receiver_id = $2) OR (sender_id = $2 AND receiver_id = $1)`,
        [sender_id, receiver_id]
    );
    return rows;
}

export const updateMessageStatusToRead = async (fromUserId: string, toUserId: string): Promise<string[]> => {
    const { rows } = await pool.query(
        `UPDATE messages
        SET status = 'READ'
        WHERE sender_id = $1 AND receiver_id = $2 AND status = 'DELIVERED'
        RETURNING id`,
        [fromUserId, toUserId]
    );
    return rows.map((r) => r.id);
}