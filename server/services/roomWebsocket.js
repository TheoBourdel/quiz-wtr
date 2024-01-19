export default function (io) {
    return function (socket) {
        socket.on('joinRoom', (roomId) => {
            console.log('joinRoom===> ',roomId)
            socket.join(roomId);
            console.log(`User joined room: ${roomId}`);
            socket.emit('joinedRoom', roomId);
        });

        socket.on('leaveRoom', (roomId) => {
            socket.leave(roomId);
            console.log(`User left room: ${roomId}`);
        });

        socket.on('getRoomCount', (roomId, callback) => {
            io.in(roomId).allSockets().then(sockets => {
                const count = sockets.size; 
                console.log(count)
                callback(count);
            }).catch(error => {
                console.error('Erreur lors de la récupération du nombre de personnes dans la room:', error);
            });
        });
    };
}
