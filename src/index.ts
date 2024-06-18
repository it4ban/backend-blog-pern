const express = require('express');
const cors = require('cors');
require('dotenv').config();

const UserController = require('./controllers/UserController.ts');

const { registerValidation, loginValidation } = require('./validation/validation.ts');
const checkValidation = require('./validation/checkValidation.ts');
const checkToken = require('./utils/checkToken.ts');

const app = express();
const prisma = require('./client');

app.use(cors());
app.use(express.json());

app.post('/auth/login', checkValidation(loginValidation), UserController.login);

app.post('/auth/register', checkValidation(registerValidation), UserController.register);

app.post('/auth/me', checkToken, UserController.getMe);

app.listen(4444, () => console.log('Server is running on port 4444'));
