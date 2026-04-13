export interface OtpBackupCode {
  id: string;
  userId: string;
  codes: string;
  nbCodeUsed: number;
  nbConsecutiveTests: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateOtpBackupCodeInput {
  userId: string;
  codes: string;
  nbCodeUsed?: number;
  nbConsecutiveTests?: number;
}
