// routes.ts
import { Router } from "express";
import { UserController } from "./controllers/UserController";  

const routes = Router();

routes.post('/api/users', new UserController().createUser);

export default routes;