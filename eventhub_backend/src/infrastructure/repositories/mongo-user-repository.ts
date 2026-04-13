import type {
  IUserRepository,
  SaveUserResult,
} from "@/domain/interfaces/user-repository.interface";
import { UserModel, type UserDoc } from "@/domain/models/user.model";

export class MongoUserRepository implements IUserRepository {
  async findById(id: string): Promise<UserDoc | null> {
    const doc = await UserModel.findById(id).lean<UserDoc>().exec();
    return doc ?? null;
  }

  async findByEmail(email: string): Promise<UserDoc | null> {
    const doc = await UserModel.findOne({ email }).lean<UserDoc>().exec();
    return doc ?? null;
  }

  async findAll(): Promise<UserDoc[]> {
    return UserModel.find().lean<UserDoc[]>().exec();
  }

  async save(
    user: Omit<UserDoc, "_id" | "createdAt" | "updatedAt">
  ): Promise<SaveUserResult> {
    const created = await UserModel.create(user);

    return {
      id: created._id.toString(),
      email: created.email,
      role: created.role,
    };
  }

  async update(user: UserDoc): Promise<SaveUserResult> {
    const updated = await UserModel.findOneAndUpdate(
      { _id: user._id },
      {
        email: user.email,
        password: user.password,
        role: user.role,
        otpSecret: user.otpSecret ?? null,
        otpEnable: user.otpEnable,
      },
      { new: true }
    ).exec();

    if (!updated) {
      return this.save(user);
    }

    return {
      id: updated._id.toString(),
      email: updated.email,
      role: updated.role,
    };
  }
}
