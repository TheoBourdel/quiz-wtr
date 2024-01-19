import AnswerModel from "../model/answerModel.js";

export const createAnswer = async (req, res) => {
    try {
            
        const { name, question_id } = req.body;
        const is_correct = req.body.isCorrect;

        const answers = await AnswerModel.findAll({ where: { question_id: question_id } });
        if (answers.length >= 4) {
            return res.status(400).json({ message: "question already has 4 answers"})
        }
    
        const answer = await AnswerModel.create({ name, question_id, is_correct });
    
        return res.status(201).json(answer);
    } catch(error) {
        return res.status(500).json({ message: error.message });
    }
}

export const deleteAnswer = async (req, res) => {
    try {
        const { id } = req.params;

        const answer = await AnswerModel.findByPk(id);

        await answer.destroy();

        return res.status(204).json({ message: "Answer deleted successfully"});
    } catch(error) {
        return res.status(500).json({ message: error.message });
    }
}

export const updateAnswer = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, question_id } = req.body;
        const is_correct = req.body.isCorrect;

        const answer = await AnswerModel.findByPk(id);

        answer.name = name;
        answer.question_id = question_id;
        answer.is_correct = is_correct;

        await answer.save();

        return res.status(200).json(answer);
    } catch(error) {
        return res.status(500).json({ message: error.message });
    }
}