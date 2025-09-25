import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import { AppDataSource } from './data-source';
import routes from './routes';
import { setupSwagger } from './docs/swaggerConfig';


AppDataSource.initialize()
  .then(() => {
    const app = express();

    app.use(cors({
      origin: 'http://localhost:8100',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      credentials: true 
    }));


    app.use(express.json());

    setupSwagger(app);
    
    app.use(routes);

    return app.listen(process.env.PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${process.env.PORT}`);
      console.log(`📚 Documentação disponível em http://localhost:${process.env.PORT}/docs`);
    });
  })
  .catch((error) => console.log(error));
