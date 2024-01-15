import sequelize from '../db/conn.js';
import {DataTypes, Model} from 'sequelize';

class Quiz extends Model {}

Quiz.init({
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
}, {
    sequelize,
    tableName: 'quiz',
    timestamps: false,
    subQuery: false
});

// This will create the 'quiz' table in the database if it doesn't exist
sequelize.sync({ alter: true });

export default Quiz;