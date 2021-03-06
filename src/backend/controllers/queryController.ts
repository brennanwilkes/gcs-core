import { Request, Response } from "express";
import { CONFIG, getLabels, getLimit, getOffset, print } from "../util/util";
import internalErrorHandler from "../errorHandlers/internalErrorHandler";
import searchSpotify from "../spotify/searchSpotify";
import { SongApiObj } from "../../types/song";
import resolveSpotifySongs from "../util/resolveSongs";

export const search = (req: Request, res: Response): void => {
	print(`Handling request for query search "${req.query.query}"`);

	searchSpotify(String(req.query.query), getLimit(req), getOffset(req)).then(spotifyResults => {
		return resolveSpotifySongs(spotifyResults.slice(0, getLimit(req)), getLabels(req));
	}).then(songs => {
		res.send({
			//songs: songs.map(song => new SongApiObj(song, [new DownloadLink(req, song)]))
			songs: songs.map(song => new SongApiObj(song, []))
		});
	}).catch(internalErrorHandler(req, res));
};
