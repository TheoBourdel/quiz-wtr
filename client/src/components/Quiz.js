import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Label, Modal, TextInput } from 'flowbite-react';
import axios from 'axios';

import io from 'socket.io-client';
import { ToastContainer, toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';

function Quiz() {
    const { link } = useParams();
    const [room, setRoom] = useState();
    const [isPrivate, setIsPrivate] = useState();
    const [password, setPassword] = useState();
    const [openModal, setOpenModal] = useState(false);
    const {user} = useAuth();
    const socket = useSocket();
    // const socket = io('http://localhost:8000');


    function getRoomData(){
        axios.get(`http://localhost:8000/roomlink/${link}`)
        .then(res => {
            setRoom(res.data)
            setIsPrivate(res.data.isPrivate)
            setOpenModal(res.data.isPrivate)
        }).catch(err => {
            console.log(err);
        })
    }

    useEffect(() => {
        getRoomData();

        if(socket) {
            console.log(socket)
            const leaveRoom = () => {
                socket.emit('leave_room', room?.link);
            };
    
            window.addEventListener('beforeunload', leaveRoom);
    
            return () => {
                leaveRoom();
                socket.emit('leave_room', room?.link)
                window.removeEventListener('beforeunload', leaveRoom);
            };
        } else {

            console.log(socket)
            
        }

        

    }, [link, room]);

    function checkPassword () {
        if(password && room ) {
            if(password === room.password) {
                setOpenModal(false);
            } else {
                toast.error("mot de passe incorrect", {
                    position: toast.POSITION.TOP_RIGHT 
                });
            }
        }
    }

    return (
        <div> 
            <ToastContainer /> 
            {
                isPrivate && 
                (<Modal show={openModal} size="md" dismissible>
                    <Modal.Body>
                        <div className="space-y-6">
                            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                                Inserer le mot de passe
                            </h3>
                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="name" value="Password" />
                                </div>
                                <TextInput
                                    id="name"
                                    placeholder="Password"
                                    onChange={(event) => setPassword(event.target.value)}
                                    required
                                />
                            </div>
                            <div className="w-full">
                                <Button  className='w-full' onClick={checkPassword} >Valider</Button>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal> )
            }
            <h1>Quiz</h1>
            <p>Link: {link}</p>
        </div>
    );
}

export default Quiz;
