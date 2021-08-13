import { query } from "express-validator";
import validationErrorHandler from "../errorHandlers/validationErrorHandler";
import { limitValidator, paginateValidator } from "./validatorUtil";

const validMatchers = [
	"spotify",
	"youtube",
	"musicKit"
];

export default [
	query("query").exists().trim().isString(),
	query("matchWith").optional().default("spotify").trim().escape().isString().custom((input: string) => new Promise((resolve, reject) => {
		const vals = input.split(",");
		vals.forEach(val => {
			if(!validMatchers.includes(val)){
				reject(new Error(`matchWith value "${val}" is not recognized`));
			}
		});
		resolve(input);
	})),
	limitValidator(),
	paginateValidator,
	validationErrorHandler
];
