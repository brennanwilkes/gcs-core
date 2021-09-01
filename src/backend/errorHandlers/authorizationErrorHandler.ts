import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { AuthorizationError } from "../../types/error";
import { print } from "../util/util";

export default (req: Request, res: Response, next: NextFunction): Response | undefined => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const err = new AuthorizationError(errors, req);
		print(JSON.stringify(err, null, 4));
		return res.status(401).json(err);
	}
	next();
};

export const authorizationErrorRedirect = (url0: string, applyQuery: boolean = false) => {
	return (req: Request, res: Response, next: NextFunction): void => {
		let url = url0;

		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			if(applyQuery){
				const queryIndex = req.originalUrl.indexOf("?");
				const queryString = (queryIndex >= 0) ? req.originalUrl.slice(queryIndex) : "";
				url = `${url}${encodeURIComponent(queryString)}`;
				url = url.replace(/state=(.*)/, (_match: string, $1: string) => `state=${encodeURI($1)}`);
			}
			res.redirect(url);
		}
		else{
			next();
		}
	}
}
