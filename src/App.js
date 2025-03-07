import logo from './logo.svg';
import './App.css';
import RouletteWheel from './components/wheel/RouletteWheel';
import GetData from './components/getData';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import HomePage from './components/HomePage';

function App() {
  const hostName = window.location.origin.replace(/:\d+$/, ":9090/");
  debugger;
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<HomePage  hostName={hostName}/>}/>
          <Route path="/abcfdfedewsfetdfgjfergitrdfgvr" element={<GetData hostName={hostName}/>} />
        </Routes>
      </Router>
    
    </div>
  );
}

export default App;
