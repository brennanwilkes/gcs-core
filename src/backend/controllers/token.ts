import { Request, Response } from "express";
//import { generateDashboardRedirect } from "../util/util";
import internalErrorHandler from "../errorHandlers/internalErrorHandler";
import connection from "../spotify/connection";
//import SpotifyApi from "spotify-web-api-node";
//import logger from "../logging/logger";
//import { getUserIdFromToken } from "../../auth/getUser";

// Handles an incoming redirect from spotify oauth
export default (req: Request, res:Response): void => {
	const code = req.query.code as string;
	const state = req.query.state as string;

	connection.then(spotifyApi => {
		spotifyApi.authorizationCodeGrant(code).then(data => {
			if(state && state.length > 0){
				if(state === "return"){
					res.json({
						spotify: {
							refresh: data.body.refresh_token,
							access: data.body.access_token
						}
					});
				}
				else if(state.match(/^recommend.*/)){
					res.redirect(`/api/v1/${state}${state.includes("?") ? "&" : "?"}authorization=Bearer ${data.body.access_token}`);
				}
				else if(state.match(/^top(Artists|Tracks).*/)){
					res.redirect(`/api/v1/spotify/${state}${state.includes("?") ? "&" : "?"}authorization=Bearer ${data.body.access_token}`);
				}
				else{
					internalErrorHandler(req, res)(`Invalid state: ${state}`);
				}
			}
			else{
				internalErrorHandler(req, res)(`Invalid state`);
			}

			//return spotifyApi.getMe();
		}).catch(internalErrorHandler(req, res));
	}).catch(internalErrorHandler(req, res));
};
