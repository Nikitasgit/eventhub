import "dotenv/config";
import { ERROR_MESSAGES } from "@/shared/constants/error-messages";

export const getEnvVariable = (variableName: string): string => {
  const value = process.env[variableName];
  if (!value) {
    throw new Error(ERROR_MESSAGES.ENVIRONMENT_VARIABLE_NOT_SET(variableName));
  }
  return value;
};
