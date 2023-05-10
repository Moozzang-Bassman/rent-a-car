import './App.css';
import { Routes, Route } from 'react-router-dom';
import List from './pages/List';
import Landing from './pages/Landing';
import Error from './pages/Error';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing></Landing>} />
        <Route path="/list" element={<List></List>} />
        <Route path="*" element={<Error></Error>} />
      </Routes>
    </>
  );
}

export default App;
