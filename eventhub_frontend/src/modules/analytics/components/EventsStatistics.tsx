import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Box, Paper, Typography } from "@mui/material";
import type { EventStatisticsDto } from "../hooks/useEventsStatistics";

interface EventsStatisticsProps {
  stats: EventStatisticsDto[];
  loading?: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

const chartData = (stats: EventStatisticsDto[]) =>
  stats.map((item) => ({
    name: item.title ?? "Événement inconnu",
    vues: item.viewsCount,
  }));

export const EventsStatistics: React.FC<EventsStatisticsProps> = ({
  stats,
  loading = false,
  hasNext,
  hasPrevious,
  onPrevious,
  onNext,
}) => {
  if (stats.length === 0 && !loading) {
    return (
      <Typography variant="body1" color="text.secondary">
        Aucun événement trouvé pour afficher les statistiques.
      </Typography>
    );
  }

  const data = chartData(stats);

  return (
    <Paper sx={{ mt: 3, p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Vues par événement
      </Typography>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart
          data={data}
          margin={{ top: 8, right: 16, left: 8, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12 }}
            angle={-35}
            textAnchor="end"
            height={80}
          />
          <YAxis allowDecimals={false} />
          <Tooltip
            formatter={(value) => [value ?? 0, "Vues"]}
            labelFormatter={(label) => `Événement : ${label}`}
          />
          <Bar
            dataKey="vues"
            fill="#1976d2"
            name="Vues"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mt: 2,
        }}
      >
        <Box
          component="button"
          disabled={!hasPrevious || loading}
          onClick={() => void onPrevious()}
          style={{
            padding: "8px 16px",
            borderRadius: 4,
            border: "1px solid #ccc",
            backgroundColor: !hasPrevious || loading ? "#f5f5f5" : "#fff",
            cursor: !hasPrevious || loading ? "not-allowed" : "pointer",
          }}
        >
          Précédent
        </Box>
        <Box
          component="button"
          disabled={!hasNext || loading}
          onClick={() => void onNext()}
          style={{
            padding: "8px 16px",
            borderRadius: 4,
            border: "1px solid #ccc",
            backgroundColor: !hasNext || loading ? "#f5f5f5" : "#fff",
            cursor: !hasNext || loading ? "not-allowed" : "pointer",
          }}
        >
          Suivant
        </Box>
      </Box>
    </Paper>
  );
};
