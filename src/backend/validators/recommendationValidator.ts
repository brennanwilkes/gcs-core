
import { query, oneOf } from "express-validator";
import validationErrorHandler from "../errorHandlers/validationErrorHandler";
import { limitValidator, spotifyIdRegex } from "./validatorUtil";

export default [
	limitValidator(10, 50),
	oneOf([
		[
			query("seed_tracks")
				.exists()
				.isArray({ min: 1, max: 5 })
				.withMessage("Playlist must have 1-5 seed songs (spotify IDS)"),
			query("seed_tracks.*")
				.exists()
				.trim()
				.matches(spotifyIdRegex)
				.withMessage("Internal song ID is not valid"),
		],
		query("seed_tracks")
			.exists()
			.trim()
			.matches(spotifyIdRegex)
			.withMessage("Internal song ID is not valid")
	]),
	query("acousticness").optional().isFloat({ min: 0.0, max: 1.0 }).toFloat(),
	query("danceability").optional().isFloat({ min: 0.0, max: 1.0 }).toFloat(),
	query("energy").optional().isFloat({ min: 0.0, max: 1.0 }).toFloat(),
	query("instrumentalness").optional().isFloat({ min: 0.0, max: 1.0 }).toFloat(),
	query("key").optional().isInt({ min: 0, max: 11 }).toInt(),
	query("loudness").optional().isFloat({ min: -100.0, max: 100.0 }).toFloat(),
	query("mode").optional().isBoolean().toBoolean(),
	query("tempo").optional().isInt({ min: 0, max: 200 }).toInt(),
	query("valence").optional().isFloat({ min: 0.0, max: 1.0 }).toFloat(),
	validationErrorHandler
];
