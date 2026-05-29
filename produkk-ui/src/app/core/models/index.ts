export interface User {
  userId: number;
  username: string;
}

export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: 'to-do' | 'active' | 'completed';
  createdAt: string;
  userId: number;
}

export interface AuthResponse {
  access_token: string;
}

export interface MessageResponse {
  message: string;
}
