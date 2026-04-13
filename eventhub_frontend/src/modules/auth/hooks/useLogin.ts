import { useState, useCallback } from "react";
import { useAuth } from "./useAuth";
import { useForm } from "../../common/hooks/useForm";
import { useAppDispatch } from "../../store/store";
import { clearPending2FA } from "../authSlice";

interface LoginFormData {
  email: string;
  password: string;
}

export const useLogin = () => {
  const {
    login: authLogin,
    verifyTwoFactor,
    verifyBackupCode: authVerifyBackupCode,
    loading,
    pending2FA,
    error: authError,
  } = useAuth();
  const dispatch = useAppDispatch();
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [mode, setMode] = useState<"totp" | "backupCode">("totp");

  const { formData, state, handleChange, handleSubmit } =
    useForm<LoginFormData>({
      initialState: { email: "", password: "" },
      validate: (data) => {
        if (!data.email || !data.password) {
          return "Veuillez remplir tous les champs";
        }
        return null;
      },
      onSubmit: async (data) => {
        await authLogin(data.email, data.password);
      },
      resetOnSuccess: true,
    });

  const step = pending2FA ? "twoFactor" : "credentials";
  const isFormValid = formData.email !== "" && formData.password !== "";

  const error = step === "twoFactor" ? authError : state.error;

  const handleVerifyTwoFactor = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!twoFactorCode.trim()) return;
      try {
        await verifyTwoFactor(twoFactorCode.trim());
      } catch (err) {
        console.error(err);
      }
    },
    [twoFactorCode, verifyTwoFactor],
  );

  const handleVerifyBackupCode = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!twoFactorCode.trim()) return;
      try {
        await authVerifyBackupCode(twoFactorCode.trim());
      } catch (err) {
        console.error(err);
      }
    },
    [twoFactorCode, authVerifyBackupCode],
  );

  const handleBackToCredentials = useCallback(() => {
    dispatch(clearPending2FA());
    setTwoFactorCode("");
    setMode("totp");
  }, [dispatch]);

  const handleSwitchToBackupCode = useCallback(() => {
    setMode("backupCode");
    setTwoFactorCode("");
  }, []);

  const handleSwitchToTotp = useCallback(() => {
    setMode("totp");
    setTwoFactorCode("");
  }, []);

  const isBackupCodeValid = /^[A-Z0-9]{6}-[A-Z0-9]{6}$/.test(
    twoFactorCode.trim().toUpperCase(),
  );

  return {
    step,
    mode,
    formData,
    twoFactorCode,
    setTwoFactorCode,
    state: { ...state, loading, error },
    handleChange,
    handleSubmit,
    handleVerifyTwoFactor,
    handleVerifyBackupCode,
    handleBackToCredentials,
    handleSwitchToBackupCode,
    handleSwitchToTotp,
    isFormValid,
    isTwoFactorCodeValid: /^\d{6}$/.test(twoFactorCode.trim()),
    isBackupCodeValid,
  };
};
