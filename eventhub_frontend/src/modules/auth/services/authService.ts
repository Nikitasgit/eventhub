import { UserService } from "../../user/services/userService";
import type { User } from "../../user/userSlice";

export class AuthService {
  static authenticate(email: string, password: string): User | undefined {
    const user = UserService.findByEmail(email);
    // Dans le cadre de la démo, le mot de passe n'est pas enregistré ni vérifié.
    void password; // évite erreur TS
    if (!user) {
      return undefined;
    }
    return user;
  }
}
