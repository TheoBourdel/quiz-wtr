import QuestionModel from '../model/questionModel.js';
import AnswerModel from '../model/answerModel.js';

export const createQuestion = async (req, res) => {
    try {

        const { name, quiz_id } = req.body;

        const question = await QuestionModel.create({ name, quiz_id });

        return res.status(201).json(question);

    } catch(error) {
        return res.status(500).json({ message: error.message });
    }
}

export const deleteQuestion = async (req, res) => {
    try {

        const { id } = req.params;

        const question = await QuestionModel.destroy({ where: { id } });

        return res.status(200).json(question);

    } catch(error) {
        return res.status(500).json({ message: error.message });
    }
}

export const getQuestion = async (req, res) => {
    try {

        const { id } = req.params;

        const question = await QuestionModel.findByPk(id);

        return res.status(200).json(question);

    } catch(error) {
        return res.status(500).json({ message: error.message });
    }
}

export const updateQuestion = async (req, res) => {
    try {

        const { id } = req.params;
        const { name } = req.body;

        const question = await QuestionModel.findByPk(id);
        console.log(question);
        question.name = name;

        await question.save();

        return res.status(200).json(question);

    } catch(error) {
        return res.status(500).json({ message: error.message });
    }
}

export const getAnswers = async (req, res) => {
    try {

        const { id } = req.params;

        const answers = await AnswerModel.findAll({ where: { question_id: id } });

        return res.status(200).json(answers);

    } catch(error) {
        return res.status(500).json({ message: error.message });
    }
}