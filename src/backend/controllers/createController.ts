import { Request, Response } from "express";
import { getLabels, getLimit, print } from "../util/util";
import internalErrorHandler from "../errorHandlers/internalErrorHandler";
import { SongApiObj } from "../../types/song";
import resolveSpotifySongs from "../util/resolveSongs";
import getGeneratedPlaylist from "../spotify/getGeneratedPlaylist";
import { generateRefreshedCredential } from "../spotify/connection";

export const createPlaylist = (req: Request, res: Response): void => {

	let token: string | undefined;
	if(
		req.headers.authorization &&
		typeof req.headers.authorization === "string" &&
		req.headers.authorization.length > 0 &&
		req.headers.authorization.includes("Bearer ")
	){
		token = req.headers.authorization.split("Bearer ")[1];
	}

	const tracks: string[] = req.query.tracks as string[];
	const name: string = req.query.name as string;
	const description: (string | undefined) = req.query.description as (string | undefined);


	generateRefreshedCredential().then(async spotifyApi => {
		if (token) {
			spotifyApi.setAccessToken(token);
		}

		return spotifyApi.createPlaylist(
			name,
			{
				description: description ?? "",
				public: true
			}
		).then(data => {
			const id:string = data.body.id;

			// Add tracks to a playlist
			return spotifyApi.addTracksToPlaylist(
				id,
				tracks.map(id => `spotify:track:${id}`)
			).then(() => {
				res.send({
					playlist: id
				});
			});
		});
	}).catch(internalErrorHandler(req, res));

};
