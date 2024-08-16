import React, { Component } from 'react';
import './App.css';
import './HelpPage.css';
const AboutPage = () => {
    return (
        <div class="body">
            <div class="main_help">
                <div class="img-wrapper">
                    <img class="cur_img" alt="Curriculum Curator" src="./CC_logo.png"></img>
                </div>
                <h1>About</h1>
                <h3>Who are we?</h3>
                <p>Curriculum Curator was designed and built by a team in CSCE 315 at Texas A&M University.</p>
                <h3>How was Curriculum Curator built?</h3>
                <p>Curriculum Curator was built using NodeJS, ExpressJS for the backend, and ReactJS for the frontend.</p>
                <ol>
                    <li id="helplist">The course results are returned using API calls to Udemy and Coursera.</li>
                    <li id="helplist">The Google Translate API is used in order to translate each page.</li>
                </ol>
            </div>
        </div>
    );
}

export default AboutPage;