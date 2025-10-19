import 'dotenv/config';
import 'express-async-errors';
import express from 'express';
import authRoutes from './routes/auth.route';
import userRoutes from './routes/user.route';
import cors from 'cors';
import { AppDataSource } from './database/data-source';
import { setupSwagger } from './config/swagger.config';

AppDataSource.initialize()
  .then(() => {
    const app = express();

    app.use(cors({
      origin: 'http://localhost:8100',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      credentials: true 
    }));

    app.use(express.json());

    setupSwagger(app);

    app.use("/v1/api", authRoutes);
    app.use("/v1/api", userRoutes);

    return app.listen(process.env.PORT, () => {
      console.log(`🚀 Servidor rodando em http://localhost:${process.env.PORT}`);
    });
  })
  .catch((error) => console.log(error));
