/** Données pour validation (CreateEventInput ou EventDoc) */
export interface EventData {
  title: string;
  description: string | null;
  startDate: Date;
  endDate: Date;
  location: string;
  maxCapacity: number;
  availableTickets: number;
  price: number | null;
  category?: string;
  organizer?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string | null;
  startDate: Date;
  endDate: Date;
  location: string;
  maxCapacity: number;
  availableTickets: number;
  price: number | null;
  category: string;
  organizer: string;
  createdAt: Date;
  updatedAt: Date;
}
