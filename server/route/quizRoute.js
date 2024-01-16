import express from 'express';
const route = express.Router();
import * as QuizController from '../controller/quizController.js';

route.get('/quizs', QuizController.getQuizs);
route.get('/quiz/:id', QuizController.getQuiz);
route.post('/quiz', QuizController.createQuiz);
route.delete('/quiz/:id', QuizController.deleteQuiz);
route.get('/quiz/:id/questions', QuizController.getQuizQuestions);
route.put('/quiz/:id', QuizController.updateQuiz);

export default route;
