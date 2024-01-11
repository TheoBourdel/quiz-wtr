import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from './components/Layout';
import Admin from './components/Admin';
import QuizEdition from './components/QuizEdition';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="admin" element={<Admin />} />
          <Route path='admin/quiz/:id' element={<QuizEdition />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
