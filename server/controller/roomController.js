import RoomModel from '../model/roomModel.js';
import QuizModel from '../model/quizModel.js';
import QuestionModel from '../model/questionModel.js';
import AnswerModel from '../model/answerModel.js';

export const createRoom = async (req, res) => {
    try {

        const { nombreDePersonne, link, password, quiz_id, status } = req.body;
        const isprivate = req.body.isPrivate;
        const nombredepersonne = req.body.nombreDePersonne;
        const room = await RoomModel.create({ nombredepersonne, isprivate, link, password, quiz_id, status });

        return res.status(201).json(room);

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const getRoomByQuizId = async (req, res) => {
    try {
        const quizId = req.params.id;
        const room = await RoomModel.findOne({ 
            where: { quiz_id: quizId },
            include: QuizModel
        });

        if (!room) {
            return res.status(404).json({ message: "Room not found for the provided quiz ID." });
        }

        return res.status(200).json(room);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const getRoomByLink = async (req, res) => {
    try {
        const link = req.params.link;
        const room = await RoomModel.findOne({ 
            where: { link: link },
            include: [{
                model: QuizModel,
                include: [{
                    model: QuestionModel,
                    include: [{
                        model: AnswerModel,
                    }],
                }],
            }]
        });

        if (!room) {
            return res.status(404).json({ message: "Room not found for the provided Link." });
        }

        return res.status(200).json(room);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const changeRoomState = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const room = await RoomModel.findByPk(id);
        room.status = status;
        await room.save();
        return res.status(200).json(room);
    } catch(error) {
        return res.status(500).json({ message: error.message });
    }
}

export const getRooms = async (req, res) => {
    try {
        const rooms = await RoomModel.findAll({
            include: [{
                model: QuizModel,
            }]
        });
        return res.status(200).json(rooms);
    } catch(error) {
        return res.status(500).json({ message: error.message });
    }
}