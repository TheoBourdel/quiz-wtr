import QuestionModel from '../model/questionModel.js';

export const createQuestion = async (req, res) => {
    try {

        const { name, quiz_id } = req.body;

        const question = await QuestionModel.create({ name, quiz_id });

        return res.status(201).json(question);

    } catch(error) {
        return res.status(500).json({ message: error.message });
    }
}