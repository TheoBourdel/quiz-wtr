import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Button, Modal, TextInput, Label, ToggleSwitch } from 'flowbite-react';
import axios from 'axios';

export default function QuestionEdition() {
    const { question_id } = useParams();
    const [question, setQuestion] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [name, setName] = useState('');
    const [answers, setAnswers] = useState([]);
    const [isCorrect, setIsCorrect] = useState(false);

    useEffect(() => {
        getAnswers();
        getQuestion();
    },[question_id])

    function onCloseModal() {
        setOpenModal(false);
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
        axios.post(`http://localhost:8000/answer`, {
            name,
            question_id
        }).then(res => {
            setAnswers([...answers, res.data]);
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
                        <h3 className="text-xl font-medium text-gray-900 dark:text-white">Créer une réponse</h3>
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
                            <Button className='w-full' onClick={createAnswer}>Créer</Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
            <h2 className="text-4xl underline text-center font-bold tracking-tight text-gray-900 dark:text-white">
                {question.name}
            </h2>
            <Button onClick={() => setOpenModal(true)} className='mt-2'>Ajouter une réponse</Button>
            {
                answers.map(answer => {
                    return (
                        <div key={answer.id} className="cursor-pointer flex rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800 flex-row h-full w-full justify-between gap-4 p-6 items-center">
                            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                {answer.name}
                            </h5>
                            {/* <div className="flex flex-row">
                                <Button className="mr-2">Modifier</Button>
                                <Button color='failure' className="mr-2">Supprimer</Button>
                            </div> */}
                        </div>
                    )
                })
            }
        </div>
    )
}