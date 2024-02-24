import React, { useState, useEffect } from 'react'
import { Button, Label, Modal, TextInput, ToggleSwitch } from 'flowbite-react';
import QuizCard from './QuizCard';
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';

export default function Admin() {
    const [openModal, setOpenModal] = useState(false);
    const [quizs, setQuizs] = useState([]);
    const [name, setName] = useState('');
    const [isRandom, setIsRandom] = useState(false);
    const [timePerQuestion, setTimePerQuestion] = useState(null);
    const [currentQuiz, setCurrentQuiz] = useState(null);
    const { user } = useAuth();

    const navigate = useNavigate();

    useEffect(() => {
        getQuizs();
    }, [])

    function onCloseModal() {
        setOpenModal(false);
        setName('');
        setCurrentQuiz(null);
    }

    function getQuizs() {
        axios.get('http://localhost:8000/quizs').then(res => {
            setQuizs(res.data);
        }).catch(err => {
            console.log(err);
        })
    }

    function createQuiz() {
        onCloseModal();
        axios.post('http://localhost:8000/quiz', {
            name,
            isRandom,
            timePerQuestion
        }).then(res => {
            setQuizs([...quizs, res.data]);
            console.log(res);
        }).catch(err => {
            console.log(err);
        })
    }

    function openUpdateModal(quiz) {
        setCurrentQuiz(quiz);
        setOpenModal(true);
        setName(quiz.name);
        setIsRandom(quiz.israndom);
        setTimePerQuestion(quiz.timer);
    }

    function deleteQuiz(id) {
        axios.delete(`http://localhost:8000/quiz/${id}`).then(res => {
            setQuizs(quizs.filter(quiz => quiz.id !== id));
        }).catch(err => {
            console.log(err);
        })
    }

    function navigateToQuiz(id) {
        navigate(`admin/quiz/${id}`);
    }

    function updateQuiz(id) {
        axios.put(`http://localhost:8000/quiz/${id}`, {
            name,
            isRandom,
            timePerQuestion
        }).then(res => {
            setQuizs(quizs.map(quiz => {
                if(quiz.id === id) {
                    return res.data;
                }
                return quiz;
            }));
            onCloseModal();        
        }).catch(err => {
            console.log(err);
        })
    }

    return (
        <div>
            <Button onClick={() => setOpenModal(true)}>Créer un Quiz</Button>
            <Modal show={openModal} size="md" onClose={onCloseModal} dismissible>
                <Modal.Body>
                    <div className="space-y-6">
                        <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                            {
                                currentQuiz ? "Modifier un quiz" : "Créer un quiz"
                            }
                        </h3>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="name" value="Nom du quiz" />
                            </div>
                            <TextInput
                                id="name"
                                placeholder="Nom du quiz"
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="timePerQuestion" value="Temps par question" />
                            </div>
                            <TextInput
                                id="timePerQuestion"
                                placeholder="Temps par question"
                                value={timePerQuestion}
                                onChange={(event) => setTimePerQuestion(event.target.value)}
                                required
                            />
                        </div>
                        <ToggleSwitch checked={isRandom} label={isRandom ? "Question aléatoire" : "Question dans l'ordre"} onChange={setIsRandom} />
                        <div className="w-full">
                            {
                                currentQuiz ? 
                                <Button className='w-full' onClick={() => updateQuiz(currentQuiz.id)}>Modifier</Button>
                                :
                                <Button className='w-full' onClick={createQuiz}>Créer</Button>
                            }
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
            <div className='flex flex-row gap-4 mt-6 flex-wrap'>
                {
                    quizs.map(quiz => {
                        return (
                            <QuizCard key={quiz.id} name={quiz.name} isAdmin={true} deleteQuiz={() => deleteQuiz(quiz.id)} updateQuiz={() => openUpdateModal(quiz)} quizId={quiz.id} />
                        )
                    })
                }
            </div>
        </div>
    )
}
