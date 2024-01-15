import Quiz from './quizModel.js';
import Question from './questionModel.js';

Quiz.hasMany(Question, { as: 'question', foreignKey: 'quiz_id' });
Question.belongsTo(Quiz, { foreignKey: 'quiz_id'});

export default { Quiz, Question };