// Brennan Wilkes

// Imports
import { Router } from "express";
import { getSpotifyResource } from "../controllers/getController";

import { search } from "../controllers/queryController";
import { getSpotifyRecommendations } from "../controllers/recommendationController";
import getSpotifyValidator from "../validators/getSpotifyValidator";
import {getTopArtistsController, getTopTracksController} from "../controllers/getTopTracksController";
import recommendationValidator from "../validators/recommendationValidator";
import getTopTracksValidator, { getTopArtistsValidator } from "../validators/getTopTracksValidator";
import searchValidator from "../validators/searchValidator";

const apiV1Router = Router();

apiV1Router.get("/", (_req, res) => res.send({
	healthy: true
}));

apiV1Router.get("/search", searchValidator, search);
apiV1Router.get("/spotify/topTracks", getTopTracksValidator, getTopTracksController);
apiV1Router.get("/spotify/topArtists", getTopArtistsValidator, getTopArtistsController);
apiV1Router.get("/spotify/:id", getSpotifyValidator, getSpotifyResource);
apiV1Router.get("/recommend", recommendationValidator, getSpotifyRecommendations);

export default apiV1Router;
