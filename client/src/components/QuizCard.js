'use client';
import React, { useEffect, useState } from 'react'
import { Button, Card, TextInput } from 'flowbite-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';

export default function QuizCard({isRoom, room, name, isAdmin, deleteQuiz, quizId, updateQuiz, createRoom, joinGame, nbPersonne}) {

    const [currentRoom, setRoom] = useState();
    const [roomSize, setRoomSize] = useState(0);
    // const socket = useSocket();
    // const socket = io('http://localhost:8000');


    function getCurrentQuizData(){
        axios.get(`http://localhost:8000/quiz/${room.quiz_id}`)
        .then(res => {
             setRoom(res.data)
        }).catch(err => {
            console.log(err);
        })
    }

    useEffect(() => {
        if(room) {
            getCurrentQuizData();
        }
    }, []);

    // useEffect(() => {
    //     if(room) {
    //         if(roomSize !== room.nombreDePersonne) {

    //             const intervalId = setInterval(() => {
    //                 // socket.emit('request room size', room?.link);
    //             }, 1000);
        
    //             // socket.on('room size', (data) => {
    //             //     setRoomSize(data.roomSize)
    //             // });
                
    //             // return () => {
    //             //     clearInterval(intervalId);
    //             //     socket.off('room size');
    //             //     socket.close();
    //             // };
    //         }

    //     }
    // }, [room, socket]);


    return (
        <Card className="w-[500px]">
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {name} 
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
                {isRoom == false ? 'Nombre de questions' : ''} 
                
            </p>
            {isRoom && room && room.status !== 'new' ? 'En cours' : ''}
            {
                    room && 
                    <p className="font-normal text-gray-700 dark:text-gray-400">
                        Nombre de Personnes {roomSize ? roomSize : 0 } / {room?.nombreDePersonne}
                    </p>
            }
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {currentRoom && currentRoom.name} 
            </h5>

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
                !isRoom ? (
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
                    <Button
                    onClick={()=>joinGame()} 
                    disabled={roomSize == room.nombreDePersonne|| room.status != 'new'}
                    >
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
