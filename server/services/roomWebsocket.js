export default function (io) {

    return function (socket) {
        let timerInterval;
        let userAnswers = [];
        let userCurrentQuestionAnswers = {};

        socket.on('joinRoom', (room) => {
            socket.join(room.roomId);

            const roomClients = io.sockets.adapter.rooms.get(room.roomId);
            const numUsersInRoom = roomClients ? roomClients.size : 0;

            socket.to(room.roomId).emit('room_size', { quiz: room.quiz, numUsersInRoom, nombreDePersonne: room.roomSize });
        });

        socket.on('roomSize', (room) => {
            const roomClients = io.sockets.adapter.rooms.get(room.link);
            const numUsersInRoom = roomClients ? roomClients.size : 0;

            socket.emit('room_size', { numUsersInRoom, nombreDePersonne: room.nombreDePersonne, link: room.link });
        });

        socket.on('leave_room', (room) => {
            socket.leave(room);
            
            const roomClients = io.sockets.adapter.rooms.get(room);
            const numUsersInRoom = roomClients ? roomClients.size : 0;
            console.log('il y a ' + numUsersInRoom + ' utilisateurs dans la room ' + room);
            socket.to(room).emit('room_size', { room, numUsersInRoom });
        });

        socket.on('disconnect', () => {
            // for (const room of socket.rooms) {
            //     if (room !== socket.id) {
            //         socket.leave(room);
            //         // Optionnel: Envoyer une notification aux autres dans la room
            //         io.to(room).emit('user_left', socket.id);
            //     }
            // }
            // console.log(`Utilisateur ${socket.id} s'est déconnecté`);
        });

        socket.on('start_timer', (data) => {
            timerInterval = setInterval(() => {
                socket.to(data.link).emit('timerUpdate', data.time_left--);
                if(data.time_left === -1) {
                    clearInterval(timerInterval);
                }
            }, 1000);
        });

        socket.on('start_quiz', (room) => {
            const shuffledQuestions = room.Quiz.israndom ? shuffleQuestions(room.Quiz.questions) : room.Quiz.questions;
            socket.to(room.link).emit('quiz_started', { shuffledQuestions, quiz: room.Quiz });
        
            let currentQuestionIndex = 0;
        
            userCurrentQuestionAnswers = {};
            console.log('ca veut dire que il y a un reset')
        
            // Émettez la première question immédiatement avec son timer
            const emitQuestion = (question, index, timer) => {
                io.to(room.link).emit('question_selection', { question, correctAnswers: getCorrectAnswers(question) });
        
                let timeLeft = timer;
        
                const questionTimerInterval = setInterval(() => {
                    io.to(room.link).emit('question_timer', { questionTimeLeft: timeLeft, currentQuestionIndex: index });
                    if (timeLeft === 0) {
                        clearInterval(questionTimerInterval);
        
                        // Passez à la question suivante si elle existe
                        if (index < shuffledQuestions.length - 1) {
                            // À la fin de la question
        
                            io.to(room.link).emit('question_end', {
                                correctAnswers: question.Answers.filter(answer => answer.is_correct),
                                userAnswers: userCurrentQuestionAnswers,
                            });
        
                            setTimeout(() => {
                                // Passez à la question suivante si elle existe
                                if (index < shuffledQuestions.length - 1) {
                                    emitQuestion(shuffledQuestions[index + 1], index + 1, room.Quiz.timer);
                                } else {
                                    // Vous pouvez émettre un événement 'quiz_end' ou effectuer d'autres actions ici
                                }
                            }, 5000);
                        } else {
                            // Vous pouvez émettre un événement 'quiz_end' ou effectuer d'autres actions ici
                            io.to(room.link).emit('question_end', {
                                correctAnswers: question.Answers.filter(answer => answer.is_correct),
                                userAnswers: userCurrentQuestionAnswers,
                            });
                        }
                    } else {
                        timeLeft--;
                    }
                }, 1000);
            };
        
            // Commencez le processus avec la première question
            emitQuestion(shuffledQuestions[currentQuestionIndex], currentQuestionIndex, room.Quiz.timer);
        });
        
        // Lorsqu'une réponse est reçue du client
        socket.on('answer_selection', (data) => {
            const { userId, selectedAnswer } = data;
        
            // Assurez-vous que l'objet userCurrentQuestionAnswers a été initialisé pour cet utilisateur
            if (!userCurrentQuestionAnswers[userId]) {
                userCurrentQuestionAnswers[userId] = [];
            }
        
            // Ajoutez la réponse à l'objet
            userCurrentQuestionAnswers[userId].push(selectedAnswer);
            console.log('userCurrentQuestionAnswers', userCurrentQuestionAnswers);
        });
        
        
        
        function shuffleQuestions(questions) {
            for (let i = questions.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [questions[i], questions[j]] = [questions[j], questions[i]];
            }
            return [...questions];
        }

        const getCorrectAnswers = (question) => {
            return question.Answers.filter((answer) => answer.is_correct);
        };
    };
}
