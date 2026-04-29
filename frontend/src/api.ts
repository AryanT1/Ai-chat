import axios from 'axios';

export const api = axios.create({
  baseURL: '/api/v1',
  withCredentials: true, // Crucial for sending/receiving HTTP-only cookies
});

export interface User {
  id: string;
  name: string;
  email: string;
  chats: number;
}
