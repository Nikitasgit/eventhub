import type { UserDoc } from "@/domain/models/user.model";

export interface SaveUserResult {
  id: string;
  email: string;
  role: string;
}

export interface IUserRepository {
  findById(id: string): Promise<UserDoc | null>;
  findByEmail(email: string): Promise<UserDoc | null>;
  findAll(): Promise<UserDoc[]>;
  save(user: Omit<UserDoc, "_id" | "createdAt" | "updatedAt">): Promise<SaveUserResult>;
  update(user: UserDoc): Promise<SaveUserResult>;
}
