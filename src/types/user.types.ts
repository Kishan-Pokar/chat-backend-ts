export interface User {
    id: string;
    username: string;
    email: string;
    password_hash: string;
}

export interface UserInput {
    username: string;
    email: string;
    password: string;
}