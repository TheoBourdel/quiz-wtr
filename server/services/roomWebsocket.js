export default function (io) {
    const users = {};
    return function (socket) {

        socket.on('joinRoom', (data) => {
            for (const room of socket.rooms) {
                if (room !== socket.id) { 
                    socket.leave(room);
                }
            }
            socket.join(data.roomId);
        });

        socket.on('request room size', (roomId) => {
            const room = io.sockets.adapter.rooms.get(roomId);
            const roomSize = room ? room.size : 0;
            socket.emit('room size', { roomId, roomSize });
        });

        socket.on('leave_room', (room) => {
            socket.leave(room);
            console.log(`Utilisateur ${socket.id} a quitté la room ${room}`);
            io.to(room).emit('user_left', socket.id);  
        });

        socket.on('disconnect', () => {
            for (const room of socket.rooms) {
                if (room !== socket.id) {
                    socket.leave(room);
                    // Optionnel: Envoyer une notification aux autres dans la room
                    io.to(room).emit('user_left', socket.id);
                }
            }
            console.log(`Utilisateur ${socket.id} s'est déconnecté`);
        });
    };
}
