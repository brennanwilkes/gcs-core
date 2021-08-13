import { SpotifyResult } from "../../types/spotifyResult";
import { Request } from "express";

/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import SpotifyApi from "spotify-web-api-node";
/* eslint-enable no-unused-vars */
/* eslint-enable @typescript-eslint/no-unused-vars */

import getRecommendations, { RecommendationOptions } from "./getRecommendations";
import { getLimit } from "../util/util";

export default (req: Request): Promise<SpotifyResult[]> => {
	const options: RecommendationOptions = {};
	if (req.body.acousticness !== undefined) {
		options.target_acousticness = req.body.acousticness;
	}
	if (req.body.danceability !== undefined) {
		options.target_danceability = req.body.danceability;
	}
	if (req.body.energy !== undefined) {
		options.target_energy = req.body.energy;
	}
	if (req.body.instrumentalness !== undefined) {
		options.target_instrumentalness = req.body.instrumentalness;
	}
	if (req.body.key !== undefined) {
		options.target_key = req.body.key;
	}
	if (req.body.loudness !== undefined) {
		options.target_loudness = req.body.loudness;
	}
	if (req.body.mode !== undefined) {
		options.target_mode = req.body.mode ? 1 : 0;
	}
	if (req.body.tempo !== undefined) {
		options.target_tempo = req.body.tempo;
	}
	if (req.body.valence !== undefined) {
		options.target_valence = req.body.valence;
	}
	options.limit = getLimit(req);

	options.seed_tracks = req.body.seed_tracks;
	return getRecommendations(options);
};
