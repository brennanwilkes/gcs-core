import { Request, Response } from "express";
import { CONFIG, generateSpotifyRedirectURI } from "../util/util";
import internalErrorHandler from "../errorHandlers/internalErrorHandler";
import connection from "../spotify/connection";

// Redirect to spotify oauth
export default (req: Request, res: Response): void => {
	if (!CONFIG.spotifyClientId) {
		internalErrorHandler(req, res)("Spotify application ID not set");
	} else {
		connection.then(spotifyApi => {

			const state: string = ("state" in req.query && req.query.state && typeof req.query.state === "string") ? req.query.state : "return";

			spotifyApi.setRedirectURI(generateSpotifyRedirectURI(req));
			res.redirect(spotifyApi.createAuthorizeURL(CONFIG.spotifyOauth2Credentials.scope, state));
		}).catch(internalErrorHandler(req, res));
	}
};
