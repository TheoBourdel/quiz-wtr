import express from 'express';
const route = express.Router();
import * as RoomController from '../controller/roomController.js';

route.post('/room', RoomController.createRoom)
route.get('/room/:id', RoomController.getRoomByQuizId)



export default route;
