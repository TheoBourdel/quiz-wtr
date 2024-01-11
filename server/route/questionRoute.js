import express from 'express';
const route = express.Router();
import * as QuestionController from '../controller/questionController.js';

route.post('/question', QuestionController.createQuestion);

export default route;
