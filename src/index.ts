const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');
require('dotenv').config();

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const { registerValidation, loginValidation } = require('./validation/validation.ts');
const checkValidation = require('./validation/checkValidation.ts');
const checkToken = require('./utils/checkToken.ts');

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
	res.send('Hello World');
});

app.post('/auth/login', checkValidation(loginValidation), async (req: Request, res: Response) => {
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
});

app.post('/auth/register', checkValidation(registerValidation), async (req: Request, res: Response) => {
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
});

app.post('/auth/me', checkToken, async (req: Request, res: Response) => {
	return res.status(200).json({
		success: true,
	});
});

app.listen(4444, () => console.log('Server is running on port 4444'));
