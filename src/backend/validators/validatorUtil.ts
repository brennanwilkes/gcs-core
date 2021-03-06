import { query, ValidationChain } from "express-validator";
import axios from "axios";
import { CONFIG } from "../util/util";


export const verifyUrlExistance = async (url: string): Promise<boolean> => {
	return new Promise((resolve) => {
		axios.get(url).then(res => {
			resolve(res.status === 200);
		}).catch(() => resolve(false));
	});
};

// Some awesome ID regex checks. Hopefully they don't change *crosses fingers*
export const mongoIdRegex = /^[a-fA-F0-9]{24}$/;
export const spotifyIdRegex = /^[0-9A-Za-z]{22}$/;
export const spotifyWebRegex = /^https?:\/\/open.spotify.com\/[a-zA-Z]+\/([0-9A-Za-z]{22})\?si=.*$/;
export const spotifyURIRegex = /^spotify:[a-zA-Z]+:([0-9A-Za-z]{22})$/;

export const mongoIdValidator = (variable: ValidationChain): ValidationChain => variable.exists()
	.trim()
	.matches(mongoIdRegex)
	.withMessage("Internal ID is not valid");

export const spotifyIdValidator = (variable: ValidationChain): ValidationChain => variable.exists()
	.trim()
	.matches(spotifyIdRegex)
	.withMessage("Spotify ID is not valid");

export const limitValidator = (
	limit0?: number,
	maximum0?: number
): ValidationChain => {

	const limit: number = limit0 ? limit0 : CONFIG.defaultApiLimit;
	const maximum: number = maximum0 ? maximum0 : CONFIG.maximumApiLimit;

	return query("limit").optional()
		.default(limit)
		.trim()
		.escape()
		.isNumeric()
		.isInt({
			min: 1,
			max: maximum
		})
		.toInt();
}

export const paginateValidator = query("page").optional()
	.default(1)
	.trim()
	.escape()
	.isNumeric()
	.toInt();

export const offsetValidator = query("offset").optional()
	.default(0)
	.trim()
	.escape()
	.isNumeric()
	.toInt();


const validMatchers = [
	"spotify",
	"youtube",
	"musicKit"
];

export const matchWithValidator = query("matchWith")
	.optional()
	.default("spotify")
	.trim()
	.escape()
	.isString()
	.custom((input: string) => new Promise((resolve, reject) => {
		const vals = input.split(",");
		vals.forEach(val => {
			if(!validMatchers.includes(val)){
				reject(new Error(`matchWith value "${val}" is not recognized`));
			}
		});
		resolve(input);
	}));
