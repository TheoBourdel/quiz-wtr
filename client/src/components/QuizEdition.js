import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { Button, Modal, Label, TextInput } from 'flowbite-react';

export default function QuizEdition() {
    const [openModal, setOpenModal] = useState(false);
    const [quiz, setQuiz] = useState(false);
    const [name, setName] = useState('');
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        getQuiz();
        getQuestions();
    }, [])

    function onCloseModal() {
        setOpenModal(false);
        setName('');
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
            console.log(res.data);
            // onCloseModal();
        }).catch(err => {
            console.log(err);
        })
    }

    function getQuestions() {
        axios.get(`http://localhost:8000/quiz/${id}/questions`).then(res => {
            setQuestions(res.data.question);
            console.log(res.data);
        }).catch(err => {
            console.log(err);
        })
    }

    return (
        <div>
            <Modal show={openModal} size="md" onClose={onCloseModal} dismissible>
                <Modal.Body>
                    <div className="space-y-6">
                        <h3 className="text-xl font-medium text-gray-900 dark:text-white">Créer une question</h3>
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
                            <Button className='w-full' onClick={createQuestion}>Créer</Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {quiz.name}
            </h2>
            <Button onClick={() => setOpenModal(true)} className='mt-2'>Créer une question</Button>
        </div>
    )
}
