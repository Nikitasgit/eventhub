import type { User } from "../userSlice";

export class UserService {
  private static users: User[] = [];

  static reset(): void {
    this.users = [];
  }
  static createUser(userData: Omit<User, "id">): User {
    const newUser: User = {
      id: crypto.randomUUID(),
      ...userData,
    };
    this.users.push(newUser);
    return newUser;
  }
  static findByEmail(email: string): User | undefined {
    return this.users.find((user) => user.email === email);
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
