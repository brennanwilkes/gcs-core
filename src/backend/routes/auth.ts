import { Router } from "express";
import redirectToSpotify from "../controllers/redirectToSpotify";
import token from "../controllers/token";

const authRouter = Router();
authRouter.get("/spotify", redirectToSpotify);
authRouter.get("/token", token);

export default authRouter;
