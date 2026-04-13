export interface IQrCodeGenerator {
    generate(email: string, secret: string): Promise<object>;
}