import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import dotenv from 'dotenv';
import quizRoute from './route/quizRoute.js';
import questionRoute from './route/questionRoute.js';
import answerRoute from './route/answerRoute.js';

const app = express();
dotenv.config();

app.use(cors({ 
    // credentials:true, 
    origin: '*',
    methods:['GET', 'POST', 'PUT', 'DELETE'] 
}))
app.use(express.json());
app.use(helmet());
app.use(bodyParser.json());

app.use('/', quizRoute);
app.use('/', questionRoute);
app.use('/', answerRoute);

app.get('/api', (req, res) => {
    res.send('Hello World!')
})

app.listen(8000, () => {
    console.log(`Server listening on 8000`);
});