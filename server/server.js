const CourseListing = require("./CourseListing");
//const edXCrawler = require('./edXCrawler');

///////////////////////////
// EXPRESS BACKEND SETUP //
///////////////////////////

const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions)); // Use this after the variable declaration

// This displays message that the server running and listening to specified port
app.listen(port, () => console.log(`Listening on port ${port}`));

///////////////////////////////
// GENERAL BACKEND FUNCTIONS //
///////////////////////////////

// Number of courses to pull from each API
const NUM_COURSES = 15;
// Global variable for price range
var PRICE_RANGE = "";
var LANGUAGE = "";
var IS_ACCREDITED = false;

// Parses user input
// Has different "routes" for search bar and quiz
// Returns stringify'd JSON of parsed user input
async function getUserInput(user_json_string) {
  user_json = JSON.parse(user_json_string);
  // Create JSON to send to API
  var api_json = new Object();
  // If input is from search bar, do this:
  if (Object.keys(user_json).length == 1) {
    // Make compatible with the three request functions
    api_json.topic = encodeURIComponent(user_json.search);
    api_json.duration = null;
    api_json.price = null;
    api_json.difficulty = null;
    api_json.language = null;
    api_json.is_accredited = null;
  }
  // If input is from quiz, do this:
  else {
    api_json.topic = encodeURIComponent(user_json.question1);
    switch (user_json.question2) {
      case "1":
        api_json.difficulty = "beginner";
        break;
      case "2":
        api_json.difficulty = "intermediate";
        break;
      case "3":
        api_json.difficulty = "advanced";
        break;
      default:
        api_json.difficulty = null;
        break;
    }
    switch (user_json.question3) {
      // Values are catered to Udemy implementation. Might need to adjust
      case "In A Day":
        api_json.duration = 1;
        break;
      case "A Few Days":
        api_json.duration = 3;
        break;
      case "Week":
        api_json.duration = 6;
        break;
      case "Month":
        api_json.duration = 17;
        break;
      case "Semester (3 months)":
        api_json.duration = 24;
        break;
      default:
        api_json.duration = null;
        break;
    }
    switch (user_json.question4) {
      // Price "filtering" must be applied after API pull
      case "Free":
        api_json.price = 0;
        break;
      case "0-50":
        api_json.price = 1;
        break;
      case "50-100":
        api_json.price = 1;
        break;
      case "100-150":
        api_json.price = 1;
        break;
      case "150-200":
        api_json.price = 1;
        break;
      case "200+":
        api_json.price = 1;
        break;
      default:
        api_json.price = null;
        break;
    }
    switch (user_json.question5) {
      case "item1":
        api_json.language = "en";
        break;
      case "item2":
        api_json.language = "es";
        break;
      case "item3": // "Both languages" means there won't be a specific language query
        api_json.language = null;
        break;
      default:
        api_json.language = null;
        break;
    }
    switch (user_json.question6) {
      case "item1":
        IS_ACCREDITED = true;
    }
    PRICE_RANGE = user_json.question4;
    LANGUAGE = api_json.language;
  }
  console.log("Parsed user input:");
  console.log(api_json);

  return JSON.stringify(api_json); // return JSON stringify
}

// Filters course listing JSON array by price range
// Returns filtered array
async function filterByPrice(course_obj_array) {
  if (PRICE_RANGE == "" || PRICE_RANGE == null) return course_obj_array;

  var lower = 0;
  var upper = 0;
  switch (PRICE_RANGE) {
    case "Free":
      return course_obj_array;
    case "0-50":
      lower = 0;
      upper = 50;
      break;
    case "50-100":
      lower = 50;
      upper = 100;
      break;
    case "100-150":
      lower = 100;
      upper = 150;
      break;
    case "150-200":
      lower = 150;
      upper = 200;
      break;
    case "200+":
      lower = 200;
      upper = 10000;
      break;
    default:
      return course_obj_array;
  }
  // Remove courses from array whose price is out of the range
  var i = 0;
  while (i < course_obj_array.length) {
    if (course_obj_array[i].price < lower || course_obj_array[i].price > upper)
      course_obj_array.splice(i, 1);
    else i++;
  }

  return course_obj_array;
}

// Filters course listing JSON array by language
// Returns filtered array
async function filterByLanguage(course_obj_array) {
  if (LANGUAGE == "" || LANGUAGE == null) return course_obj_array;

  // Remove courses from array whose language does not match
  var i = 0;
  while (i < course_obj_array.length) {
    if (course_obj_array[i].language != LANGUAGE) course_obj_array.splice(i, 1);
    else i++;
  }

  return course_obj_array;
}

// Filters course listing JSON array by accreditation
// Returns filtered array
async function filterByAccreditation(course_obj_array) {
  if (IS_ACCREDITED == false) return course_obj_array;

  // Remove courses from array which are not "accredited"
  var i = 0;
  while (i < course_obj_array.length) {
    if (course_obj_array[i].is_accredited == false)
      course_obj_array.splice(i, 1);
    else i++;
  }

  return course_obj_array;
}

// Called by search bar or quiz GET route
// Consolidates Udemy and Coursera course listing arrays
// Sends consolidated array to frontend
async function sendToFrontend(req) {
  var udemy_courses = await returnUdemyCourses(JSON.stringify(req));
  var coursera_courses = await returnCourseraCourses(JSON.stringify(req));
  var all_courses;
  if (udemy_courses === undefined) all_courses = coursera_courses;
  else if (coursera_courses === undefined) all_courses = udemy_courses;
  else all_courses = await udemy_courses.concat(coursera_courses);

  return all_courses;
}

/////////////////////
// UDEMY FUNCTIONS //
/////////////////////

// Sends request to the Udemy API
// Calls parseUdemyResponse
// Sends array of course listing JSON's to front end
async function sendUdemyRequest(user_json) {
  if (user_json === undefined) return;

  // Parse user input JSON
  var input_array = JSON.parse(user_json);
  if (input_array === undefined) return;
  var topic = input_array.topic;
  var duration = input_array.duration;
  var difficulty = input_array.difficulty;
  var price = input_array.price;
  var language = input_array.language;

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
  var api_language = "";
  if (language == "en") api_language = "en";
  else if (language == "es") api_language = "es";
  else api_language = ""; // no language specified

  // Send GET request
  // Add additional arguments to path string if needed
  var path_string =
    "/api-2.0/courses/?fields[course]=@all&page_size=" +
    String(NUM_COURSES) +
    "&search=" +
    topic;
  if (api_duration != "") path_string += "&duration=" + api_duration;
  if (api_difficulty != "")
    path_string += "&instructional_level=" + api_difficulty;
  if (api_price != "") path_string += "&price=" + api_price;
  if (api_language != "") path_string += "&language=" + api_language;

  console.log(path_string);
  const options = {
    hostname: "www.udemy.com",
    path: path_string,
    headers: {
      Accept: "application/json, text/plain, */*",
      Authorization: "Basic ",
      "Content-Type": "application/json;charset=utf-8",
    },
  };

  var udemy_results = await sendHTTPGetUdemy(options);

  return { udemy_results, api_duration, api_difficulty };
}

// Sends HTTP get request to an API synchronously
// Returns a promise with the results
function sendHTTPGetUdemy(options) {
  const https = require("https");
  return new Promise((resolve, reject) => {
    https
      .get(options, (resp) => {
        let data = "";
        resp.on("data", (chunk) => {
          data += chunk;
        });
        resp.on("end", () => {
          results = JSON.parse(data).results;
          resolve(results);
        });
      })
      .on("error", (err) => {
        console.log("Error: " + err.message);
        reject(err);
      });
  });
}

// Parses raw output from Udemy API
// Returns course listing JSON array object
async function parseUdemyResponse(results_array, api_duration, difficulty) {
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
      course.num_reviews,
      course.locale.locale,
      course.is_in_any_ufb_content_collection
    );
    // Push to JSON array
    course_obj_array.push(course_obj);
  }

  return course_obj_array;
}

// Synchronous function that takes raw user input (search bar/quiz)
// Does all the data processing necessary
// Sends the Udemy course listings to frontend synchronously
async function returnUdemyCourses(raw_input) {
  // Call data processing functions synchronously
  var parsed_user_input = await getUserInput(raw_input);
  var raw_response = await sendUdemyRequest(parsed_user_input);
  if (raw_response === undefined) {
    console.log("No courses found on Udemy");
    return;
  }
  var parsed_response = await parseUdemyResponse(
    raw_response.udemy_results,
    raw_response.api_duration,
    raw_response.api_difficulty
  );

  var filtered_response = await filterByPrice(parsed_response);
  filtered_response = await filterByAccreditation(filtered_response);
  console.log(filtered_response);
  //console.log(raw_response.udemy_results);

  return filtered_response;
}

////////////////////////
// COURSERA FUNCTIONS //
////////////////////////

// Sends request to the Coursera API
// Calls parseCourseraResponse
// Sends array of course listing JSON's to front end
async function sendCourseraRequest(user_json) {
  if (user_json === undefined) return;

  // Parse user input JSON
  var input_array = JSON.parse(user_json);
  if (input_array === undefined) return;
  var topic = input_array.topic;
  // (can't filter duration)
  var difficulty = input_array.difficulty;
  if (input_array.price != 0 && input_array.price != null) return; // Coursera is "free" ONLY
  // (difficulty passed directly into query)
  // (language filtering done after-the-fact)

  // Add additional arguments to path string if needed
  var path_string =
    "/api/courses.v1?q=search" +
    "&limit=" +
    String(NUM_COURSES) +
    "&query=" +
    topic;
  if (difficulty != null) path_string += "%20" + difficulty;
  path_string +=
    "&includes=workload,description,photoUrl,primaryLanguages,certificates&fields=workload,description,photoUrl,primaryLanguages,certificates";

  console.log(path_string);
  const options = {
    hostname: "api.coursera.org",
    path: path_string,
  };

  var coursera_results = await sendHTTPGetCoursera(options);

  return { coursera_results, difficulty };
}

// Sends HTTP get request to an API synchronously
// Returns a promise with the results
function sendHTTPGetCoursera(options) {
  const https = require("https");
  return new Promise((resolve, reject) => {
    https
      .get(options, (resp) => {
        let data = "";
        resp.on("data", (chunk) => {
          data += chunk;
        });
        resp.on("end", () => {
          results = JSON.parse(data).elements;
          resolve(results);
        });
      })
      .on("error", (err) => {
        console.log("Error: " + err.message);
        reject(err);
      });
  });
}

// Parses raw output from Coursera API
// Returns course listing JSON array object
async function parseCourseraResponse(results_array, difficulty) {
  if (results_array === undefined) return;

  // Create empty array to hold course listing JSON's
  var course_obj_array = [];

  // Parse through results array
  for (var i = 0; i < results_array.length; i++) {
    var course = results_array[i];
    var course_obj = new CourseListing(
      course.name,
      "Coursera",
      course.description,
      course.photoUrl,
      course.slug,
      false,
      0,
      course.workload,
      difficulty,
      null,
      null,
      course.primaryLanguages[0],
      course.certificates[0]
    );
    // Push to JSON array
    course_obj_array.push(course_obj);
  }

  return course_obj_array;
}

// Synchronous function that takes raw user input (search bar/quiz)
// Does all the data processing necessary
// Sends the Udemy course listings to frontend synchronously
async function returnCourseraCourses(raw_input) {
  // Call data processing functions synchronously
  var parsed_user_input = await getUserInput(raw_input);
  var raw_response = await sendCourseraRequest(parsed_user_input);
  if (raw_response === undefined) {
    console.log("No courses found on Coursera");
    return;
  }
  var parsed_response = await parseCourseraResponse(
    raw_response.coursera_results,
    raw_response.difficulty
  );
  var filtered_response = await filterByLanguage(parsed_response);
  filtered_response = await filterByAccreditation(filtered_response);
  console.log(filtered_response);

  // Return to frontend
  //.....

  return filtered_response;
}

/////////////////////////////////
// COMMUNICATION WITH FRONTEND //
/////////////////////////////////

app.get(
  "/results/:question1/:question2/:question3/:question4/:question5/:question6",
  (req, res) => {
    sendToFrontend({
      question1: req.params.question1,
      question2: req.params.question2,
      question3: req.params.question3,
      question4: req.params.question4,
      question5: req.params.question5,
      question6: req.params.question6,
    }).then((courses) => {
      if (courses.length === 0) {
        var none = '["none"]';
        res.send(none);
        console.log("No courses sent to frontend");
      } else {
        res.send(courses);
        console.log("Courses sent to frontend");
      }
    });
  }
);

// Debugging function calls
//returnUdemyCourses('{ "search":"machine_learning" }');
//returnUdemyCourses('{"question1":"python", "question2":"3", "question3":"A Few Days", "question4":"Free", "question5":"item3", "question6":"item1"}');
//returnCourseraCourses('{ "search":"machine learning" }');
//returnCourseraCourses('{"question1":"dogs", "question2":"3", "question3":"Week", "question4":"Free", "question5":"item3", "question6":"item1"}');
//sendToFrontend({ body:{ "search":"python" }});
//sendToFrontend({ body:{ "question1":"python", "question2":1, "question3":"Week", "question4":"Free", "question5":"item2" } });
