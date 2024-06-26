const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../utils/client');

class UserController {
	async register(req, res) {
		try {
			const password = req.body.password;
			const salt = await bcrypt.genSalt(10);
			const hash = await bcrypt.hash(password, salt);

			const user = await prisma.user.create({
				data: {
					email: req.body.email,
					fullName: req.body.fullName,
					avatar: req.body.avatar,
					passwordHash: hash,
				},
			});

			const token = jwt.sign(
				{
					id: user.id,
				},
				'secret321',
				{
					expiresIn: '30d',
				},
			);

			const { passwordHash, ...userData } = user;

			return res.status(201).json({
				...userData,
				token,
				created: true,
			});
		} catch (err) {
			console.error(err);
			res.status(500).json({
				message: 'Не удалось создать пользователя',
			});
		}
	}

	async login(req, res) {
		try {
			const user = await prisma.user.findUnique({
				where: {
					email: req.body.email,
				},
			});

			if (!user) {
				return res.status(404).json({
					message: 'Пользователь не найден',
				});
			}

			const validationPass = await bcrypt.compare(req.body.password, user.passwordHash);

			if (!validationPass) {
				return res.status(401).json({
					message: 'Неверный логин или пароль',
				});
			}

			const token = jwt.sign(
				{
					id: user.id,
				},
				'secret321',
				{
					expiresIn: '30d',
				},
			);

			const { passwordHash, ...userData } = user;

			return res.status(200).json({
				...userData,
				token,
			});
		} catch (err) {
			res.status(500).json({
				message: 'Не удалось авторизоваться',
			});
		}
	}

	async getMe(req, res) {
		try {
			const user = await prisma.user.findUnique({
				where: {
					id: req.userId,
				},
			});

			if (!user) {
				return res.status(404).json({
					message: 'Пользователь не найден',
				});
			}

			res.json(user);
		} catch (err) {
			console.log(err);
			res.status(500).json({
				message: 'Нет доступа',
			});
		}
	}
}

module.exports = new UserController();
