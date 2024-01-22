import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from './components/Layout';
import Admin from './components/Admin';
import QuizEdition from './components/QuizEdition';
import QuestionEdition from './components/QuestionEdition';
import Login from './pages/login';
import Register from './pages/register';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';

import Games from './components/Game';
import Quiz from './components/Quiz';

function App() {
  return (

  <AuthProvider>
    <SocketProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="admin" element={<Admin />} />
          <Route path='admin/quiz/:id' element={<QuizEdition />} />
          <Route path='admin/quiz/:id/question/:question_id' element={<QuestionEdition />} />
          <Route path='login' element={<Login />} />
          <Route path='register' element={<Register />} />
          <Route path='quizs' element={<Games />} />
          <Route path='quiz/:link' element={<Quiz />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </SocketProvider>
  </AuthProvider>
  );
}

export default App;
