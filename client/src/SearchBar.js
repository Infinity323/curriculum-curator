import React, { useState } from 'react';
import './App.css';
import './LandingPage.css'
import {useNavigate} from "react-router-dom";

function SearchBar() {

  const [state, setState] = useState({question1: ""});

  const handleChange = event => {
    
    const { name, value } = event.target;
    setState(prevState => ({
        ...prevState,
        [name]: value
    }));
};

const navigate = useNavigate()

const handleSubmit = (event) => {

  //prevent the default form submission
  event.preventDefault()

  const query = new URLSearchParams(state);

  navigate(`results?${query.toString()}`, {state: state})

  };

  return (
    <div class="bar">
      
    <form onSubmit={handleSubmit}>
      <label>
        <input class="searchbar" type="text" placeholder="What would you like to learn?" value={state.question1} name="question1" onChange={handleChange} />
      </label>
      <input class="searchbutton" type="image" alt="Search button image" src="../search-button-icon.jpg" />
      </form>
    </div>
  );
};
 
export default SearchBar;