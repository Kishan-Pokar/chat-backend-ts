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


export interface Groups {
    group_id: string,
    creator_id: string,
    group_name: string,
    role: string,
    creator_username:string
}