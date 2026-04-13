import { axiosInstance } from "../../../services";

export const recordEventView = async (
  ref: string,
  userId?: string | null
): Promise<void> => {
  try {
    await axiosInstance({ withCredentials: false }).post(
      "/analytics/event-view",
      {
        refType: "event",
        ref,
        userId,
        action: "view",
      }
    );
  } catch (error) {
    console.error("Failed to record event view", error);
  }
};

