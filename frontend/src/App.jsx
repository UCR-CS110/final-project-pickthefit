import {BrowserRouter,Routes,Route} from 'react-router-dom';

import Login from './components/Login';
import Signup from './components/Signup';
import Home from './components/Home';
import Closet from './pages/Closet';
import './style.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />}/>
        <Route path="/home" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/closet" element={<Closet />} />
      </Routes>
    </BrowserRouter>
  );
}
