import React from "react";
import { Box, Typography, CircularProgress, Alert } from "@mui/material";
import { useEventsStatistics } from "../hooks/useEventsStatistics";
import { EventsStatistics } from "../components/EventsStatistics";

const DashboardPage: React.FC = () => {
  const {
    stats,
    loading,
    error,
    loadNextPage,
    loadPreviousPage,
    hasNext,
    hasPrevious,
  } = useEventsStatistics();

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard des événements
      </Typography>

      {loading && stats.length === 0 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Box sx={{ mt: 2 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}

      {!error && (
        <EventsStatistics
          stats={stats}
          loading={loading}
          hasNext={hasNext}
          hasPrevious={hasPrevious}
          onPrevious={loadPreviousPage}
          onNext={loadNextPage}
        />
      )}
    </Box>
  );
};

export default DashboardPage;
