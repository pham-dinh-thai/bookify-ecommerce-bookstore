import { IEventDispatcher } from '../domain/event-dispatcher.interface';
import { DomainEvent } from '../domain/domain-event';
import { IEventHandler } from '../domain/event-handler.interface';

export class EventDispatcher implements IEventDispatcher {
  private handlers: Map<string, IEventHandler<any>[]> = new Map();

  register(eventName: string, handler: IEventHandler<any>): void {
    const existing = this.handlers.get(eventName) ?? [];
    this.handlers.set(eventName, [...existing, handler]);
  }

  async dispatch(events: DomainEvent[]): Promise<void> {
    for (const event of events) {
      const handlers = this.handlers.get(event.constructor.name) ?? [];
      for (const handler of handlers) {
        await handler.handle(event);
      }
    }
  }
}
