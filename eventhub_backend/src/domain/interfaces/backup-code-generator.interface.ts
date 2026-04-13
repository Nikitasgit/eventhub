export interface IBackupCodeGenerator {
  generate(count: number): Promise<string[]>;
  hashCodes(codes: string[]): Promise<string[]>;
  verifyCode(code: string, hashedCodes: string[]): Promise<boolean>;
}
