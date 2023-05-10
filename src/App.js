import './App.css';
import { Routes, Route } from 'react-router-dom';
import List from './pages/List';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<div>빈창</div>} />
        <Route path="/list" element={<List></List>} />
      </Routes>
    </>
  );
}

export default App;
