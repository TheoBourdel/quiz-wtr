'use client';
import React, { useState, useEffect }  from 'react'
import { Link } from 'react-router-dom';
import { Button, Label, Modal, TextInput, ToggleSwitch } from 'flowbite-react'; 
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import QuizCard from './QuizCard';
import io from 'socket.io-client';

export default function Games() {
    const [quizs, setQuizs] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [currentQuiz, setCurrentQuiz] = useState(null);
    const [isPrivate, setIsPrivate] = useState(false);
    const token = generateToken();
    const [formData, setFormData] = useState({
        nombreDePersonne: '',
        isPrivate: '',
        link:'http://localhost:3000/quiz/'+token,
        password:''

    });
    const navigate = useNavigate();


    function generateToken() {
        return Math.random().toString(16).substr(2);
    }

    useEffect(() => {
        getQuizs();
    }, []);

    const getCurrentQuiz = (quiz) => {
        setOpenModal(true);
        setCurrentQuiz(quiz);
    }

    function onCloseModal() {
        setOpenModal(false);
        setCurrentQuiz(null);
    }

    function getQuizs() {
        axios.get('http://localhost:8000/quizs').then(res => {
            setQuizs(res.data);
        }).catch(err => {
            console.log(err);
        })
    }

    function createRoom() {
        // console.log(currentQuiz.id)
        axios.post('http://localhost:8000/room', {
            nombreDePersonne: formData.nombreDePersonne,
            isPrivate: isPrivate,
            link: formData.link,
            password: isPrivate ? formData.password :'',
            quiz_id: currentQuiz.id,
            status: 'new'
        }).then(res => {
            onCloseModal();
            navigate(`/quiz/${token}`)
            const socket = io('http://localhost:8000', { transports: ['websocket'] });
            socket.emit('joinRoom', currentQuiz.id+'-'+token);
        }).catch(err => {
            console.log(err);
        })
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    return (
        <div className="cursor-pointer flex rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800 flex-row h-full w-full justify-between gap-4 p-6 items-center">
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                game
            </h5>
            <Modal show={openModal} size="md" onClose={onCloseModal} dismissible>
                <Modal.Body>
                    <div className="mb-6">
                        <Label htmlFor="nombreDePersonne" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" value="Nombre de joueurs"/>
                        <TextInput 
                            onChange={handleChange}
                            value={formData.username} 
                            name="nombreDePersonne" 
                            type="text" 
                            id="nombreDePersonne" 
                            placeholder="Nombre de joueurs" 
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                            required />
                    </div>
                    <ToggleSwitch checked={isPrivate} label={isPrivate ? "Privé" : "Public"} onChange={setIsPrivate} />
                    {
                        isPrivate &&
                        <div className="mt-6">
                            <Label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" value="Mot de passe"/>
                            <TextInput 
                                onChange={handleChange}
                                value={formData.password}
                                name="password"
                                type="text" 
                                id="password" 
                                placeholder="Mot de passe" 
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                required />
                        </div>
                    }
                    <div className="mt-6">
                        <Button className='w-full' onClick={createRoom}>
                            START
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>
            <div className='flex flex-row gap-4 mt-6 flex-wrap'>
                {
                    quizs.map(quiz => {
                        return (
                            <QuizCard
                                key={quiz.id} 
                                name={quiz.name} 
                                isAdmin={false} 
                                quizId={quiz.id} 
                                createRoom={()=> getCurrentQuiz(quiz)}
                            />
                        )
                    })
                }
            </div>
        </div>
    )
}
