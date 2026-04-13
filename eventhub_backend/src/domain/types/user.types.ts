export interface UserPayload {
  id: string;
  email: string;
  role: string;
}

export interface User {
  id: string;
  email: string;
  password: string;
  role: string;
  otpSecret: string | null;
  otpEnable: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserInput {
  email: string;
  password: string;
  role: string;
  otpSecret?: string | null;
  otpEnable?: number;
}

export interface UpdateUserInput {
  id: string;
  email: string;
  password: string;
  role: string;
  otpSecret?: string | null;
  otpEnable: number;
}
