import { Request, Response } from 'express';
const prisma = require('../client');

import { IUserInfoRequest } from '../middlewares/checkToken.interface';

class PostController {
	async create(req: IUserInfoRequest, res: Response) {
		try {
			const post = await prisma.post.create({
				data: {
					title: req.body.title,
					text: req.body.text,
					imageUrl: req.body.imageUrl,
					tags: req.body.tags,
					userId: req.userId,
				},
			});

			return res.status(201).json(post);
		} catch (err) {
			console.log(err);
			res.status(500).json({
				message: 'Не удалось создать статью',
			});
		}
	}
	async update(req: IUserInfoRequest, res: Response) {}
}

module.exports = new PostController();
