import { oneOf, query } from "express-validator";
import validationErrorHandler from "../errorHandlers/validationErrorHandler";
import { spotifyWebRegex, spotifyURIRegex, spotifyIdRegex } from "./validatorUtil";

const validMatchers = [
	"spotify",
	"youtube",
	"musicKit"
];

export default [
	query("query").exists().trim().isString(),
	query("matchWith").trim().escape().isString().custom((input: string) => new Promise((resolve, reject) => {
		const vals = input.split(",");
		vals.forEach(val => {
			if(!validMatchers.includes(val)){
				reject(new Error(`matchWith value "${val}" is not recognized`));
			}
		});
		resolve(input);
	})),

	validationErrorHandler
];
