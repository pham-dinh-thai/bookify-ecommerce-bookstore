import { Module } from '@nestjs/common';
import { EVENT_DISPATCHER } from '../../domain/event-dispatcher.interface';
import { EventDispatcher } from '../../infrastructure/event-dispatcher';

@Module({
  providers: [
    {
      provide: EVENT_DISPATCHER,
      useClass: EventDispatcher,
    },
  ],
  exports: [EVENT_DISPATCHER],
})
export class EventDispatcherModule {}
