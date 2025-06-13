import React from 'react';
import DocxUploader from './components/DocxUploader';
import ConsoleChecker from './components/ConsoleChecker';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import Home from './pages/home';


function App() {
  return (
    <Router>
        <nav>
          <ul>
            <li><Link to="/">Top</Link></li>
            <li><Link to="/docToHTMLConverter">Word Doc to HTML Converter</Link></li>
            <li><Link to="/consoleChecker">URL Error Checker</Link></li>
          </ul>        
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/docToHTMLConverter" element={<DocxUploader />} />
          <Route path="/consoleChecker" element={<ConsoleChecker />} />
        </Routes>
    </Router>
);
}

export default App;

