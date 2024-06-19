const jwt = require('jsonwebtoken');

const checkToken = (req, res, next) => {
	try {
		const token = req.headers.authorization?.replace(/Bearer\s?/, '');

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
