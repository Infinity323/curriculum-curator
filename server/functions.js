const CourseListing = require("./CourseListing");
const Servers = require("./server");
const express = require("express"); //Line 1
const app = express(); //Line 2
//const cors = require('cors');
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

function getUserInput(user_json_string) {
  user_json = JSON.parse(user_json_string);
  // Create JSON to send to API
  var api_json = new Object();
  // If input is from search bar, do this:
  if (Object.keys(user_json).length == 1) {
    // Make compatible with the three request functions
    api_json.topic = user_json.search.replace(/ /g, "_");
    api_json.duration = null;
    api_json.price = null;
    api_json.difficulty = null;
  }
  // If input is from quiz, do this:
  else {
    api_json.topic = user_json.question4.replace(/ /g, "_");
    switch (user_json.question1) {
      case 1:
        api_json.difficulty = "beginner";
        break;
      case 2:
        api_json.difficulty = "intermediate";
        break;
      case 3:
        api_json.difficulty = "advanced";
        break;
      default:
        api_json.difficulty = null;
        break;
    }
    // api_json.duration;
    // api_json.price;
  }
  console.log(api_json);

  return JSON.stringify(api_json); // return JSON stringify
}

// Function to send GET request to Udemy API
// Input is JSON containing parsed user input
// Calls parseUdemyResponse() function
function sendUdemyRequest(user_json) {
  if (user_json === undefined) return;

  // Parse user input JSON
  var input_array = JSON.parse(user_json);
  if (input_array === undefined) return;
  var topic = input_array.topic;
  var duration = input_array.duration;
  var difficulty = input_array.difficulty;
  var price = input_array.price;

  // Determine proper API input for difficulty
  var api_difficulty = "";
  if (difficulty == null) api_difficulty = "";
  else if (difficulty == "beginner") api_difficulty = "beginner";
  else if (difficulty == "intermediate") api_difficulty = "intermediate";
  else if (difficulty == "advanced") api_difficulty = "expert";
  // Determine proper API input for duration
  var api_duration = "";
  if (duration == null) api_duration = ""; // no duration specified
  else if (duration <= 1) api_duration = "extraShort";
  else if (duration <= 3) api_duration = "short";
  else if (duration <= 6) api_duration = "medium";
  else if (duration <= 17) api_duration = "long";
  else if (duration > 17) api_duration = "extraLong";
  // Determine proper API input for price
  var api_price = "";
  if (price == 0) api_price = "price-free";
  else if (price == 1) api_price = "price-paid";
  else if (price == null) api_price = ""; // no price specified

  // Send GET request
  const https = require("https");
  var n = 10; // number of courses to get
  // Add additional arguments to path string if needed
  var path_string =
    "/api-2.0/courses/?fields[course]=@all&page_size=" +
    String(n) +
    "&search=" +
    topic;
  if (api_duration != "") path_string += "&duration=" + api_duration;
  if (api_difficulty != "") path_string += "&instructional_level=" + difficulty;
  if (api_price != "") path_string += "&price=" + api_price;

  //console.log(path_string);
  const options = {
    hostname: "www.udemy.com",
    path: path_string,
    headers: {
      Accept: "application/json, text/plain, */*",
      Authorization: "Basic ",
      "Content-Type": "application/json;charset=utf-8",
    },
  };
  var udemy_results;
  https
    .get(options, (resp) => {
      let data = "";
      resp.on("data", (chunk) => {
        data += chunk;
      });
      resp.on("end", () => {
        udemy_results = JSON.parse(data).results;
        // Parse API results array
        return parseUdemyResponse(udemy_results, api_duration, api_difficulty);
      });
    })
    .on("error", (err) => {
      console.log("Error: " + err.message);
    });

  return;
}

// Function to parse Udemy "results" array
// Input is "results" JSON array from Udemy API
// Calls sendUdemyCourses() function
function parseUdemyResponse(results_array, api_duration, difficulty) {
  if (results_array === undefined) return;

  // Create empty array to hold course listing JSON's
  var course_obj_array = [];

  // Parse through results array
  for (var i = 0; i < results_array.length; i++) {
    var course = results_array[i];
    var course_obj = new CourseListing(
      course.title,
      "Udemy",
      course.headline,
      course.image_100x100,
      course.url,
      course.is_paid,
      course.price,
      api_duration,
      difficulty,
      course.avg_rating,
      course.num_reviews
    );
    // Push to JSON array
    course_obj_array.push(course_obj);
  }
  // Send JSON array to front end

  return course_obj_array;
}

// Function to send Udemy course JSON array to frontend
// Input is JSON array "object"
// function sendUdemyCourses(course_obj_array) {
//     console.log(course_obj_array);
//     return;
// }
app.get("/test2", (req, res) => {
  //Line 9
  res.send(course_obj_array); //Line 10
});

function sendUdemyCourses(course_obj_array) {
  app.get("/test1", (req, res) => {
    //Line 9
    console.log("UdemytoFE");
    res.send(res.body); //Line 10
  });
  app.get("/test2", (req, res) => {
    //Line 9
    res.send(course_obj_array); //Line 10
  });
  app.get("/test3", (req, res) => {
    //Line 9
    res.send(JSON.course_obj_array); //Line 10
  });
  app.get("/test", (req, res) => {
    //Line 9
    res.send(JSON.stringify(course_obj_array)); //Line 10
  });
  return;
}

module.exports = {
  getUserInput,
  sendUdemyRequest,
  parseUdemyResponse,
  sendUdemyCourses,
};
