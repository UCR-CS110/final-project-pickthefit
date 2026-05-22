// import './App.css'

// function App() {


//   return (
//     <>
//       hello
//     </>
//   )
// }

// export default App

import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter,Routes,Route} from 'react-router-dom';

import Login from './components/Login';
// import Signup from './Signup';
// import Home from './Home';
// import Room from './Room';
import './style.css';

// ReactDOM.createRoot(
//   document.getElementById('root')
// ).render(
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />}/>
      </Routes>
    </BrowserRouter>
  );
}
