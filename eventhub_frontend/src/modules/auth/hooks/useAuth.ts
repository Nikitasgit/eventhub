import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  selectAuth,
  signIn,
  signOut,
  fetchCurrentUser,
  verifyTwoFactorAuth,
  verifyBackupCode as verifyBackupCodeThunk,
} from "../authSlice";
import type { User } from "../authSlice";
import { useAppDispatch } from "../../store/store";

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  pending2FA: boolean;
  login: (email: string, password: string) => Promise<void>;
  verifyTwoFactor: (code: string) => Promise<void>;
  verifyBackupCode: (code: string) => Promise<void>;
  logout: () => Promise<void>;
  refetch: () => Promise<void>;
}

export const useAuth = (): AuthState => {
  const { user, loading, error, pending2FA } = useSelector(selectAuth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    const result = await dispatch(signIn({ email, password })).unwrap();
    if (result && "requiresTwoFactor" in result) {
      return;
    }
    await dispatch(fetchCurrentUser()).unwrap();
    navigate("/profile");
  };

  const verifyTwoFactor = async (code: string) => {
    await dispatch(verifyTwoFactorAuth(code)).unwrap();
    await dispatch(fetchCurrentUser()).unwrap();
    navigate("/profile");
  };

  const verifyBackupCode = async (code: string) => {
    await dispatch(verifyBackupCodeThunk(code)).unwrap();
    await dispatch(fetchCurrentUser()).unwrap();
    navigate("/profile");
  };

  const logout = async () => {
    await dispatch(signOut()).unwrap();
    navigate("/login");
  };

  const refetch = async () => {
    try {
      await dispatch(fetchCurrentUser()).unwrap();
    } catch {
      // Ignore errors on refetch
    }
  };

  return {
    user,
    loading,
    error,
    pending2FA,
    login,
    verifyTwoFactor,
    verifyBackupCode,
    logout,
    refetch,
  };
};
