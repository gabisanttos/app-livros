// routes.ts
import { Router } from "express";
import { UserController } from "./app/controllers/UserController";  
import { LoginController } from "./app/controllers/LoginController";
import { authMiddleware } from "./app/middlewares/authMiddleware";
    

const routes = Router();

routes.post('/v1/api/login', new LoginController().login);


routes.post('/v1/api/users', new UserController().createUser);

routes.use(authMiddleware);

routes.get('/v1/api/profile', new UserController().getProfile);


export default routes;