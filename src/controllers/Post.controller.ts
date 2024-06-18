import { Request, Response } from 'express';
const prisma = require('../client');

import { IUserInfoRequest } from '../middlewares/checkToken.interface';

class PostController {
	async getAll(req: Request, res: Response) {
		try {
			const posts = await prisma.post.findMany({
				include: {
					user: {
						select: {
							fullName: true,
							avatar: true,
						},
					},
				},
			});

			return res.status(200).json(posts);
		} catch (err) {
			console.log(err);
			res.status(500).json({
				message: 'Не удалось получить статьи',
			});
		}
	}

	async getOne(req: IUserInfoRequest, res: Response) {
		try {
			const post = await prisma.post.update({
				where: {
					id: req.params.id,
				},
				data: {
					viewCount: {
						increment: 1,
					},
				},
			});

			return res.status(200).json(post);
		} catch (err) {
			console.log(err);
			res.status(500).json({
				message: 'Не удалось получить статью',
			});
		}
	}

	async getLastTags(req: IUserInfoRequest, res: Response) {
		try {
			const post = await prisma.post.findMany({
				take: 5,
			});

			const tags = post
				.map((item: any) => item.tags)
				.flat()
				.slice(0, 5);

			return res.status(200).json(tags);
		} catch (err) {
			console.log(err);
			res.status(500).json({
				message: 'Не удалось получить теги',
			});
		}
	}

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

	async update(req: IUserInfoRequest, res: Response) {
		try {
			const postId = req.params.id;

			await prisma.post.update({
				where: {
					id: postId,
				},
				data: {
					title: req.body.title,
					text: req.body.text,
					imageUrl: req.body.imageUrl,
					tags: req.body.tags,
					userId: req.userId,
				},
			});

			return res.status(201).json({
				success: true,
			});
		} catch (err) {
			console.log(err);
			res.status(500).json({
				message: 'Не удалось обновить статью',
			});
		}
	}

	async delete(req: IUserInfoRequest, res: Response) {
		try {
			const postId = req.params.id;

			await prisma.post.delete({
				where: {
					id: postId,
				},
			});

			return res.status(201).json({
				success: true,
			});
		} catch (err) {
			console.log(err.code);
			res.status(500).json({
				message: 'Не удалось удалить статью',
			});
		}
	}
}

module.exports = new PostController();
