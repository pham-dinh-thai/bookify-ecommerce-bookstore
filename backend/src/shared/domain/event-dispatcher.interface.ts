import { DomainEvent } from './domain-event';
import { IEventHandler } from './event-handler.interface';

export interface IEventDispatcher {
  register(eventName: string, handler: IEventHandler<any>): void;
  dispatch(events: DomainEvent[]): Promise<void>;
}
export const EVENT_DISPATCHER = 'IEventDispatcher';
