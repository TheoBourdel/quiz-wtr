import express from 'express';
const route = express.Router();
import * as RoomController from '../controller/roomController.js';

route.post('/room', RoomController.createRoom)
route.get('/room/:id', RoomController.getRoomByQuizId)
route.get('/roomlink/:link', RoomController.getRoomByLink)
route.put('/room/:id', RoomController.changeRoomState)
route.get('/rooms', RoomController.getRooms)


export default route;
