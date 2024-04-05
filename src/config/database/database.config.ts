import { config } from 'dotenv';
import { join } from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

config();
export class DatabaseConfig {
  public static postgresConnectionOptions: PostgresConnectionOptions = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  };

  public static dataSourceOptions: DataSourceOptions = {
    ...DatabaseConfig.postgresConnectionOptions,
    entities: [join(__dirname, '../../modules/**', '*.entity{.ts,.js}')],
    migrations: [join(__dirname, 'migrations', '*{.ts,.js}')],
    migrationsTableName: 'migrations',
    migrationsRun: false,
    synchronize: false,
  };

  public static dataSource = new DataSource(DatabaseConfig.dataSourceOptions);
}

export const dataSource = DatabaseConfig.dataSource;
