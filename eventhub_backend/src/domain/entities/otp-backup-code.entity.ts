export interface OtpBackupCodeProps {
  id: string;
  userId: string;
  codes: string;
  nbCodeUsed: number;
  nbConsecutiveTests: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class OtpBackupCode {
  constructor(public props: OtpBackupCodeProps) {}

  validateOrThrow(): void {
    if (!this.props.codes) {
      throw new Error("codes is required");
    }

    if (typeof this.props.nbCodeUsed !== "number" || this.props.nbCodeUsed < 0) {
      throw new Error("nbCodeUsed must be a non-negative number");
    }

    if (
      typeof this.props.nbConsecutiveTests !== "number" ||
      this.props.nbConsecutiveTests < 0
    ) {
      throw new Error("nbConsecutiveTests must be a non-negative number");
    }

    if (!this.props.userId) {
      throw new Error("userId is required");
    }
  }

  getCodesArray(): string[] {
    try {
      return JSON.parse(this.props.codes);
    } catch {
      return [];
    }
  }

  isValidCode(code: string): boolean {
    const codes = this.getCodesArray();
    return codes.includes(code);
  }

  markCodeAsUsed(code: string): void {
    const codes = this.getCodesArray();
    const index = codes.indexOf(code);
    if (index > -1) {
      codes.splice(index, 1);
      this.props.codes = JSON.stringify(codes);
      this.props.nbCodeUsed += 1;
    }
  }
}
