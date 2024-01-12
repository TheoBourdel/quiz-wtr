import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from './components/Layout';
import Admin from './components/Admin';
import QuizEdition from './components/QuizEdition';
import QuestionEdition from './components/QuestionEdition';
import Login from './pages/login';
import Register from './pages/register';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="admin" element={<Admin />} />
          <Route path='admin/quiz/:id' element={<QuizEdition />} />
          <Route path='admin/quiz/:id/question/:question_id' element={<QuestionEdition />} />
          <Route path='login' element={<Login />} />
          <Route path='register' element={<Register />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
