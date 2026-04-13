import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Stack,
} from "@mui/material";
import type { EventDto } from "../hooks/useEvents";

interface EventDetailsModalProps {
  open: boolean;
  event: EventDto | null;
  onClose: () => void;
}

export const EventDetailsModal: React.FC<EventDetailsModalProps> = ({
  open,
  event,
  onClose,
}) => {
  if (!event) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{event.title}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          {event.description && (
            <Typography variant="body1">{event.description}</Typography>
          )}
          <Typography variant="body2" color="text.secondary">
            Du {new Date(event.startDate).toLocaleString()} au{" "}
            {new Date(event.endDate).toLocaleString()}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Lieu : {event.location}
          </Typography>
          {event.price !== null && (
            <Typography variant="body2" color="text.secondary">
              Prix : {event.price} €
            </Typography>
          )}
          <Typography variant="body2" color="text.secondary">
            Capacité max : {event.maxCapacity} - Tickets disponibles :{" "}
            {event.availableTickets}
          </Typography>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Fermer</Button>
      </DialogActions>
    </Dialog>
  );
};

