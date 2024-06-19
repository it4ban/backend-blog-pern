const { body } = require('express-validator');

const registerValidation = [
	body('email', 'Неверный формат почты').trim().isEmail(),
	body('fullName', 'Укажите имя').isLength({ min: 3 }),
	body('password', 'Длинна пароля не менее 6 символов').isLength({ min: 6 }),
	body('avatar', 'Неверно указана ссылка на картинку').isURL().optional(),
];

const loginValidation = [
	body('email', 'Неверный формат почты').isEmail(),
	body('password', 'Длинна пароля не менее 6 символов').isLength({ min: 6 }),
];

const postCreateValidation = [
	body('title', 'Введите заголовок статьи').isLength({ min: 3 }).isString(),
	body('text', 'Введите текст статьи').isLength({ min: 3 }).isString(),
	body('tags', 'Неверный формат тэгов').optional().isArray(),
	body('imageUrl', 'Неверная ссылка на изображение').optional().isString(),
];

module.exports = { registerValidation, loginValidation, postCreateValidation };
