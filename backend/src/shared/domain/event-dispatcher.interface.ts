import { DomainEvent } from './domain-event';

export interface IEventDispatcher {
  dispatch(events: DomainEvent[]): Promise<void>;
}
export const EVENT_DISPATCHER = 'IEventDispatcher';
