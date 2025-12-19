export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface PasswordCriteria {
  hasMinLength: boolean;
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  hasDigit: boolean;
  hasSpecialChar: boolean;
}

const SPECIAL_CHARS = "+=%#/*!?,.";

export class PasswordValidator {
  static validate(password: string): PasswordValidationResult {
    const criteria = this.checkCriteria(password);
    const errors: string[] = [];

    if (!criteria.hasMinLength) {
      errors.push("Le mot de passe doit contenir au moins 12 caractères");
    }
    if (!criteria.hasUpperCase) {
      errors.push("Le mot de passe doit contenir au moins une majuscule");
    }
    if (!criteria.hasLowerCase) {
      errors.push("Le mot de passe doit contenir au moins une minuscule");
    }
    if (!criteria.hasDigit) {
      errors.push("Le mot de passe doit contenir au moins un chiffre");
    }
    if (!criteria.hasSpecialChar) {
      errors.push(
        `Le mot de passe doit contenir au moins un caractère spécial (${SPECIAL_CHARS})`
      );
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static checkCriteria(password: string): PasswordCriteria {
    return {
      hasMinLength: password.length >= 12,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasDigit: /[0-9]/.test(password),
      hasSpecialChar: new RegExp(
        `[${SPECIAL_CHARS.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}]`
      ).test(password),
    };
  }
}
