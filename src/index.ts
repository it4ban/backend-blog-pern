const express = require('express');
const cors = require('cors');
require('dotenv').config();

const UserController = require('./controllers/User.controller.ts');
const PostController = require('./controllers/Post.controller.ts');

const { registerValidation, loginValidation, postCreateValidation } = require('./validation.ts');
const checkValidation = require('./middlewares/checkValidation.ts');
const checkToken = require('./middlewares/checkToken.ts');

const app = express();
const prisma = require('./client');

app.use(cors());
app.use(express.json());

app.post('/auth/login', checkValidation(loginValidation), UserController.login);
app.post('/auth/register', checkValidation(registerValidation), UserController.register);
app.post('/auth/me', checkToken, UserController.getMe);

app.get('/posts', PostController.getAll);
app.get('/posts/tags', PostController.getLastTags);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkToken, checkValidation(postCreateValidation), PostController.create);
app.patch('/posts/:id', checkToken, checkValidation(postCreateValidation), PostController.update);
app.delete('/posts/:id', checkToken, PostController.delete);

app.listen(4444, () => console.log('Server is running on port 4444'));
