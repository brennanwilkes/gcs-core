import { header } from "express-validator";
import { Request, Response, NextFunction } from "express";

export default [
	(req: Request, _res: Response, next: NextFunction): void => {
		if (!req.header("authorization") && req.query.authorization && typeof req.query.authorization === "string" && req.query.authorization.length > 0) {
			req.headers.authorization = req.query.authorization;
		}
		next();
	},
	header("authorization").exists().isString().trim().escape().matches(/^Bearer ..*/)
];
