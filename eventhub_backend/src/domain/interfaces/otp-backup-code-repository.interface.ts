import type { OtpBackupCodeDoc } from "@/domain/models/otp-backup-code.model";

export interface IOtpBackupCodeRepository {
  save(
    codeBackup: Omit<OtpBackupCodeDoc, "_id" | "createdAt" | "updatedAt">
  ): Promise<OtpBackupCodeDoc>;
  findByUserId(userId: string): Promise<OtpBackupCodeDoc | null>;
  update(doc: OtpBackupCodeDoc): Promise<OtpBackupCodeDoc>;
  deleteByUserId(userId: string): Promise<void>;
}
