export interface EventProps {
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

export class Event {
  props: EventProps;

  constructor(props: EventProps) {
    this.props = props;
  }

  hasEmptyTitle(): boolean {
    return !this.props.title || this.props.title.trim() === "";
  }

  hasEmptyLocation(): boolean {
    return !this.props.location || this.props.location.trim() === "";
  }

  hasStartDateInPast(): boolean {
    const now = new Date();
    return this.props.startDate <= now;
  }

  hasEndDateBeforeStartDate(): boolean {
    return this.props.endDate <= this.props.startDate;
  }

  hasInvalidMaxCapacity(): boolean {
    return this.props.maxCapacity < 1;
  }

  hasAvailableTicketsExceedingCapacity(): boolean {
    return this.props.availableTickets > this.props.maxCapacity;
  }

  hasNegativePrice(): boolean {
    return (
      this.props.price !== null &&
      this.props.price !== undefined &&
      this.props.price < 0
    );
  }
}
