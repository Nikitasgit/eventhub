export interface CreateEventInput {
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  location: string;
  maxCapacity: number;
  availableTickets: number;
  price?: number;
  category: string;
  organizer: string;
}
