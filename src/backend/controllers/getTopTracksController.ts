import { Request, Response } from "express";
import { getLabels, getLimit, getOffset, print } from "../util/util";
import internalErrorHandler from "../errorHandlers/internalErrorHandler";
import { SongApiObj } from "../../types/song";
import resolveSpotifySongs from "../util/resolveSongs";
import { getTopTracks, TopTracksOptions } from "../spotify/getTopTracks";

const topTracksDefaultLimit = 50;

export const getTopTracksController = (req: Request, res: Response): void => {

	let token: string | undefined;
	if(
		req.headers.authorization &&
		typeof req.headers.authorization === "string" &&
		req.headers.authorization.length > 0 &&
		req.headers.authorization.includes("Bearer ")
	){
		token = req.headers.authorization.split("Bearer ")[1];
	}
	else{
		token = "";
	}

	const options: TopTracksOptions = {};

	options.limit = getLimit(req, topTracksDefaultLimit);
	options.offset = getOffset(req);

	options.time_range = "long_term";
	if(req.query.time_range === "medium_term"){
		options.time_range = "medium_term";
	}
	else if(req.query.time_range === "short_term"){
		options.time_range = "short_term";
	}

	console.dir(options);

	getTopTracks(
		token,
		options
	).then(spotifyResults => {
		return resolveSpotifySongs(spotifyResults.slice(0, getLimit(req, topTracksDefaultLimit)), getLabels(req));
	}).then(songs => {
		res.send({
			songs: songs.map(song => new SongApiObj(song, []))
		});
	}).catch(internalErrorHandler(req, res));
};
