'use client';
import React, { useState, useEffect }  from 'react'
import { Link } from 'react-router-dom';
import { Button, Label, Modal, TextInput, ToggleSwitch } from 'flowbite-react'; 
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import QuizCard from './QuizCard';
import io from 'socket.io-client';
import { ToastContainer, toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../hooks/useSocket';

export default function Games() {
    const [quizs, setQuizs] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [showCodeModal, setshowCodeModal] = useState(false);
    const [currentQuiz, setCurrentQuiz] = useState(null);
    const [isPrivate, setIsPrivate] = useState(false);
    const [rooms, setRooms] = useState([]);
    const [gameCode, setGameCode] = useState({code:''});
    const [nombrePersonneConnecte, setNombrePersonne] = useState();
    const { user } = useAuth();
    const navigate = useNavigate();
    const token = generateToken();
    const [formData, setFormData] = useState({
        nombreDePersonne: '',
        isPrivate: '',
        link: token,
        password:''
    });
    const socket = useSocket();
    function generateToken() {
        return Math.random().toString(16).substr(2);
    }

    useEffect(() => {
        getQuizs();
        getRooms();
    }, [openModal]);

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

    function getRooms(){
        axios.get(`http://localhost:8000/rooms`)
        .then(res => {
            setRooms(res.data)
        }).catch(err => {
            console.log(err);
        })
    }

    function createRoom() {
        axios.post('http://localhost:8000/room', {
            nombreDePersonne: formData.nombreDePersonne,
            isPrivate: isPrivate,
            link: formData.link,
            password: isPrivate ? formData.password :'',
            quiz_id: currentQuiz.id,
            status: 'new'
        }).then(res => {
            onCloseModal();
        }).catch(err => {
            console.log(err);
        })
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleChangeCode = (e) => {
        const { name, value } = e.target;
        setGameCode({ ...gameCode, [name]: value });
    };

    function joinGame(room) {
        console.log(room.Quiz)
        const data = {roomId:room.link, userId: user?.id, roomSize: room.nombredepersonne, quiz: room.Quiz}
        if ( user?.id !== '') {
            socket.emit('joinRoom', data);
            navigate(`/quiz/${room.link}`)
        }
    }

    function joinGameWithCode () {
        axios.get(`http://localhost:8000/roomlink/${gameCode.code}`)
        .then(res => {
            if(res) {
                console.log('joindre', res)
                setOpenModal(false)
                joinGame(res.data)
            }
        }).catch(err => {
            console.log(err);
            toast.error("invalide code", {
                position: toast.POSITION.TOP_RIGHT 
            });
        })
    }

    function openJoinGameModal () {
        setshowCodeModal(true)
        setOpenModal(true)
    }

    // function changeRoomStatus(){
    //     if(room) {
    //         console.log(room?.id)
    //         axios.put(`http://localhost:8000/room/${room?.id}`, {
    //             status: 'start'
    //         }).then(res => {
    //             console.log(res)
    //             setRoom(res)
    //         }).catch(err => {
    //             console.log(err);
    //         })
    //     }
    // }

    // useEffect(() => {
    //     if(nombrePersonneMax && nombrePersonneConnecte && nombrePersonneMax == nombrePersonneConnecte) {
    //         changeRoomStatus()
    //     }
    // }, [nombrePersonneMax, nombrePersonneConnecte])

    return (
        <>
        <ToastContainer /> 
        <div className="cursor-pointer flex rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800 flex-row h-full w-full justify-between gap-4 p-6 items-center">
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                game
            </h5>
            <Button onClick={openJoinGameModal}>Rejoindre une partie avec un code</Button>
            <Modal show={openModal} size="md" onClose={onCloseModal} dismissible>
                {
                    showCodeModal ? 
                    <Modal.Body>
                        <div className="mb-6">
                            <Label htmlFor="nombreDePersonne" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" value="Rensegner le code"/>
                            <TextInput 
                                onChange={handleChangeCode}
                                value={gameCode.code} 
                                name="code" 
                                type="text" 
                                id="code" 
                                placeholder="Rensegner le code" 
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                required />
                        </div>
                        <div className="mt-6">
                            <Button className='w-full' onClick={joinGameWithCode}>
                                Rejoindre
                            </Button>
                        </div>
                    </Modal.Body>
                     : 
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
                }
   
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
                                isRoom={false}
                            />
                        )
                    })
                }
            </div>

            
        </div>
        <div className="cursor-pointer mt-10 flex rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800 flex-row h-full w-full justify-between gap-4 p-6 items-center">
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                Rooms
            </h5>

            <div className='flex flex-row gap-4 mt-6 flex-wrap'>
                {
                    rooms.map(room => {
                        return (
                            <QuizCard
                                room={room}
                                isRoom={true}
                                key={room.id} 
                                isAdmin={false} 
                                createRoom={()=> getCurrentQuiz(room)}
                                joinGame={()=>joinGame(room)}
                                nbPersonne={nombrePersonneConnecte}
                            />
                        )
                    })
                }
            </div>
        </div>

        </>
    )
}
