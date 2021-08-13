import { Request, Response } from "express";
import { CONFIG, getLabels, getLimit, print } from "../util/util";
import internalErrorHandler from "../errorHandlers/internalErrorHandler";
import { getSpotify } from "../spotify/searchSpotify";
import { SongApiObj } from "../../types/song";
import resolveSpotifySongs from "../util/resolveSongs";

export const getSpotifyResource = (req: Request, res: Response): void => {
	print(`Handling request for spotify resource "${req.params.id}"`);

	getSpotify(String(req.params.id)).then(spotifyResults => {
		return resolveSpotifySongs(spotifyResults.slice(0, getLimit(req)), getLabels(req));
	}).then(songs => {
		res.send({
			songs: songs.map(song => new SongApiObj(song, []))
		});
	}).catch(internalErrorHandler(req, res));

};
