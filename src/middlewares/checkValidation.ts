import { Request, Response, NextFunction } from 'express';
import { ValidationChain } from 'express-validator';

const checkValidation = (templValidate: Array<ValidationChain>) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		const errors = [];

		for (const validation of templValidate) {
			const result = await validation.run(req);
			if (!result.isEmpty()) {
				errors.push(result.array());
			}
		}

		if (errors.length !== 0) {
			return res.status(400).json({ errors: errors });
		}

		next();
	};
};

module.exports = checkValidation;
