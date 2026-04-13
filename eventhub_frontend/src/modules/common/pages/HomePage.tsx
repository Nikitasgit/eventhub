import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  CircularProgress,
  Alert,
  Skeleton,
} from "@mui/material";
import { useEvents, type EventDto } from "../../events/hooks/useEvents";
import { EventDetailsModal } from "../../events/components/EventDetailsModal";
import { recordEventView } from "../../analytics/api/analyticsApi";
import { useAuth } from "../../auth/hooks";

export const HomePage: React.FC = () => {
  const {
    events,
    loading,
    error,
    loadNextPage,
    loadPreviousPage,
    hasNext,
    hasPrevious,
  } = useEvents();
  const { user } = useAuth();
  const [selectedEvent, setSelectedEvent] = useState<EventDto | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenEvent = async (event: EventDto) => {
    setSelectedEvent(event);
    setModalOpen(true);
    void recordEventView(event.id, user?.id ?? null);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Tous les événements
      </Typography>

      {loading && events.length === 0 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Box sx={{ mt: 2 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}

      {!loading && !error && events.length === 0 && (
        <Typography variant="body1" color="text.secondary">
          Aucun événement disponible pour le moment.
        </Typography>
      )}

      <Grid container spacing={2} sx={{ mt: 2 }}>
        {loading
          ? Array.from({ length: 5 }).map((_, index) => (
              <Grid item key={index} xs={12} sm={6} md={4}>
                <Card>
                  <CardContent>
                    <Skeleton variant="text" width="80%" height={28} />
                    <Skeleton
                      variant="text"
                      width="60%"
                      height={20}
                      sx={{ mt: 1, mb: 1 }}
                    />
                    <Skeleton variant="text" width="70%" height={20} />
                  </CardContent>
                </Card>
              </Grid>
            ))
          : events.map((event) => (
              <Grid item key={event.id} xs={12} sm={6} md={4}>
                <Card>
                  <CardActionArea onClick={() => handleOpenEvent(event)}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom noWrap>
                        {event.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        {event.location}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(event.startDate).toLocaleDateString()} -{" "}
                        {new Date(event.endDate).toLocaleDateString()}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
      </Grid>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mt: 4,
        }}
      >
        <Box
          component="button"
          disabled={!hasPrevious || loading}
          onClick={() => {
            void loadPreviousPage();
          }}
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
          onClick={() => {
            void loadNextPage();
          }}
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

      <EventDetailsModal
        open={modalOpen}
        event={selectedEvent}
        onClose={handleCloseModal}
      />
    </Box>
  );
};
