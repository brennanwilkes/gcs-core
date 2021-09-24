import { SpotifyResult, SpotifyResultFromApi } from "../../types/spotifyResult";
import { generateRefreshedCredential } from "./connection";
import { getSpotifyTrack } from "./searchSpotify";

/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import SpotifyApi from "spotify-web-api-node";
/* eslint-enable no-unused-vars */
/* eslint-enable @typescript-eslint/no-unused-vars */

export interface TopTracksOptions{
	time_range?: 'long_term' | 'medium_term' | 'short_term' | undefined;
	offset?: number | undefined;
	limit?: number | undefined;
}

export const getTopTracks = async (userAccessToken: string, options: TopTracksOptions): Promise<SpotifyResult[]> => {
	return new Promise<SpotifyResult[]>((resolve, reject) => {
		generateRefreshedCredential().then(async spotifyApi => {
			spotifyApi.setAccessToken(userAccessToken);
			return spotifyApi.getMyTopTracks(options);
		}).then(recommendationData => {
			return Promise.all(recommendationData.body.items.map(s => Promise.resolve(new SpotifyResultFromApi(s))));
			//return Promise.all(recommendationData.body.items.map(s => getSpotifyTrack(s.id)));
		}).then(resolve).catch(e => {
			console.dir(e);
			reject(e);
		});
	});
};

export interface Artist{
	name: string;
	ids: {
		spotify: string
	};
}

export const getTopArtists = async (userAccessToken: string, options: TopTracksOptions): Promise<Artist[]> => {
	return new Promise<Artist[]>((resolve, reject) => {
		generateRefreshedCredential().then(async spotifyApi => {
			spotifyApi.setAccessToken(userAccessToken);
			return spotifyApi.getMyTopArtists(options);
		}).then(recommendationData => {
			return Promise.all(recommendationData.body.items.map(a => {
				return {
					name: a.name,
					ids: {
						spotify: a.id
					}
				}
			}));
		}).then(resolve).catch(reject);
	});
};
