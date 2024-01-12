import express from 'express';
const route = express.Router();
import * as UserController from '../controller/user.js';
// const RefreshTokenController = require('../controller/refreshToken');

route.post('/login', UserController.login)
route.post('/register', UserController.register)
// route.get('/token', RefreshTokenController.refreshToken)
route.delete('/logout', UserController.logout)
// route.get('/profile', UserController.verifyJwt ,UserController.profile)


export default route;
