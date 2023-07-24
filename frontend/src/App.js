import { Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/home/Home';
import Poll from './pages/poll/Poll';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/poll/:pollId' element={<Poll />} />
    </Routes>
  );
}

export default App;
