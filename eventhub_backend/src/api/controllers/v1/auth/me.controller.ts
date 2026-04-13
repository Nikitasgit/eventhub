import type { Request, Response, NextFunction } from "express";
import { MongoUserRepository } from "@/infrastructure/repositories";

export class MeController {
  private userRepository: MongoUserRepository;

  constructor() {
    this.userRepository = new MongoUserRepository();
  }

  handle = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        return res.jsonError("Utilisateur non authentifié", 401);
      }

      const user = await this.userRepository.findById(req.user.id);
      if (!user) {
        return res.jsonError("Utilisateur non trouvé", 404);
      }

      res.jsonSuccess(
        {
          user: {
            id: user._id.toString(),
            email: user.email,
            role: user.role,
            twoFactorEnabled: user.otpEnable === 1,
          },
        },
        200
      );
    } catch (error) {
      next(error);
    }
  };
}
