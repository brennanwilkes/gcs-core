// Brennan Wilkes

// Imports
import { Router } from "express";
import apiV1Router from "./v1";
import apiTracker from "../logging/apiTracker";
import responseTime from "response-time";

const mainRouter = Router();

mainRouter.use(responseTime());
mainRouter.use("/api", [apiTracker], apiV1Router);
mainRouter.use("/api/v1", [apiTracker], apiV1Router);

export default mainRouter;
