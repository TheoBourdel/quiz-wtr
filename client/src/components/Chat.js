import React, { useState, useEffect } from 'react';
import { useSocket } from "../hooks/useSocket";
import { useAuth } from '../context/AuthContext';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const socket = useSocket();
  const { user } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() !== '') {
        // Utilisez 'from' pour le nom d'utilisateur pour correspondre à la structure du message reçu
        setMessages(prevMessages => [...prevMessages, { text: inputValue.trim(), status: 'sending', from: user.username }]);
        socket.emit('chat message', { message: inputValue.trim(), username: user.username });
        setInputValue('');
    }
};


  useEffect(() => {
    socket.on('chat message', (message) => {
        if (!messages.some(msg => msg.text === message.text)) {
            setMessages(prevMessages => [...prevMessages, message]);
        }
    });

    return () => {
        socket.off('chat message');
    };
  }, [socket, messages]);

  return (
    <div>
        <ul>
        {messages.map((message, index) => (
            <li key={index}>
                {message.from}: {message.text}
            </li>
        ))}

        </ul>
      <form onSubmit={handleSubmit}>
        <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
        <button type="submit">Envoyer</button>
      </form>
    </div>
  );
};

export default Chat;
