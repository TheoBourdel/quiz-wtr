import sequelize from '../db/conn.js';
import { DataTypes, Model } from 'sequelize';
import Quiz from './quizModel.js';

const Question = sequelize.define('question', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    quiz_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Quiz,
            key: 'id'
        }
    }
}, {
    tableName: 'question',
    timestamps: false,
    subQuery: false
});

Question.belongsTo(Quiz, { foreignKey: 'quiz_id'});

// sequelize.sync({ alter: true});
export default Question;