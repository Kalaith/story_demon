import { BrowserRouter, Routes, Route } from 'react-router-dom';
import StoryDemonPage from './pages/StoryDemonPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/story_demon" element={<StoryDemonPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
