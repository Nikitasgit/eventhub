import type { IOtpBackupCodeRepository } from "@/domain/interfaces/otp-backup-code-repository.interface";
import {
  OtpBackupCodeModel,
  type OtpBackupCodeDoc,
} from "@/domain/models/otp-backup-code.model";

export class MongoOtpBackupCodeRepository implements IOtpBackupCodeRepository {
  async save(
    codeBackup: Omit<OtpBackupCodeDoc, "_id" | "createdAt" | "updatedAt">
  ): Promise<OtpBackupCodeDoc> {
    const created = await OtpBackupCodeModel.create(codeBackup);

    return {
      _id: created._id,
      userId: created.userId,
      codes: created.codes,
      nbCodeUsed: created.nbCodeUsed,
      nbConsecutiveTests: created.nbConsecutiveTests,
      createdAt: created.createdAt as Date,
      updatedAt: created.updatedAt as Date,
    };
  }

  async findByUserId(userId: string): Promise<OtpBackupCodeDoc | null> {
    const doc = await OtpBackupCodeModel.findOne({ userId })
      .lean<OtpBackupCodeDoc>()
      .exec();
    return doc ?? null;
  }

  async update(doc: OtpBackupCodeDoc): Promise<OtpBackupCodeDoc> {
    const updated = await OtpBackupCodeModel.findOneAndUpdate(
      { _id: doc._id },
      {
        codes: doc.codes,
        nbCodeUsed: doc.nbCodeUsed,
        nbConsecutiveTests: doc.nbConsecutiveTests,
      },
      { new: true }
    )
      .lean<OtpBackupCodeDoc>()
      .exec();

    if (!updated) {
      return this.save(doc);
    }

    return updated;
  }

  async deleteByUserId(userId: string): Promise<void> {
    await OtpBackupCodeModel.deleteOne({ userId }).exec();
  }
}
