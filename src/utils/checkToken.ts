import { Request, Response, NextFunction } from 'express';

const checkToken = (req: Request, res: Response, next: NextFunction) => {
	const token = req.headers.authorization;
	console.log(token);
	next();
};

module.exports = checkToken;
