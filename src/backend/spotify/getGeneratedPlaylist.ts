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
	if (req.query.acousticness !== undefined && (typeof req.query.acousticness === "number")) {
		options.target_acousticness = req.query.acousticness;
	}
	if (req.query.danceability !== undefined && (typeof req.query.danceability === "number")) {
		options.target_danceability = req.query.danceability;
	}
	if (req.query.energy !== undefined && (typeof req.query.energy === "number")) {
		options.target_energy = req.query.energy;
	}
	if (req.query.instrumentalness !== undefined && (typeof req.query.instrumentalness === "number")) {
		options.target_instrumentalness = req.query.instrumentalness;
	}
	if (req.query.key !== undefined && (typeof req.query.key === "number")) {
		options.target_key = req.query.key;
	}
	if (req.query.loudness !== undefined && (typeof req.query.loudness === "number")) {
		options.target_loudness = req.query.loudness;
	}
	if (req.query.mode !== undefined && (typeof req.query.mode === "boolean")) {
		options.target_mode = req.query.mode ? 1 : 0;
	}
	if (req.query.tempo !== undefined && (typeof req.query.tempo === "number")) {
		options.target_tempo = req.query.tempo;
	}
	if (req.query.valence !== undefined && (typeof req.query.valence === "number")) {
		options.target_valence = req.query.valence;
	}
	options.limit = getLimit(req);

	options.seed_tracks = req.query.seed_tracks as string[];

	let token: string | undefined;
	if(
		req.headers.authorization &&
		typeof req.headers.authorization === "string" &&
		req.headers.authorization.length > 0 &&
		req.headers.authorization.includes("Bearer ")
	){
		token = req.headers.authorization.split("Bearer ")[1];
	}

	return getRecommendations(options, token);
};
