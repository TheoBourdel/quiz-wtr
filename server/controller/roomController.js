import RoomModel from '../model/roomModel.js';

export const createRoom = async (req, res) => {
    try {

        const { nombreDePersonne, isPrivate, link, password, quiz_id, status } = req.body;
        const room = await RoomModel.create({ nombreDePersonne, isPrivate, link, password, quiz_id, status });

        return res.status(201).json(room);

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const getRoomByQuizId = async (req, res) => {
    try {
        const quizId = req.params.id;
        const room = await RoomModel.findOne({ where: { quiz_id: quizId } });

        if (!room) {
            return res.status(404).json({ message: "Room not found for the provided quiz ID." });
        }

        return res.status(200).json(room);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}