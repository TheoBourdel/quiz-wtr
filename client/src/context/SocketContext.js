import React, { createContext } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:8000', { transports: ['websocket'] });
export const SocketContext = createContext(socket);

export const SocketProvider = ({ children }) => {
    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}