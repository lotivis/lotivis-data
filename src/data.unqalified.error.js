export class DataUnqualifiedError extends Error {
  constructor(message) {
    super(message);
    this.name = "DataUnqualifiedError";
  }
}
