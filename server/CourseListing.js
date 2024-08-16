var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

// Class for a course listing
class CourseListing {
    // If any attribute is null, the information was not available.
    // Basic info
    name = "";              // course name
    website = "";           // website name
    description = "";       // course description
    url = "";               // website url
    image = "";             // course image url
    // Price info
    is_paid = false;        // false = free, true = paid
    price = 0.0;            // course price, USD
    // Duration info
    duration_hours = 0;     // course duration, will be an approximation in hours
    duration_info = "";     // verbal description of course duration
    // Difficulty info
    difficulty = "";        // course difficulty (Beginner/Intermediate/Advanced)
    // Extra stats
    star_rating = 0;        // average star rating (1-5)
    num_ratings = 0;        // number of submitted ratings
    language = "";          // course's language
    is_accredited = false;

    constructor(name, website, description, image, url, is_paid, price, duration, difficulty, avg_rating, num_ratings, language, is_accredited) {
        // Automatically set name, website, and price
        this.name = name;
        this.website = website;
        this.description = description;
        this.image = image;
        this.is_paid = is_paid;
        this.star_rating = avg_rating;
        this.num_ratings = num_ratings;
        // These attributes need to be set differently
        this.setURL(url);
        this.setPrice(price);
        this.setDuration(duration);
        this.setDifficulty(difficulty);
        this.setLanguage(language);
        this.setAccredited(is_accredited);
    }

    // Set URL attribute
    setURL(url) {
        // Udemy
        if (this.website == "Udemy") {
            // Udemy url formatted as '/course/title'
            this.url = "https://www.udemy.com" + url;
        }
        else if (this.website == "Coursera") {
            // Coursera url has to be guessed bruh
            var test_url = "https://www.coursera.org/learn/" + url;
            var http = new XMLHttpRequest();
            http.open('HEAD', test_url, false);
            http.send();
            if (http.status!=404)
                this.url = test_url;
            else
                this.url = "https://www.coursera.org/projects/" + url;
        }
        return;
    }

    // Set price attribute
    setPrice(price) {
        // price is assumed to be formatted as $XX.XX
        if (this.website == "Udemy") {
            if (this.is_paid == false)
                this.price = 0.0;
            else
                this.price = parseFloat(price.substring(1));
        }
        else if (this.website == "Coursera") {
            this.price = price;
        }
        return;
    }

    // Set duration and duration_rating attributes
    setDuration(api_duration) {
        // Udemy
        if (this.website == "Udemy") {
            // Udemy duration classifications
            if (api_duration == "extraShort") {
                this.duration_hours = 1;
                this.duration_info = "0-1 hours";
            }
            else if (api_duration == "short") {
                this.duration_hours = 3;
                this.duration_info = "1-3 hours";
            }
            else if (api_duration == "medium") {
                this.duration_hours = 6;
                this.duration_info = "3-6 hours";
            }
            else if (api_duration == "long") {
                this.duration_hours = 17;
                this.duration_info = "6-17 hours";
            }
            else if (api_duration == "extraLong") {
                this.duration_hours = 24;
                this.duration_info = "17+ hours";
            }
            else {
                this.duration_hours = null;
                this.duration_info = null;
            }
        }
        else if (this.website == "Coursera") {
            this.duration_info = api_duration;
            this.duration_hours = null;
        }
        return;
    }

    // Set difficulty attribute
    setDifficulty(difficulty) {
        // Udemy
        if (this.website == "Udemy") {
            // Udemy uses "expert" instead of "advanced"
            if (difficulty == "beginner")
                this.difficulty = "Beginner";
            else if (difficulty == "intermediate")
                this.difficulty = "Intermediate";
            else if (difficulty == "expert")
                this.difficulty = "Advanced";
            else
                this.difficulty = null;
        }
        else if (this.website == "Coursera") {
            if (difficulty == "beginner")
                this.difficulty = "Beginner";
            else if (difficulty == "intermediate")
                this.difficulty = "Intermediate";
            else if (difficulty == "advanced")
                this.difficulty = "Advanced";
            else
                this.difficulty = null;
        }
        return;
    }

    setLanguage(language) {
        if (this.website == "Udemy")
            this.language = language.substring(0, 2); // "en_US" -> "en"
        else if (this.website == "Coursera")
            this.language = language;
        return;
    }

    setAccredited(is_accredited) {
        if (this.website == "Udemy")
            this.is_accredited = is_accredited;
        else if (this.website == "Coursera")
            if (is_accredited == "VerifiedCert")
                this.is_accredited = true;
        return;
    }

    // Print JSON of this course listing class
    print() {
        console.log(JSON.stringify(this));
    }

    // Return JSON of this course listing class
    getJSON() {
        return JSON.stringify(this);
    }
}

module.exports = CourseListing;