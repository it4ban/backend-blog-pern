const jwt = require('jsonwebtoken');
import { Response, NextFunction } from 'express';

import { IUserInfoRequest } from './checkToken.interface';

const checkToken = (req: IUserInfoRequest, res: Response, next: NextFunction) => {
	try {
		const token = req.headers.authorization;

		const decoded = jwt.verify(token, 'secret321');
		req.userId = decoded.id;
		next();
	} catch (err) {
		return res.status(403).json({
			message: 'Нет доступа',
		});
	}
};

module.exports = checkToken;
