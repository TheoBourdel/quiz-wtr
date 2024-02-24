import express from 'express';
const route = express.Router();
import * as AnswerController from '../controller/answerController.js';

route.post('/answer', AnswerController.createAnswer);
route.delete('/answer/:id', AnswerController.deleteAnswer);
route.put('/answer/:id', AnswerController.updateAnswer);

export default route;
