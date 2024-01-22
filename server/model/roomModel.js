import sequelize from '../db/conn.js';
import { DataTypes, Model } from 'sequelize';
import Quiz from './quizModel.js'; // Assurez-vous d'importer le modèle Quiz


const Room = sequelize.define('room', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    link: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    isprivate: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    nombredepersonne: {
        type: DataTypes.INTEGER
    },
    quiz_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Quiz,
            key: 'id'
        }
    }
}, {
    tableName: 'room',
    timestamps: false,
    subQuery: false
});

Room.belongsTo(Quiz, { foreignKey: 'quiz_id' });

// Cette commande créera la table 'room' dans la base de données si elle n'existe pas
export default Room;
