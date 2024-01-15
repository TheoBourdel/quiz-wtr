import AnswerModel from "../model/answerModel.js";

export const createAnswer = async (req, res) => {
    try {
            
        const { name, question_id } = req.body;
    
        const answer = await AnswerModel.create({ name, question_id });
    
        return res.status(201).json(answer);
    } catch(error) {
        return res.status(500).json({ message: error.message });
    }
}