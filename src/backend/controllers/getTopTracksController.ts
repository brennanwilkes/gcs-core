import { Request, Response } from "express";
import { getLabels, getLimit, getOffset, print } from "../util/util";
import internalErrorHandler from "../errorHandlers/internalErrorHandler";
import { SongApiObj } from "../../types/song";
import resolveSpotifySongs from "../util/resolveSongs";
import { getTopArtists, getTopTracks, TopTracksOptions } from "../spotify/getTopTracks";

const topTracksDefaultLimit = 50;

const getToken = (req: Request): string => {
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

	return token;
}

const getOptions = (req: Request): TopTracksOptions => {
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

	return options;
}

export const getTopTracksController = (req: Request, res: Response): void => {

	const token = getToken(req);
	const options = getOptions(req);

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

export const getTopArtistsController = (req: Request, res: Response): void => {

	const token = getToken(req);
	const options = getOptions(req);

	getTopArtists(
		token,
		options
	).then(spotifyResults => {
		res.send({
			artists: spotifyResults.slice(0, getLimit(req, topTracksDefaultLimit))
		});
	}).catch(internalErrorHandler(req, res));
};
