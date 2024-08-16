import React, { Component } from 'react';
import './App.css';
import LandingPage from './LandingPage';
import './LandingPage.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DoASurvey from './DoASurvey';
import ResultsPage from './ResultsPage';
import HelpPage from './HelpPage';
import AboutPage from './AboutPage';

class App extends Component {
state = {};

  render() {
    return (
      <>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="quiz" element={<DoASurvey />} />
          <Route path="quiz/results" element={<ResultsPage />} />
          <Route path="results" element={<ResultsPage />} />
          <Route path="help" element={<HelpPage />} />
          <Route path="about" element={<AboutPage />} />
        </Routes>
      </Router>
      </>
    );
  }
}

export default App;