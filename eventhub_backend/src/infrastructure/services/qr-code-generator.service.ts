import qrcode from "qrcode";
import { generateURI } from "otplib";
import type { IQrCodeGenerator } from "@/domain/interfaces/qr-code-generator.interface";

export class QrCodeService implements IQrCodeGenerator {
  constructor(private readonly appName: string) {}

  async generate(email: string, secret: string) {
    const uri = generateURI({
      issuer: this.appName,
      label: email,
      secret: secret,
    });
    const image = await qrcode.toDataURL(uri);
    return { image, email, secret };
  }
}
