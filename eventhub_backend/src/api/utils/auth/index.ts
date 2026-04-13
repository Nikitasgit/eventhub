import jwt from "jsonwebtoken";
import { getEnvVariable } from "@/api/utils/shared";
import type { UserPayload } from "@/domain/types";

export const extractToken = (authorization: string): string | null => {
  if (!authorization) {
    return null;
  }
  const parts = authorization.trim().split(/\s+/);
  if (parts.length !== 2) {
    return null;
  }
  const [prefix, token] = parts;
  if (prefix !== "Bearer") {
    return null;
  }
  const trimmedToken = token?.replace(/\s+/g, "").trim() ?? null;

  if (!trimmedToken || trimmedToken.length === 0) {
    return null;
  }

  if (trimmedToken.split(".").length !== 3) {
    return null;
  }

  return trimmedToken;
};

export const generateToken = (payload: UserPayload): string => {
  const secret = getEnvVariable("JWT_SECRET");
  return jwt.sign(payload, secret, {
    expiresIn: "1d",
  });
};

const TEMP_2FA_TOKEN_TYPE = "temp_2fa";
const TEMP_2FA_EXPIRES_IN = "5m";

export interface Temp2FAPayload {
  id: string;
  type: typeof TEMP_2FA_TOKEN_TYPE;
}

export const generateTempToken = (userId: string): string => {
  const secret = getEnvVariable("JWT_SECRET");
  return jwt.sign({ id: userId, type: TEMP_2FA_TOKEN_TYPE }, secret, {
    expiresIn: TEMP_2FA_EXPIRES_IN,
  });
};

export const verifyTempToken = (token: string): { id: string } => {
  const secret = getEnvVariable("JWT_SECRET");
  const decoded = jwt.verify(token, secret) as Temp2FAPayload;
  if (decoded.type !== TEMP_2FA_TOKEN_TYPE) {
    throw new Error("Invalid token type");
  }
  return { id: decoded.id };
};
