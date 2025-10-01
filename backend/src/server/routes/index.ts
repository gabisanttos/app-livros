// routes.ts
import { Router } from "express";
import { UserController } from "../controllers/UserController";  
import { AuthController } from "../controllers/AuthController";
import { authMiddleware } from "../shared/middlewares/authMiddleware";
    

const routes = Router();

routes.post('/v1/api/register', new AuthController().register);
routes.post('/v1/api/login', new AuthController().login);
routes.post('/v1/api/forgot-password', new AuthController().requestPasswordReset);
routes.post('/v1/api/reset-password', new AuthController().resetPassword);


routes.use(authMiddleware);

routes.get('/v1/api/profile', new UserController().getProfile);


export default routes;