import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { Button, Modal, Label, TextInput } from 'flowbite-react';
import Question from './Question';

export default function QuizEdition() {
    const [openModal, setOpenModal] = useState(false);
    const [quiz, setQuiz] = useState(false);
    const [name, setName] = useState('');
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(null);

    useEffect(() => {
        getQuiz();
        getQuestions();
    }, [])

    function onCloseModal() {
        setOpenModal(false);
        setName('');
        setCurrentQuestion(null);
    }

    const { id } = useParams();

    function getQuiz() {
        axios.get(`http://localhost:8000/quiz/${id}`).then(res => {
            setQuiz(res.data);
        }).catch(err => {
            console.log(err);
        })
    }

    function createQuestion() {
        axios.post(`http://localhost:8000/question`, {
            name,
            quiz_id: id
        }).then(res => {
            setQuestions([...questions, res.data]);
            onCloseModal();
        }).catch(err => {
            console.log(err);
        })
    }

    function getQuestions() {
        axios.get(`http://localhost:8000/quiz/${id}/questions`).then(res => {
            setQuestions(res.data);
        }).catch(err => {
            console.log(err);
        })
    }

    function deleteQuestion(id) {
        axios.delete(`http://localhost:8000/question/${id}`).then(res => {
            setQuestions(questions.filter(question => question.id !== id));
        }).catch(err => {
            console.log(err);
        })
    }

    function openUpdateModal(question) {
        setCurrentQuestion(question);
        setOpenModal(true);
        setName(question.name);
    }

    function updateQuestion(id) {
        axios.put(`http://localhost:8000/question/${id}`, {
            name
        }).then(res => {
            setQuestions(questions.map(question => {
                if(question.id === id) {
                    return res.data;
                }
                return question;
            }));
            onCloseModal();
        }).catch(err => {
            console.log(err);
        })
    }

    return (
        <div>
            <Modal show={openModal} size="md" onClose={onCloseModal} dismissible>
                <Modal.Body>
                    <div className="space-y-6">
                        <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                            {
                                currentQuestion ? "Modifier une question" : "Créer une question"
                            }
                        </h3>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="name" value="Question" />
                            </div>
                            <TextInput
                                id="name"
                                placeholder="Question"
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                                required
                            />
                        </div>
                        <div className="w-full">
                            {
                                currentQuestion ? 
                                <Button className='w-full' onClick={() => updateQuestion(currentQuestion.id)}>Modifier</Button>
                                :
                                <Button className='w-full' onClick={createQuestion}>Créer</Button>
                            }
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
            <h2 className="text-4xl underline text-center font-bold tracking-tight text-gray-900 dark:text-white">
                {quiz.name}
            </h2>
            <Button onClick={() => setOpenModal(true)} className='mt-2'>Créer une question</Button>
            <div className="flex flex-col gap-4 mt-6 flex-wrap">
            {questions.map(question => (
                <Question key={question.id} question={question} deleteQuestion={() => deleteQuestion(question.id)} updateQuestion={() => openUpdateModal(question)} quizId={id} />
                ))}
            </div>
        </div>
    )
}
