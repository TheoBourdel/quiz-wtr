'use client';
import React, { useEffect, useState } from 'react'
import { Button, Card } from 'flowbite-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import { useNavigate } from "react-router-dom";


export default function QuizCard({ name, isAdmin, deleteQuiz, quizId, updateQuiz, createRoom, isCreationRoom}) {

    const [room, setRoom] = useState();
    const [roomId, setRoomId] = useState('');
    const navigate = useNavigate();
    const socket = io('http://localhost:8000', { transports: ['websocket'] });


    function getRoomData(){
        axios.get(`http://localhost:8000/room/${quizId}`)
        .then(res => {
            setRoom(res.data)
            setRoomId(res.data.quiz_id+'-'+res.data.link)
        }).catch(err => {
            console.log(err);
        })
    }

    function joinGame() {
        navigate(`/quiz/${room.link}`)
        socket.emit('joinRoom', room.quiz_id+'-'+room.link);
    }

    useEffect(() => {
        getRoomData()
    }, [quizId])

    useEffect(() => {
        if(roomId) {
            socket.emit('getRoomCount',roomId, (count) => {
                console.log(`Il y a ${count} personne(s) dans la room ${roomId}.`);
            });
        }
    }, [roomId])

    return (
        <Card className="w-[500px]">
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {name}
            </h5>
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
                    <Button onClick={()=>joinGame()}>
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
