import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import dotenv from 'dotenv';
import quizRoute from './route/quizRoute.js';
import questionRoute from './route/questionRoute.js';
import answerRoute from './route/answerRoute.js';
import userRoute from './route/userRoute.js';
import roomRoute from './route/roomRoute.js';
import { Server } from 'socket.io';
import roomSocket from './services/roomWebsocket.js';
import { createServer } from 'http';

const app = express();
dotenv.config();

app.use(cors({ 
    origin: '*',
    methods:['GET', 'POST', 'PUT', 'DELETE'] 
}))
app.use(express.json());
app.use(helmet());
app.use(bodyParser.json());

app.use('/', quizRoute);
app.use('/', questionRoute);
app.use('/', answerRoute);
app.use('/', userRoute);
app.use('/', roomRoute);

const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", 
        methods: ["GET", "POST"]
    }
});
io.on('connect', (socket) => {
    console.log('A user connected', socket.id);
    roomSocket(io)(socket);
});

app.get('/api', (req, res) => {
    res.send('Hello World!')
})

server.listen(8000, () => {
    console.log(`Server listening on 8000`);
});