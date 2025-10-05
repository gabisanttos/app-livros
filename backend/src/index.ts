import 'dotenv/config';
import 'express-async-errors';
import express from 'express';
import routes from './server/routes';
import cors from 'cors';
import { AppDataSource } from './server/database/data-source';
import { setupSwagger } from './server/docs/swaggerConfig';

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
    
    app.use(routes);

    return app.listen(process.env.PORT, () => {
      console.log(`🚀 Servidor rodando em http://localhost:${process.env.PORT}`);
      console.log(`📚 Documentação disponível em http://localhost:${process.env.PORT}/docs`);
    });
  })
  .catch((error) => console.log(error));
