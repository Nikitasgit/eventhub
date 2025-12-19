import { nanoid } from "nanoid";
import type { User } from "../userSlice";

export class UserService {
  private static users: User[] = [];
  static createUser(userData: Omit<User, "id">): User {
    const newUser: User = {
      id: nanoid(),
      ...userData,
    };
    this.users.push(newUser);
    return newUser;
  }
  static findByEmail(email: string): User | undefined {
    return this.users.find((user) => user.email === email);
  }

  static authenticate(email: string, password: string): User | undefined {
    const user = this.findByEmail(email);
    // En production, on comparerait password avec un hash
    if (!user) {
      return undefined;
    }
    return user;
  }

  static updateUser(
    userId: string,
    updates: Partial<Omit<User, "id">>
  ): User | undefined {
    const userIndex = this.users.findIndex((user) => user.id === userId);
    if (userIndex === -1) {
      return undefined;
    }
    this.users[userIndex] = {
      ...this.users[userIndex],
      ...updates,
    };

    return this.users[userIndex];
  }

  static emailExists(email: string): boolean {
    return this.users.some((user) => user.email === email);
  }
}
