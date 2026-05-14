import { Injectable, Scope } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { IUnitOfWork } from '../application/unit-of-work';

@Injectable({ scope: Scope.REQUEST })
export class TypeOrmUnitOfWork implements IUnitOfWork {
  private manager!: EntityManager;

  public constructor(private readonly dataSource: DataSource) {}

  public async execute<T>(work: () => Promise<T>): Promise<T> {
    return this.dataSource.transaction(async (manager) => {
      this.manager = manager;

      return work();
    });
  }

  public getManager(): EntityManager {
    return this.manager ?? this.dataSource.manager;
  }
}
