export interface Message{
    id:string,
    from:string,
    to:string,
    content:string,
    timestamp:string,
    status: 'PENDING' | 'SENT' | 'DELIVERED' | 'READ'
}

export interface SendMessagePayload {
  to: string;
  content: string;
}