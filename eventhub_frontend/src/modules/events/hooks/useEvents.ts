import { useEffect, useState } from "react";
import { axiosInstance } from "../../../services";

export interface EventDto {
  id: string;
  title: string;
  description: string | null;
  startDate: string;
  endDate: string;
  location: string;
  maxCapacity: number;
  availableTickets: number;
  price: number | null;
  categoryId: string;
  organizerId: string;
}

interface UseEventsState {
  events: EventDto[];
  loading: boolean;
  error: string | null;
  loadNextPage: () => Promise<void>;
  loadPreviousPage: () => Promise<void>;
  hasNext: boolean;
  hasPrevious: boolean;
}

interface CursorState {
  lastCreatedAt: string;
  lastId: string;
}

export const useEvents = (): UseEventsState => {
  const [events, setEvents] = useState<EventDto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [cursor, setCursor] = useState<CursorState | null>(null);
  const [nextCursor, setNextCursor] = useState<CursorState | null>(null);
  const [cursorHistory, setCursorHistory] = useState<CursorState[]>([]);

  const fetchPage = async (
    targetCursor: CursorState | null,
    options?: { pushHistory?: boolean }
  ) => {
    setLoading(true);
    setError(null);

    const MIN_LOADING_DURATION_MS = 300;
    const startTime = Date.now();

    try {
      const params: Record<string, string | number> = { limit: 5 };

      if (targetCursor) {
        params.lastCreatedAt = targetCursor.lastCreatedAt;
        params.lastId = targetCursor.lastId;
      }

      const response = await axiosInstance().get("/events", { params });
      const payload = response.data?.data;

      const eventsData = Array.isArray(payload?.events) ? payload.events : [];
      setEvents(eventsData);

      const newNextCursor =
        payload?.nextCursor &&
        payload.nextCursor.lastCreatedAt &&
        payload.nextCursor.lastId
          ? {
              lastCreatedAt: payload.nextCursor.lastCreatedAt as string,
              lastId: payload.nextCursor.lastId as string,
            }
          : null;

      if (options?.pushHistory && cursor) {
        setCursorHistory((prev) => [...prev, cursor]);
      }

      setCursor(targetCursor);
      setNextCursor(newNextCursor);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger les événements.");
    } finally {
      const elapsed = Date.now() - startTime;
      const remaining = MIN_LOADING_DURATION_MS - elapsed;

      if (remaining > 0) {
        setTimeout(() => {
          setLoading(false);
        }, remaining);
      } else {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    void fetchPage(null);
  }, []);

  const loadNextPage = async () => {
    if (!nextCursor) return;
    await fetchPage(nextCursor, { pushHistory: true });
  };

  const loadPreviousPage = async () => {
    if (cursorHistory.length === 0) return;

    const previousHistory = [...cursorHistory];
    const previousCursor = previousHistory.pop() ?? null;

    setCursorHistory(previousHistory);
    await fetchPage(previousCursor);
  };

  return {
    events,
    loading,
    error,
    loadNextPage,
    loadPreviousPage,
    hasNext: nextCursor !== null,
    hasPrevious: cursorHistory.length > 0,
  };
};
