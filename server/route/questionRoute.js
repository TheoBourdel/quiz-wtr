import express from 'express';
const route = express.Router();
import * as QuestionController from '../controller/questionController.js';

route.post('/question', QuestionController.createQuestion);
route.get('/question/:id', QuestionController.getQuestion);
route.delete('/question/:id', QuestionController.deleteQuestion);
route.get('/question/:id/answers', QuestionController.getAnswers);

export default route;
