import { Request, Response } from "express";
import { getLabels, getLimit, print } from "../util/util";
import internalErrorHandler from "../errorHandlers/internalErrorHandler";
import { SongApiObj } from "../../types/song";
import resolveSpotifySongs from "../util/resolveSongs";
import getGeneratedPlaylist from "../spotify/getGeneratedPlaylist";

export const getSpotifyRecommendations = (req: Request, res: Response): void => {
	getGeneratedPlaylist(req).then(spotifyResults => {
		return resolveSpotifySongs(spotifyResults.slice(0, getLimit(req)), getLabels(req));
	}).then(songs => {
		res.send({
			songs: songs.map(song => new SongApiObj(song, []))
		});
	}).catch(internalErrorHandler(req, res));

};
