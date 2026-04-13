export class StaticIdGenerator {
  private counter = 0;

  generate(): string {
    this.counter++;
    return this.counter.toString();
  }
}
