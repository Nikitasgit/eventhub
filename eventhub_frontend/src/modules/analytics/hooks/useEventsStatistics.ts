import { useEffect, useState } from "react";
import { axiosInstance } from "../../../services";

export interface EventStatisticsDto {
  eventId: string;
  title: string | null;
  viewsCount: number;
}

interface Cursor {
  lastCreatedAt: string;
  lastId: string;
}

const PAGE_SIZE = 10;

export const useEventsStatistics = () => {
  const [stats, setStats] = useState<EventStatisticsDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<Cursor | null>(null);
  const [currentCursor, setCurrentCursor] = useState<Cursor | null>(null);
  const [prevCursors, setPrevCursors] = useState<(Cursor | null)[]>([]);

  const fetchPage = async (cursor: Cursor | null, cursorToPushToHistory?: Cursor | null) => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, string | number> = { limit: PAGE_SIZE };
      if (cursor) {
        params.lastCreatedAt = cursor.lastCreatedAt;
        params.lastId = cursor.lastId;
      }
      const res = await axiosInstance().get("/analytics/event-statistics", { params });
      const data = res.data?.data;

      const list = Array.isArray(data?.stats) ? data.stats : [];
      setStats(
        list.map((item: { event?: string; title?: string | null; viewsCount?: number }) => ({
          eventId: item.event ?? "",
          title: item.title ?? null,
          viewsCount: typeof item.viewsCount === "number" ? item.viewsCount : 0,
        }))
      );

      const next = data?.nextCursor?.lastCreatedAt && data?.nextCursor?.lastId
        ? { lastCreatedAt: data.nextCursor.lastCreatedAt, lastId: data.nextCursor.lastId }
        : null;
      setNextCursor(next);

      if (cursorToPushToHistory !== undefined) {
        setPrevCursors((prev) => [...prev, cursorToPushToHistory]);
      }
      setCurrentCursor(cursor);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger les statistiques des événements.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchPage(null);
  }, []);

  const loadNext = () => {
    if (!nextCursor) return;
    void fetchPage(nextCursor, currentCursor);
  };

  const loadPrevious = () => {
    if (prevCursors.length === 0) return;
    const rest = prevCursors.slice(0, -1);
    const cursor = prevCursors[prevCursors.length - 1] ?? null;
    setPrevCursors(rest);
    void fetchPage(cursor);
  };

  return {
    stats,
    loading,
    error,
    loadNextPage: loadNext,
    loadPreviousPage: loadPrevious,
    hasNext: nextCursor !== null,
    hasPrevious: prevCursors.length > 0,
  };
};
