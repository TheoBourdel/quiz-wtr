export default function (io) {
    const users = {};
    return function (socket) {

        socket.on('joinRoom', (data) => {
            socket.join(data.roomId);
        });

        setInterval(() => {
            let roomSizes = {};
            io.sockets.adapter.rooms.forEach((value, key) => {
                if (!value.has(key)) {  // vérifie que ce n'est pas une socket individuelle
                    roomSizes = {room:key, users:value.size};
                }
            });
            io.emit('room sizes update', roomSizes);
        }, 10000);  

    };
}
