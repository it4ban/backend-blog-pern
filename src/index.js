const express = require('express');
const cors = require('cors');
const fs = require('fs');
const multer = require('multer');
require('dotenv').config();

const UserController = require('./controllers/User.controller');
const PostController = require('./controllers/Post.controller');

const { registerValidation, loginValidation, postCreateValidation } = require('./validation');
const checkValidation = require('./middlewares/checkValidation');
const checkToken = require('./middlewares/checkToken');

const app = express();

app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
	destination: (_, __, cb) => {
		if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');
		cb(null, 'uploads');
	},
	filename: (_, file, cb) => {
		cb(null, file.originalname);
	},
});

const uploads = multer({ storage });

app.post('/auth/login', checkValidation(loginValidation), UserController.login);
app.post('/auth/register', checkValidation(registerValidation), UserController.register);
app.post('/auth/me', checkToken, UserController.getMe);

app.post('/upload', checkToken, uploads.single('image'), (req, res) => {
	res.json({
		url: `/uploads/${req.file.originalname}`,
	});
});

app.get('/posts', PostController.getAll);
app.get('/posts/tags', PostController.getLastTags);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkToken, checkValidation(postCreateValidation), PostController.create);
app.patch('/posts/:id', checkToken, checkValidation(postCreateValidation), PostController.update);
app.delete('/posts/:id', checkToken, PostController.delete);

app.listen(4444, () => console.log('Server is running on port 4444'));
