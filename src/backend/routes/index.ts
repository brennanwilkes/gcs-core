// Brennan Wilkes

// Imports
import { Router } from "express";
import apiV1Router from "./v1";
import apiTracker from "../logging/apiTracker";

const mainRouter = Router();
mainRouter.use("/api", [apiTracker], apiV1Router);
mainRouter.use("/api/v1", [apiTracker], apiV1Router);

export default mainRouter;
