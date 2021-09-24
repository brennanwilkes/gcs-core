
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
				.isArray({ min: 1, max: 5 })
				.withMessage("Playlist must have 1-5 seed songs (spotify IDS)"),
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
	validationErrorHandler,
	...tokenValidator,
	authorizationErrorRedirect(`/auth/spotify?state=recommend`, true)
];
