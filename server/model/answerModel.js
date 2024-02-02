// answerModel.js
import sequelize from '../db/conn.js';
import { DataTypes, Model } from 'sequelize';
// import Question from './questionModel.js';

class Answer extends Model {}

Answer.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    question_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        // references: {
        //     model: Question,
        //     key: 'id',
        // },
    },
    is_correct: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false, // Set to true for the correct answer
    },
},
{
    sequelize,
    tableName: 'answer',
    timestamps: false,
    subQuery: false,
});

// Answer.belongsTo(Question, { foreignKey: 'question_id', onDelete: 'CASCADE' });

export default Answer;
