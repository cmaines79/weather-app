
import apiKey from "./config.js"

// async funtion to get the current weather
async function getWeather(input) {
    let query = typeOfSearch(input);

    const URL = `https://api.openweathermap.org/data/2.5/weather?${query}&appid=${apiKey()}`;
    console.log(URL);

    try {
        const response = await fetch (
            URL, { mode: 'cors'}
        );
    
        const data = await response.json();
        console.log(data);
        // CALL A FUNCTION TO DO SOMETHING WITH THE DATA
    } catch (err) {
        alert(err);
    }
    
}

// function to determine the type of search input by the user
function typeOfSearch(input) {
    if (isNaN(input) && containsNumber(input)) {
        // If it is the name of a city
        return input;
    } else if (isANumber(input) && input.length <= 5) {
        // If it is a zip code
        return `zip=${input},us`;
    } else {
        // generic search
        return `q=${input}`;
    }
}

// data validation functions
function isANumber(input) {
    // returns true if input is a full number
    return !/\D/.test(input);
  }

function containsNumber(input) {
    // returns false if input does not contain a number
    return /\d/.test(input);
}

getWeather('59714');   