import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import './HelpPage.css';
const HelpPage = () => {
    return (
        <div class="body">
            <div class="main_help">
                <div class="img-wrapper">
                    <img class="cur_img" alt="Curriculum Curator" src="./CC_logo.png"></img>
                </div>
                <h1>Help! Where am I?</h1>
                <h3>How to use Curriculum Curator</h3>
                {/* </div> */}
                {/* <div id="text_help"> */}
                <p>The aim of this site is to assist in the search process for online courses. Based on the topic you search for, Curriculum Curator will pull from various learning platforms on the web (Udemy and Coursera) and display appropriate courses on the main page. You can additionally filter your display results by duration, price, experience, and language.</p>
                <p>How to use...</p>
                <ol>
                    <li id="helplist">Search bar - If you are unsure about the kinds of courses you are looking for, use the search bar to get a general list and then use our filter buttons to narrow your search later on. </li>
                    <li id="helplist">Quiz - Take the Curriculum Curator quiz if you have an idea of what you're looking for in your courses. You can always change your preferences later using the filter buttons on the main page.</li>
                </ol>
            </div>
        </div>
    );
}

export default HelpPage;