import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePassengersAndTripsTables1712408254102
  implements MigrationInterface
{
  name = 'CreatePassengersAndTripsTables1712408254102';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "passengers" ("id" SERIAL NOT NULL, "givenName" character varying NOT NULL, "familyName" character varying NOT NULL, CONSTRAINT "PK_9863c72acd866e4529f65c6c98c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "trips" ("id" SERIAL NOT NULL, "startDate" TIMESTAMP NOT NULL DEFAULT now(), "endDate" TIMESTAMP NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "startLatitude" numeric(10,7) NOT NULL, "startLongitude" numeric(10,7) NOT NULL, "endLatitude" numeric(10,7) NOT NULL, "endLongitude" numeric(10,7) NOT NULL, "price" numeric(10,2) NOT NULL, "priceCurrency" character varying NOT NULL, "driverId" integer, "passengerId" integer, CONSTRAINT "PK_f71c231dee9c05a9522f9e840f5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "trips" ADD CONSTRAINT "FK_fc5a8911f85074a660a4304baa1" FOREIGN KEY ("driverId") REFERENCES "drivers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "trips" ADD CONSTRAINT "FK_a4d572e126f5475433560c9a370" FOREIGN KEY ("passengerId") REFERENCES "passengers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "trips" DROP CONSTRAINT "FK_a4d572e126f5475433560c9a370"`,
    );
    await queryRunner.query(
      `ALTER TABLE "trips" DROP CONSTRAINT "FK_fc5a8911f85074a660a4304baa1"`,
    );
    await queryRunner.query(`DROP TABLE "trips"`);
    await queryRunner.query(`DROP TABLE "passengers"`);
  }
}
