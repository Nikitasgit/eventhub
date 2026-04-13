import { randomBytes } from "crypto";
import bcrypt from "bcrypt";
import type { IBackupCodeGenerator } from "@/domain/interfaces/backup-code-generator.interface";

export class BackupCodeService implements IBackupCodeGenerator {
  async generate(count: number): Promise<string[]> {
    const codes: string[] = [];
    for (let i = 0; i < count; i++) {
      const codePart1 = randomBytes(6).toString("hex").toUpperCase().substring(0, 6);
      const codePart2 = randomBytes(6).toString("hex").toUpperCase().substring(0, 6);
      codes.push(`${codePart1}-${codePart2}`);
    }
    return codes;
  }

  async hashCodes(codes: string[]): Promise<string[]> {
    const hashedCodes = await Promise.all(
      codes.map((code) => bcrypt.hash(code, 10))
    );
    return hashedCodes;
  }

  async verifyCode(code: string, hashedCodes: string[]): Promise<boolean> {
    for (const hashedCode of hashedCodes) {
      const isValid = await bcrypt.compare(code, hashedCode);
      if (isValid) {
        return true;
      }
    }
    return false;
  }
}
