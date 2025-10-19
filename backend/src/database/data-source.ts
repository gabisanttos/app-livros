import 'dotenv/config'
import path from 'path';
import 'reflect-metadata'
import { DataSource } from 'typeorm'

const dbUrl = process.env.DATABASE_URL || '';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: dbUrl,
  entities: [path.join(__dirname, 'models', '*.{js,ts}')],
  migrations: [path.join(__dirname, 'migrations', '*.{js,ts}')],
  ssl: {
    rejectUnauthorized: false
  },
  synchronize: false,
  logging: true
})