'use client';
import React, { useEffect, useState } from 'react'
import { Button, Card, TextInput } from 'flowbite-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';

export default function QuizCard({ name, isAdmin, deleteQuiz, quizId, updateQuiz, createRoom, isCreationRoom}) {
    const {user} = useAuth();
    const [room, setRoom] = useState();
    const [roomId, setRoomId] = useState('');
    const [currsocket, setSocket] = useState(null);
    const [nombrePersonneConnecte, setNombrePersonne] = useState();
    const [nombrePersonneMax, setNombrePersonneMax] = useState();
    const navigate = useNavigate();
    const socket = useSocket();


    function getRoomData(){
        axios.get(`http://localhost:8000/room/${quizId}`)
        .then(res => {
            setRoom(res.data)
            setNombrePersonneMax(res.data.nombreDePersonne)
            setRoomId(res.data.quiz_id+'-'+res.data.link)
        }).catch(err => {
            console.log(err);
        })
    }

    function changeRoomStatus(){
        if(room) {
            console.log(room?.id)
            axios.put(`http://localhost:8000/room/${room?.id}`, {
                status: 'start'
            }).then(res => {
                console.log(res)
                setRoom(res)
            }).catch(err => {
                console.log(err);
            })
        }
    }

    function joinGame() {
        const data = {roomId:room.quiz_id+'-'+room.link, userId: user?.id}
        if (roomId !== '' && user?.id !== '') {
            currsocket.emit('joinRoom', data);
            
            setTimeout(() => {
                navigate(`/quiz/${room.link}`)
            }, 1500)
        }
    }

    useEffect(() => {
        const socket = io('http://localhost:8000');
        setSocket(socket);
        
        socket.on('room sizes update', (data) => {
            setNombrePersonne(data?.users)
        });
    }, []);

    useEffect(() => {
        if(nombrePersonneMax && nombrePersonneConnecte && nombrePersonneMax == nombrePersonneConnecte) {
            changeRoomStatus()
        }
    }, [nombrePersonneMax, nombrePersonneConnecte])

    useEffect(() => {
        getRoomData()
    }, [quizId])

    return (
        <Card className="w-[500px]">
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {name} 
            </h5>
            {room && room.status === 'new' ? '' : 'En cours'}
            {nombrePersonneConnecte > 0 && nombrePersonneMax > nombrePersonneConnecte && 'La partie va bientot commancer' }

            <p className="font-normal text-gray-700 dark:text-gray-400">
                Nombre de Personnes {nombrePersonneConnecte ? nombrePersonneConnecte : 0 } / {nombrePersonneMax}
            </p>

            <p className="font-normal text-gray-700 dark:text-gray-400">
                Nombre de questions 
            </p>


            {
                isAdmin && (
                    <div className="mt-4 flex flex-row">
                        <Button color="gray" className="mr-2">
                            <Link to={"/admin/quiz/" + quizId}>Gérer les questions</Link>
                        </Button>
                        <Button className="mr-2" onClick={() => updateQuiz()}>Modifier</Button>
                        <Button color='failure' className="mr-2" onClick={() => deleteQuiz()}>Supprimer</Button>
                    </div>
                )  
            } 
            {
                !room ? (
                    <Button onClick={()=>createRoom()}>
                        START
                        <svg className="-mr-1 ml-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path
                                fillRule="evenodd"
                                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </Button>
                ) :
                (
                    <Button onClick={()=>joinGame()} disabled={nombrePersonneMax === nombrePersonneConnecte || room.status != 'new'}>
                        REJOINDRE LA PARTIE
                        <svg className="-mr-1 ml-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path
                                fillRule="evenodd"
                                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </Button>
                )
            }
            
        </Card>
    )
}
