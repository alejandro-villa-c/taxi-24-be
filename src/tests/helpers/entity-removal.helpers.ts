import { Repository, ObjectLiteral } from 'typeorm';
import { TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';

export class EntityRemovalHelpers {
  constructor(private moduleFixture: TestingModule) {}

  public async removeEntity<T extends ObjectLiteral>(
    entity: EntityClassOrSchema,
    id: any,
  ): Promise<void> {
    if (!id) {
      throw new Error(
        `Entity ID is undefined in 'removeEntity' method of 'EntityRemovalHelpers'`,
      );
    }

    const repository = this.moduleFixture.get<Repository<T>>(
      getRepositoryToken(entity),
    );

    await repository.delete({
      id,
    });
  }
}
