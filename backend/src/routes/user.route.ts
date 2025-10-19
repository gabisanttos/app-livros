import { Router } from "express";
import { UserController } from "../controllers/user.controller";  
import { authMiddleware } from "../middlewares/isAuthenticated";

const userRoutes = Router();

userRoutes.use(authMiddleware);

userRoutes.get('/profile', new UserController().getProfile);

export default userRoutes;