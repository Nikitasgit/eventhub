import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "./services/apiClient";
import type { RootState } from "../store/store";

export interface User {
  id: string;
  email: string;
  role: string;
  twoFactorEnabled?: boolean;
}

export type LoginResult = { user: User } | { requiresTwoFactor: true };

export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const result = await apiClient.getCurrentUser();
      return result.user;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Erreur lors de la récupération de l'utilisateur");
    }
  },
);

export const signIn = createAsyncThunk<
  LoginResult,
  { email: string; password: string },
  { rejectValue: string }
>("auth/signIn", async ({ email, password }, { rejectWithValue }) => {
  try {
    const result = await apiClient.login(email, password);
    return result;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue("Erreur lors de la connexion");
  }
});

export const verifyTwoFactorAuth = createAsyncThunk<
  User,
  string,
  { rejectValue: string }
>("auth/verifyTwoFactorAuth", async (code, { rejectWithValue }) => {
  try {
    const result = await apiClient.verifyTwoFactorAuth(code);
    return result.user;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue("Code invalide. Veuillez réessayer.");
  }
});

export const verifyBackupCode = createAsyncThunk<
  User,
  string,
  { rejectValue: string }
>("auth/verifyBackupCode", async (code, { rejectWithValue }) => {
  try {
    const result = await apiClient.verifyBackupCode(code);
    return result.user;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue(
      "Code de récupération invalide. Veuillez réessayer.",
    );
  }
});

export const signOut = createAsyncThunk("auth/signOut", async () => {
  await apiClient.logout();
});

type AuthState = {
  user: User | null;
  loading: boolean;
  error: string | null;
  pending2FA: boolean;
};

const initialState: AuthState = {
  user: null,
  loading: true,
  error: null,
  pending2FA: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearPending2FA(state) {
      state.pending2FA = false;
      state.error = null;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCurrentUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchCurrentUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
    });
    builder.addCase(fetchCurrentUser.rejected, (state, action) => {
      state.loading = false;
      state.error =
        (action.payload as string) ||
        "Erreur lors de la récupération de l'utilisateur";
    });

    builder.addCase(signIn.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.pending2FA = false;
    });
    builder.addCase(signIn.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload && "requiresTwoFactor" in action.payload) {
        state.pending2FA = true;
        state.user = null;
      } else if (action.payload && "user" in action.payload) {
        state.user = action.payload.user;
        state.pending2FA = false;
      }
    });
    builder.addCase(signIn.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.payload as string) || "Erreur lors de la connexion";
      state.pending2FA = false;
    });

    builder.addCase(verifyTwoFactorAuth.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(verifyTwoFactorAuth.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.pending2FA = false;
    });
    builder.addCase(verifyTwoFactorAuth.rejected, (state, action) => {
      state.loading = false;
      state.error =
        (action.payload as string) || "Code invalide. Veuillez réessayer.";
    });

    builder.addCase(verifyBackupCode.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(verifyBackupCode.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.pending2FA = false;
    });
    builder.addCase(verifyBackupCode.rejected, (state, action) => {
      state.loading = false;
      state.error =
        (action.payload as string) ||
        "Code de récupération invalide. Veuillez réessayer.";
    });

    builder.addCase(signOut.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(signOut.fulfilled, (state) => {
      state.loading = false;
      state.user = null;
      state.pending2FA = false;
    });
    builder.addCase(signOut.rejected, (state) => {
      state.loading = false;
    });
  },
});

export const { clearPending2FA, clearError } = authSlice.actions;

export default authSlice.reducer;

export const selectAuth = (state: RootState) => state.auth;
