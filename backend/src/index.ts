import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import { AppDataSource } from './data-source';
import routes from './routes';

AppDataSource.initialize()
    .then(() => {
        const app = express();

        app.use(cors());

        app.use(express.json());

        app.use(routes);

        return app.listen(process.env.PORT, () => {
            console.log(`🚀 Servidor rodando na porta ${process.env.PORT}`);
        });
    })
    .catch((error) => console.log(error));