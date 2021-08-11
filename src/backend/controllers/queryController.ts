import { Request, Response } from "express";
import { print } from "../util/util";
import internalErrorHandler from "../errorHandlers/internalErrorHandler";
import searchSpotify, { getSpotify } from "../spotify/searchSpotify";
import { SongApiObj } from "../../types/song";
import resolveSpotifySongs from "../util/resolveSongs";

const getLabels: ((req: Request) => string[]) = (req: Request) => {
	if(req.query.matchWith === undefined){
		return [];
	}
	if(typeof req.query.matchWith === "string"){
		return req.query.matchWith.split(",");
	}
	if(Array.isArray(req.query.matchWith) && req.query.matchWith.length > 0 && (typeof req.query.matchWith[0] == "string")){
		return req.query.matchWith as string[];
	}
	return [];
}

export const search = (req: Request, res: Response): void => {
	if (req.query.query) {
		query(req, res);
	} else if (req.query.spotifyId) {
		loadResource(req, res);
	}
};

export const query = (req: Request, res: Response): void => {
	print(`Handling request for query search "${req.query.query}"`);

	searchSpotify(String(req.query.query)).then(spotifyResults => {
		return resolveSpotifySongs(spotifyResults.slice(0, 5), getLabels(req));
	}).then(songs => {
		res.send({
			//songs: songs.map(song => new SongApiObj(song, [new DownloadLink(req, song)]))
			songs: songs.map(song => new SongApiObj(song, []))
		});
	}).catch(internalErrorHandler(req, res));
};

export const loadResource = (req: Request, res: Response): void => {
	print(`Handling request for spotify resource "${req.query.spotifyId}"`);

	getSpotify(String(req.query.spotifyId)).then(spotifyResults => {
		return resolveSpotifySongs(spotifyResults, getLabels(req));
	}).then(songs => {
		res.send({
			//songs: songs.map(song => new SongApiObj(song, [new DownloadLink(req, song)]))
			songs: songs.map(song => new SongApiObj(song, []))
		});
	}).catch(internalErrorHandler(req, res));
};
