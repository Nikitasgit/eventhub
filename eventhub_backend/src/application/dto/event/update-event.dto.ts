export interface UpdateEventInput {
  id: string;
  title?: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  location?: string;
  maxCapacity?: number;
  availableTickets?: number;
  price?: number;
  category?: string;
}
