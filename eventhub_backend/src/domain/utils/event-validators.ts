import type { EventData } from "@/domain/types/event.types";

export function hasEmptyTitle(event: { title: string }): boolean {
  return !event.title || event.title.trim() === "";
}

export function hasEmptyLocation(event: { location: string }): boolean {
  return !event.location || event.location.trim() === "";
}

export function hasStartDateInPast(event: { startDate: Date }): boolean {
  return event.startDate <= new Date();
}

export function hasEndDateBeforeStartDate(event: {
  startDate: Date;
  endDate: Date;
}): boolean {
  return event.endDate <= event.startDate;
}

export function hasInvalidMaxCapacity(event: { maxCapacity: number }): boolean {
  return event.maxCapacity < 1;
}

export function hasAvailableTicketsExceedingCapacity(event: {
  maxCapacity: number;
  availableTickets: number;
}): boolean {
  return event.availableTickets > event.maxCapacity;
}

export function hasNegativePrice(event: {
  price: number | null;
}): boolean {
  return (
    event.price !== null &&
    event.price !== undefined &&
    event.price < 0
  );
}

export function validateEvent(event: EventData): void {
  if (hasEmptyTitle(event)) {
    throw new Error("EVENT_TITLE_REQUIRED");
  }
  if (hasStartDateInPast(event)) {
    throw new Error("EVENT_START_DATE_MUST_BE_FUTURE");
  }
  if (hasEndDateBeforeStartDate(event)) {
    throw new Error("EVENT_END_DATE_MUST_BE_AFTER_START");
  }
  if (hasEmptyLocation(event)) {
    throw new Error("EVENT_LOCATION_REQUIRED");
  }
  if (hasInvalidMaxCapacity(event)) {
    throw new Error("EVENT_MAX_CAPACITY_INVALID");
  }
  if (hasAvailableTicketsExceedingCapacity(event)) {
    throw new Error("EVENT_AVAILABLE_TICKETS_EXCEED_CAPACITY");
  }
  if (hasNegativePrice(event)) {
    throw new Error("EVENT_PRICE_MUST_BE_POSITIVE");
  }
}
