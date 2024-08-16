import React, { Component } from 'react';
import './App.css';
import SearchBar from './SearchBar';
import './LandingPage.css';
import { Link } from 'react-router-dom';

class LandingPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
        <div class="whole">
            <header>
                <ul>
                <li><Link to="help"><button type="button" class="button">Help</button></Link></li>
                <li><Link to="about"><button type="button" class="button">About</button></Link></li>
                </ul>  
            </header>
            <div class="logo">
                <img class="cur_img" alt="Curriculum Curator" src="./CC_logo.png"></img>
            </div>
            <div class="info">
              <p>Curriculum Curator searches different learning websites to find the perfect course for you!</p>
            </div>
            <div>
              <SearchBar />
            </div>
            <div class="bottom_button">
              <Link to="quiz"><button type="button" class="button">Not sure? Take our simple quiz!</button></Link>
            </div>
        </div>
    );
  }
}

export default LandingPage;