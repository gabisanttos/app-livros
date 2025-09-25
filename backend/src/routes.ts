// routes.ts
import { Router } from "express";
import { UserController } from "./app/controllers/UserController";  
import { LoginController } from "./app/controllers/AuthController";
import { authMiddleware } from "./app/middlewares/authMiddleware";
    

const routes = Router();

routes.post('/v1/api/register', new LoginController().register);

routes.post('/v1/api/login', new LoginController().login);


routes.use(authMiddleware);

routes.get('/v1/api/profile', new UserController().getProfile);


export default routes;