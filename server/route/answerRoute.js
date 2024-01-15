import express from 'express';
const route = express.Router();
import * as AnswerController from '../controller/answerController.js';

route.post('/answer', AnswerController.createAnswer);

export default route;
