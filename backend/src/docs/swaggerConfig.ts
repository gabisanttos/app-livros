import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import { Express } from 'express';


export const setupSwagger = (app: Express) => {
  const swaggerFile = path.join(process.cwd(), 'src', 'docs', 'swagger.json'); // <- caminho robusto
  const swaggerData = JSON.parse(fs.readFileSync(swaggerFile, 'utf8'));

  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerData));
};
