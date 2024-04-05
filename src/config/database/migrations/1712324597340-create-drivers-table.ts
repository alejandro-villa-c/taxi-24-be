import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDriversTable1712324597340 implements MigrationInterface {
  name = 'CreateDriversTable1712324597340';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "drivers" ("id" SERIAL NOT NULL, "givenName" character varying NOT NULL, "familyName" character varying NOT NULL, "latitude" numeric(10,7) NOT NULL, "longitude" numeric(10,7) NOT NULL, CONSTRAINT "PK_92ab3fb69e566d3eb0cae896047" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "drivers"`);
  }
}
