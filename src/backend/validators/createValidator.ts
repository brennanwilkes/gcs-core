
import { query, oneOf } from "express-validator";
import validationErrorHandler from "../errorHandlers/validationErrorHandler";
import tokenValidator from "./tokenValidator";
import { spotifyIdRegex } from "./validatorUtil";
import { authorizationErrorRedirect } from "../errorHandlers/authorizationErrorHandler";

export default [
	oneOf([
		[
			query("tracks")
				.exists()
				.isArray({ min: 1 })
				.withMessage("Playlist must atleast 1 song (spotify IDS)"),
			query("tracks.*")
				.exists()
				.trim()
				.matches(spotifyIdRegex)
				.withMessage("Internal song ID is not valid"),
		],
		query("tracks")
			.exists()
			.trim()
			.matches(spotifyIdRegex)
			.withMessage("Internal song ID is not valid")
	]),
	query("name").exists().isString().trim().escape().exists().isString(),
	query("description").optional().isString().trim().escape(),
	...tokenValidator,
	validationErrorHandler,
];
