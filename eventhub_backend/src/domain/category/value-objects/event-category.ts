import { ERROR_MESSAGES } from "@/shared/constants/error-messages";

export class EventCategory {
  private readonly id: string;
  private readonly name: string;

  constructor(id: string, name: string) {
    if (!id) {
      throw new Error(ERROR_MESSAGES.EVENT_CATEGORY_ID_REQUIRED_VALUE_OBJECT);
    }
    if (!name) {
      throw new Error(ERROR_MESSAGES.EVENT_CATEGORY_NAME_REQUIRED);
    }
    this.id = id;
    this.name = name.trim();
  }

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  equals(other: EventCategory): boolean {
    return this.id === other.id;
  }
}
