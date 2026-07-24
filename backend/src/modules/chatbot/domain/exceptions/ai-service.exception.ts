export class AIServiceException extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = 'AIServiceException';
  }
}

export class AIQuotaExceededException extends AIServiceException {
  constructor() {
    super('AI service quota exceeded. Please try again later.');
    this.name = 'AIQuotaExceededException';
  }
}

export class AITimeoutException extends AIServiceException {
  constructor() {
    super('AI service request timed out.');
    this.name = 'AITimeoutException';
  }
}
