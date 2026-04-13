export function getCodesArray(codes: string): string[] {
  try {
    return JSON.parse(codes);
  } catch {
    return [];
  }
}

export function validateOtpBackupCode(data: {
  codes: string;
  nbCodeUsed: number;
  nbConsecutiveTests: number;
  userId: string;
}): void {
  if (!data.codes) {
    throw new Error("codes is required");
  }
  if (typeof data.nbCodeUsed !== "number" || data.nbCodeUsed < 0) {
    throw new Error("nbCodeUsed must be a non-negative number");
  }
  if (
    typeof data.nbConsecutiveTests !== "number" ||
    data.nbConsecutiveTests < 0
  ) {
    throw new Error("nbConsecutiveTests must be a non-negative number");
  }
  if (!data.userId) {
    throw new Error("userId is required");
  }
}
