import express from 'express';
const route = express.Router();
import * as RoomController from '../controller/roomController.js';
// const RefreshTokenController = require('../controller/refreshToken');

route.post('/room', RoomController.createRoom)



export default route;
