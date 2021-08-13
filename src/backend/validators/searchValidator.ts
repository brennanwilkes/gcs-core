import { query } from "express-validator";
import validationErrorHandler from "../errorHandlers/validationErrorHandler";
import { limitValidator, matchWithValidator, offsetValidator } from "./validatorUtil";



export default [
	query("query").exists().trim().isString(),
	matchWithValidator,
	limitValidator(),
	offsetValidator,
	validationErrorHandler
];
