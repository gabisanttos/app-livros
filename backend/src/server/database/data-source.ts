import 'dotenv/config'
import 'reflect-metadata'
import { DataSource } from 'typeorm'

const dbUrl = process.env.DATABASE_URL || '';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: dbUrl,
  entities: [`${__dirname}/**/app/models/*.{ts,js}`],
  migrations: [`${__dirname}/**/migrations/*.{ts,js}`],
  ssl: {
    rejectUnauthorized: false
  },
  synchronize: false,
  logging: true
})