import { oneOf, param } from "express-validator";
import validationErrorHandler from "../errorHandlers/validationErrorHandler";
import { limitValidator, matchWithValidator, offsetValidator, spotifyIdRegex, spotifyURIRegex, spotifyWebRegex } from "./validatorUtil";

export default [
	oneOf([
		param("id")
			.exists()
			.trim()
			.isString()
			.matches(spotifyIdRegex),
		param("id")
			.exists()
			.trim()
			.isString()
			.matches(spotifyWebRegex)
			.customSanitizer(complex => complex.replace(spotifyWebRegex, (_str: string, id: string): string => id)),
		param("id")
			.exists()
			.trim()
			.isString()
			.matches(spotifyURIRegex)
			.customSanitizer(complex => complex.replace(spotifyURIRegex, (_str: string, id: string): string => id))
	]),
	matchWithValidator,
	limitValidator(15),
	offsetValidator,
	validationErrorHandler
];
