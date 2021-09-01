import { oneOf, query } from "express-validator";
import { authorizationErrorRedirect } from "../errorHandlers/authorizationErrorHandler";
import validationErrorHandler from "../errorHandlers/validationErrorHandler";
import tokenValidator from "./tokenValidator";
import { limitValidator, matchWithValidator, offsetValidator } from "./validatorUtil";

export default [
	query("time_range").optional().default("long_term").trim().escape().matches(/^(long_term|medium_term|short_term)$/),
	matchWithValidator,
	limitValidator(50),
	offsetValidator,
	validationErrorHandler,
	...tokenValidator,
	authorizationErrorRedirect(`/auth/spotify?state=top`, true)
];
