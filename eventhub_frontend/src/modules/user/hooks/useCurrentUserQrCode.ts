import { useState, useCallback } from "react";
import { apiClient } from "../../auth/services/apiClient";

interface QrCodeData {
  image: string;
  email: string;
  secret: string;
}

interface UseCurrentUserQrCodeState {
  loading: boolean;
  error: string | null;
  qrCode: QrCodeData | null;
}

export const useCurrentUserQrCode = () => {
  const [state, setState] = useState<UseCurrentUserQrCodeState>({
    loading: false,
    error: null,
    qrCode: null,
  });

  const fetchQrCode = useCallback(async () => {
    setState({ loading: true, error: null, qrCode: null });

    try {
      const result = await apiClient.getQrCode();
      setState({ loading: false, error: null, qrCode: result.qrCode });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Erreur lors de la récupération du QR code";
      setState({ loading: false, error: errorMessage, qrCode: null });
    }
  }, []);

  const reset = useCallback(() => {
    setState({ loading: false, error: null, qrCode: null });
  }, []);

  return {
    ...state,
    fetchQrCode,
    reset,
  };
};
