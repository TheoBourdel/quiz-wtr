'use client';

import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Label, Modal, TextInput, Tooltip, Progress } from 'flowbite-react';
import axios, { all } from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../hooks/useSocket';
import Timer from './Timer';
import GameAnswer from './GameAnswer';

export default function Quiz() {
    const { link } = useParams();
    const [room, setRoom] = useState(null);
    const [isPrivate, setIsPrivate] = useState();
    const [password, setPassword] = useState();
    const [openModal, setOpenModal] = useState(false);
    const {user} = useAuth();
    const [users, setUsers] = useState(0);
    const socket = useSocket();
    const memoizedSocket = useMemo(() => socket, [socket]);
    const [quizStarted, setQuizStarted] = useState(false);
    const [timeLeft, setTimeLeft] = useState(null);

    const [questions, setQuestions] = useState([]);
    const [questionTimer, setQuestionTimer] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [answerSelections, setAnswerSelections] = useState({});
    const [correctAnswers, setCorrectAnswers] = useState([]);
    const [userAnswers, setUserAnswers] = useState([]);
    const [openResultModal, setOpenResultModal] = useState(false);
    const [resultMessage, setResultMessage] = useState('');
    const [resultColor, setResultColor] = useState('');
    const [endGame, setEndGame] = useState(false);
    const [openModalEndGame, setOpenModalEndGamel] = useState(false);
    const [winner, setWinner] = useState(false);
    const [allPlayersScore, setAllPlayersScore] = useState([]);

    const getRoomData = async () => {
        await axios.get(`http://localhost:8000/roomlink/${link}`)
            .then(res => {
                setRoom(res.data);
                setIsPrivate(res.data.isPrivate);
                setOpenModal(res.data.isPrivate);
                memoizedSocket.emit('roomSize', {link: link, nombreDePersonne: res.data.nombredepersonne});
            })
            .catch(err => {
                console.log(err);
            });
    };

    function startTimer() {
        memoizedSocket.emit('start_timer', ({time_left: 4, link: link}));
        setTimeLeft(4);
    }

    function startQuiz(room) {
        setTimeLeft(null);
        setQuizStarted(true);
        memoizedSocket.emit('start_quiz', room);
    }

    const userAnswersRef = useRef(userAnswers);

    useEffect(() => {
        userAnswersRef.current = userAnswers;
    }, [userAnswers]);

    useEffect(() => {
        const maxScore = Math.max(...allPlayersScore.map(s => s.newScore));
        const winners = allPlayersScore.filter(s => s.newScore === maxScore);
        const isUserWinner = winners.some(winner => winner.playerId === user.id);
        setWinner(isUserWinner)
    }, [allPlayersScore])

    // Affiche les réponses des questions à l'utilisateur
    useEffect(() => {
       memoizedSocket.on('score_update', (results) => {
            setAllPlayersScore((prev) => {
                const newResults = Array.isArray(results) ? results : [results];
                return [...prev, ...newResults];
            });
        });

        memoizedSocket.on('quiz_end', (winner) => {
            setEndGame(true)
            setOpenModalEndGamel(true)
        });

        memoizedSocket.on('question_end', (data) => {
            setOpenResultModal(true);
            if(endGame) {
                setTimeout(() => {
                    setOpenResultModal(false);
                },2000)
            }
            setCorrectAnswers(data.correctAnswers);

            const userAnswered = userAnswersRef.current.length > 0;
            const allUserAnswersCorrect = userAnswersRef.current.every((userAnswer) => 
                userAnswer.is_correct
            );
        
            setResultMessage(userAnswered ? (allUserAnswersCorrect ? 'Bravo!' : 'Dommage!') : 'Dommage!');
            setResultColor(userAnswered ? (allUserAnswersCorrect ? 'text-green-500' : 'text-red-500') : 'text-red-500');
        });

        return () => {
            memoizedSocket.off('question_end');
        };
    }, [memoizedSocket, endGame]);

    // lorsque l'utilisateur sélectionne une réponse
    const handleAnswerSelection = (selectedAnswer) => {
        socket.emit('submit_answer', ({ playerId: user.id, isCorrect: selectedAnswer.is_correct }));
        setUserAnswers(
            [ 
                ...userAnswers,
                selectedAnswer
            ]
        );
    };

    // Réponses des utilisateurs en temps réel (PAS ENCORE UTILISE)
    useEffect(() => {
        memoizedSocket.on('answer_selection_update', (data) => {
            setAnswerSelections((prevAnswerSelections) => {
                const newAnswerSelections = [...prevAnswerSelections];
        
                newAnswerSelections.push(...data.selectedAnswer);
        
                return newAnswerSelections;
            });
        });
        
    
        return () => {
            memoizedSocket.off('answer_selection_update');
        };
    }, [memoizedSocket]);
    
    // Lorsque que la question change
    useEffect(() => {
        memoizedSocket.on('question_selection', (data) => {
            setOpenResultModal(false);
            setUserAnswers([]);
            const { question, correctAnswers } = data;
            setCurrentQuestion(question);
            setCorrectAnswers(correctAnswers);
        });
    
        memoizedSocket.on('question_timer', (data) => {
            setQuestionTimer(data.questionTimeLeft);
        });
    
        return () => {
            memoizedSocket.off('question_selection');
            memoizedSocket.off('question_timer');
        };
    }, [memoizedSocket]);
    
    // Timer du début du quiz
    useEffect(() => {
        const handleTimerUpdate = (updatedTimer) => {
            setTimeLeft(updatedTimer);
            if (updatedTimer === 0) {
                setTimeLeft(null);
                startQuiz(room);
            }
        };
    
        memoizedSocket.on('timerUpdate', handleTimerUpdate);
    
        return () => {
            memoizedSocket.off('timerUpdate', handleTimerUpdate);
        };
    }, [room, memoizedSocket]);

    // Quand l'utilisateur quitte la page
    useEffect(() => () => {
        memoizedSocket.emit('leave_room', link);
        memoizedSocket.off('timerUpdate');
    }, []);

    // Quand l'utilisateur rejoint la page
    useEffect(() => {
        memoizedSocket.on('room_size', (data) => {
            setUsers(data.numUsersInRoom);
            if (data.numUsersInRoom === data.nombreDePersonne) {
                startTimer();
            }
        });

        return () => {
            memoizedSocket.off('room_size');
            memoizedSocket.off('timerUpdate');
        }
        
    }, [memoizedSocket]);

    // Quand l'utilisateur rejoint la page
    useEffect(() => {
        getRoomData();
    }, [link]);

    function checkPassword () {
        if(password && room ) {
            if(password === room.password) {
                setOpenModal(false);
            } else {
                toast.error("mot de passe incorrect", {
                    position: toast.POSITION.TOP_RIGHT 
                });
            }
        }
    }

    return (
        <div className='w-full relative'>
            {timeLeft !== null && (
                <Timer time={timeLeft} />
            )}
            <ToastContainer />
            <Modal show={openResultModal} size="md">
                <Modal.Body>
                    <div className="space-y-6">
                    <div className={`text-lg font-semibold ${resultColor}`}>
                    {resultMessage}
                    </div>

                    {
                        currentQuestion && (
                            currentQuestion.Answers.map((answer, index) => {
                                // Vérifiez si la réponse actuelle est correcte
                                const isCorrect = answer.is_correct;

                                // Vérifiez si la réponse actuelle a été sélectionnée par l'utilisateur
                                const isSelected = userAnswers.some(selectedAnswer => selectedAnswer.id === answer.id);

                                // Appliquez la classe en fonction de la condition
                                const className = `p-4 rounded-lg text-lg ${isCorrect ? 'bg-green-500' : (isSelected ? 'bg-red-500' : '')}`;

                                return (
                                    <div key={index} className={className + ' border border-solid'}>
                                        {answer.name}
                                    </div>
                                );
                            })
                        )
                    }
                    </div>
                </Modal.Body>
            </Modal>

            {
                isPrivate && 
                (<Modal show={openModal} size="md" dismissible>
                    <Modal.Body>
                        <div className="space-y-6">
                            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                                Inserer le mot de passe
                            </h3>
                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="name" value="Password" />
                                </div>
                                <TextInput
                                    id="name"
                                    placeholder="Password"
                                    onChange={(event) => setPassword(event.target.value)}
                                    required
                                />
                            </div>
                            <div className="w-full">
                                <Button  className='w-full' onClick={checkPassword} >Valider</Button>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal> )
            }

            {
                endGame && 
                (<Modal show={openModalEndGame} size="md" dismissible>
                    <Modal.Body>
                        <div className="space-y-6">
                            {
                                winner ? (
                                    <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                                        Bravo vous avez gagnez !!!
                                     </h3>
                                ) : (
                                    <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                                        Dommage ! Vous avez perdu..
                                    </h3>
                                )
                            }
                            {/* <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                                Egalité !
                            </h3> */}
                        </div>
                    </Modal.Body>
                </Modal> )
            }
            <div className='flex flex-row justify-between'>
                <div>
                    <h1 className='text-2xl font-semibold dark:text-white'>
                        {room && room.Quiz.name}
                    </h1>
                    {
                        room && (
                            <p className='dark:text-white'>Joueurs : {users} / {room.nombredepersonne}</p>
                        )
                    }
                </div>
                <div>
                <div className=''>
                    <Tooltip content="lien copié !" trigger="click">
                        <Button size="xs" color='gray' onClick={() => {navigator.clipboard.writeText(link)}}>{link}</Button>
                    </Tooltip>
                </div>
                </div>
            </div>
            <div className='flex flex-col space-y-4 mt-4'>
                {
                    quizStarted && (
                        <div>
                            <h1 className='text-2xl font-semibold dark:text-white text-center'>
                                {currentQuestion && (currentQuestion.name)}
                            </h1>
                            <div className="p-4">
                                {
                                    questionTimer && (
                                        <>
                                            {/* <p className='dark:text-white'>Temps restant : {questionTimer}</p> */}
                                            <Progress progress={questionTimer * 10} size="lg" labelProgress={true} progressLabelPosition="inside" />
                                        </>
                                    )
                                }
                            </div>
                            <div className='grid grid-cols-2 gap-10 justify-center px-10 md:px-32'>
                                {
                                    currentQuestion && (
                                        currentQuestion.Answers.map((answer, index) => (
                                            <GameAnswer key={index} answer={answer} onAnswerSelected={handleAnswerSelection} />
                                        ))
                                    )
                                }
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    );
}