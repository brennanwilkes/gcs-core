import { Request } from "express";
import levenshtein from "fast-levenshtein";

// Store all backend config vars here
import "dotenv/config";

import analyticsConfig from "../../config/analytics";
import emailConfig from "../../config/email";
import googleConfig from "../../config/google";
import spotifyConfig from "../../config/spotify";
import miscConfig from "../../config/miscellaneous";
import musicKitConfig from "../../config/musicKit";

export const CONFIG = {
	...miscConfig,
	googleOauth2Credentials: googleConfig.oauth2,
	...googleConfig.credentials,
	spotifyOauth2Credentials: spotifyConfig.oauth2,
	...spotifyConfig.credentials,
	...emailConfig,
	...analyticsConfig,
	...musicKitConfig
};

/**
	Prints to stdout if verbose config mode is set
	@param {string[]} content Content strings to print
	@memberof backend
*/
export const print = function (...content: string[]): void {
	if (CONFIG.verbose) console.log(...content);
};

export const getPage = (req: Request):number => (req.query.page as number | undefined) ?? 1;
export const getOffset = (req: Request):number => (req.query.offset as number | undefined) ?? 0;
export const getLimit = (req: Request, defaultLimit: number = CONFIG.defaultApiLimit):number => (req.query.limit as number | undefined) ?? defaultLimit;

export const generateDashboardRedirect = (req: Request): string => `${req.protocol}://${req.get("host")}/dashboard`;

export const titleSanitizer = (str: string) => {
	return str.toLowerCase().replace(/[Vv][Ee][Vv][Oo]| - topic|[^a-zA-Z .0-9-()]|video ?|lyric ?|with ?|feat.?u?r?e?s?i?n?g? ?|official ?|audio ?|performance ?|\([^)]+\)/g, "");
};
export const thresholdDistance = (
	str1: string,
	str2: string,
	threshold = 1,
	sanitizer: ((str: string) => string) = titleSanitizer
) => {
	return levenshtein.get(sanitizer(str1), sanitizer(str2)) <= ((str1.length + str2.length) / 2 / threshold);
};

export const xOrMore = (vals: boolean[], x = 1) => vals.reduce((a, v) => a + (v ? 1 : 0), 0) >= x;

export const getLabels: ((req: Request) => string[]) = (req: Request) => {
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

// Utility method to generate the spotify redirect URI. Maybe should be configurable
export const generateSpotifyRedirectURI = (req: Request): string => `${req.protocol}://${req.get("host")}/auth/token`;
