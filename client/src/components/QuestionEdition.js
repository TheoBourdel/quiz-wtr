import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Button, Modal, TextInput, Label, ToggleSwitch, Tooltip } from 'flowbite-react';
import AnswerCard from './AnswerCard';
import axios from 'axios';

export default function QuestionEdition() {
    const { question_id } = useParams();
    const [question, setQuestion] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [name, setName] = useState('');
    const [answers, setAnswers] = useState([]);
    const [isCorrect, setIsCorrect] = useState(false);
    const [currentAnswer, setCurrentAnswer] = useState(null);

    useEffect(() => {
        getAnswers();
        getQuestion();
    },[question_id])

    function onCloseModal() {
        setOpenModal(false);
        setCurrentAnswer(null);
        setName('');
    }

    function getQuestion() {
        axios.get(`http://localhost:8000/question/${question_id}`).then(res => {
            setQuestion(res.data);
        }).catch(err => {
            console.log(err);
        })
    }

    function getAnswers() {
        axios.get(`http://localhost:8000/question/${question_id}/answers`).then(res => {
            setAnswers(res.data);
        }).catch(err => {
            console.log(err);
        })
    }

    function createAnswer() {
        console.log(isCorrect);
        axios.post(`http://localhost:8000/answer`, {
            name,
            question_id,
            isCorrect
        }).then(res => {
            setAnswers([...answers, res.data]);
            onCloseModal();
        }).catch(err => {
            console.log(err);
        })
    }

    function deleteAnswer(id) {
        axios.delete(`http://localhost:8000/answer/${id}`).then(res => {
            setAnswers(answers.filter(answer => answer.id !== id));
        }).catch(err => {
            console.log(err);
        })
    }

    function openUpdateModal(answer) {
        setCurrentAnswer(answer);
        setOpenModal(true);
        setName(answer.name);
        setIsCorrect(answer.is_correct);
    }

    function updateAnswer(id) {
        axios.put(`http://localhost:8000/answer/${id}`, {
            name,
            question_id,
            isCorrect
        }).then(res => {
            setAnswers(answers.map(answer => {
                if(answer.id === id) {
                    return res.data;
                }
                return answer;
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
                                currentAnswer ? "Modifier une réponse" : "Créer une réponse"
                            }
                        </h3>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="name" value="Réponse" />
                            </div>
                            <TextInput
                                id="name"
                                placeholder="Réponse"
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                                required
                            />
                        </div>
                        <ToggleSwitch checked={isCorrect} label={isCorrect ? "Bonne réponse" : "Mauvaise réponse"} onChange={setIsCorrect} />
                        <div className="w-full">
                            {
                                currentAnswer ? 
                                <Button className='w-full' onClick={() => updateAnswer(currentAnswer.id)}>Modifier</Button>
                                :
                                <Button className='w-full' onClick={createAnswer}>Créer</Button>
                            }
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
            <h2 className="text-4xl underline text-center font-bold tracking-tight text-gray-900 dark:text-white">
                {question.name}
            </h2>
            {
                answers.length === 4 ? 
                    <Tooltip content="Vous ne pouvez pas créer plus de 4 réponses">
                        <Button onClick={() => setOpenModal(true)} disabled className='mt-2'>Ajouter une réponse</Button>
                    </Tooltip>
                    :
                    <Button onClick={() => setOpenModal(true)} className='mt-2'>Ajouter une réponse</Button>
            }

            <div className="flex flex-col gap-4 mt-6 flex-wrap">
                {
                    answers.map(answer => {
                        return (
                            <AnswerCard key={answer.id} answer={answer} deleteAnswer={() => deleteAnswer(answer.id)} updateAnswer={() => openUpdateModal(answer)} />
                        )
                    })
                }
            </div>
        </div>
    )
}