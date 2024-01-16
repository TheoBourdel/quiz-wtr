import QuizModel from '../model/quizModel.js';
import QuestionModel from '../model/questionModel.js';

export const createQuiz = async (req, res) => {
    try {

        const { name } = req.body;

        const quiz = await QuizModel.create({ name });

        return res.status(201).json(quiz);

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const updateQuiz = async (req, res) => {
    try {

        const { id } = req.params;
        const { name } = req.body;

        const quiz = await QuizModel.findByPk(id);

        quiz.name = name;

        await quiz.save();

        return res.status(200).json(quiz);

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const getQuizs = async (req, res) => {
    try {

        const quizs = await QuizModel.findAll();

        return res.status(200).json(quizs);

    } catch(error) {
        return res.status(500).json({ message: error.message })
    }
}

export const deleteQuiz = async (req, res) => {
    try {

        const { id } = req.params;

        const quiz = await QuizModel.destroy({ where: { id } });

        return res.status(200).json(quiz);

    } catch(error) {
        return res.status(500).json({ message: error.message })
    }
}

export const getQuiz = async (req, res) => {
    try {

        const { id } = req.params;

        const quiz = await QuizModel.findByPk(id);

        return res.status(200).json(quiz);

    } catch(error) {
        return res.status(500).json({ message: error.message })
    }
}

export const getQuizQuestions = async (req, res) => {
    try {

        const { id } = req.params;

        const questions = await QuestionModel.findAll({ where: { quiz_id: id } });

        return res.status(200).json(questions);

    } catch(error) {
        return res.status(500).json({ message: error.message })
    }
}