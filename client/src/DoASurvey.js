import React from 'react';
import * as Survey from "survey-react";
import "survey-react/survey.css";
import "./DoASurvey.css";
import { useNavigate } from "react-router-dom";

const DoASurvey = () => {

    Survey.StylesManager.applyTheme("modern");

    var surveyJSON = {
        "title": "Discover the best course for you!",
        "description": "Already know the type of courses you're looking for? Answer the following questions so Curriculum Curator can find the best courses for your prefereneces.",
        "logo": '../CC_logo.png',
        "logoPosition": "right",
        "pages": [
            {
                "name": "page1",
                "elements": [
                    {
                        "type": "text",
                        "name": "question1",
                        "title": "What would you like to learn",
                        "placeHolder": "e.g. Python, C++, JS, Machine Learning, etc."
                    },
                    {
                        "type": "rating",
                        "name": "question2",
                        "title": "What is your experience level? (1 - Beginner, 2 - Intermediate,  3 - Advanced)",
                        "rateMax": 3
                    },
                    {
                        "type": "checkbox",
                        "name": "question3",
                        "title": "Course Duration",
                        "choices": [
                            {
                                "value": "In A Day",
                                "text": "In A Day"
                            },
                            {
                                "value": "A Few Days",
                                "text": "A Few Days"
                            },
                            {
                                "value": "Week",
                                "text": "Week"
                            },
                            {
                                "value": "Month",
                                "text": "Month"
                            },
                            {
                                "value": "Semester (3 months)",
                                "text": "Semester (3 months)"
                            }
                        ]
                    },
                    {
                        "type": "checkbox",
                        "name": "question4",
                        "title": "Price ($)",
                        "choices": [
                            {
                                "value": "Free",
                                "text": "Free"
                            },
                            {
                                "value": "0-50",
                                "text": "< 50"
                            },
                            {
                                "value": "50-100",
                                "text": "50 - 100"
                            },
                            {
                                "value": "100-150",
                                "text": "100 - 150"
                            },
                            {
                                "value": "150-200",
                                "text": "150 - 200"
                            },
                            {
                                "value": "200+",
                                "text": "200 <"
                            }
                        ]
                    }, {
                        "type": "radiogroup",
                        "name": "question5",
                        "title": "What language would you like your course in ?",
                        "choices": [
                            {
                                "value": "item1",
                                "text": "English"
                            },
                            {
                                "value": "item2",
                                "text": "Spanish"
                            },
                            {
                                "value": "item3",
                                "text": "Both (English & Spanish)"
                            }
                        ]
                    }, {
                        "type": "radiogroup",
                        "name": "question6",
                        "title": "Would you like to see only acredited courses?",
                        "choices": [
                            {
                                "value": "item1",
                                "text": "Yes"
                            },
                            {
                                "value": "item2",
                                "text": "No"
                            }
                        ]
                    }
                ]
            }
        ]
    }

    const navigate = useNavigate()

    const navigateToResults = (survey) => {

        const query = new URLSearchParams(survey.data);

        navigate(`results?${query.toString()}`, { state: survey.data })

        console.log(survey.data)
    }

    return (
        <div>
            <link rel="stylesheet" type="text/css" href="DoASurvey.css"></link>
            <Survey.Survey json={surveyJSON} onComplete={navigateToResults} />

        </div>
    );
}

export default DoASurvey;