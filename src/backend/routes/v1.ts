// Brennan Wilkes

// Imports
import { Router } from "express";

import { search } from "../controllers/song/queryController";
import searchValidator from "../validators/song/searchValidator";

const apiV1Router = Router();

apiV1Router.get("/", (_req, res) => res.send({
	healthy: true
}));

apiV1Router.get("/search", searchValidator, search);

export default apiV1Router;
