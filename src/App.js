import './App.css';
import GetData from './components/getData';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';

function App() {
  // console.log('All env variables:', process.env);
  // console.log('Specific variable:', process.env.REACT_APP_NODE_URL);
    const NodeUrl = process.env.REACT_APP_NODE_URL;
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<HomePage  NodeUrl={NodeUrl}/>}/>
          <Route path="/abcfdfedewsfetdfgjfergitrdfgvr" element={<GetData NodeUrl={NodeUrl}/>} />
        </Routes>
      </Router>
    
    </div>
  );
}

export default App;
