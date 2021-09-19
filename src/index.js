
import apiKey from "../config.js"

// GLOBAL VARIABLES
let unitSwitchEl = document.getElementById('unit-switch');
const locationEl = document.getElementById('location');
let search = '';

// async funtion to get the current weather
async function getWeather(input) {
    // declaring variables
    let query = typeOfSearch(input);
    let units = typeOfUnits();
    const location = document.getElementById('location');
    const URL = `https://api.openweathermap.org/data/2.5/weather?${query}&appid=${apiKey()}&${units}`;

    try {
        // fetch data from the api
        const response = await fetch (
            URL, { mode: 'cors'}
        );

        // put the response into a JSON object
        const data = await response.json();

        // process the data from the api
        processWeatherData(data);
        console.log(data);

        // updte the variable search incase we need to do a relaod. 
        search = input;

        // update the location text in the search bar
        location.value = data.name + ', ' + data.sys.country;

    } catch (err) {
        alert(err);
    }
}

// mapping JSON data into an object
function processWeatherData(data) {
    // DOM Element Variables
    const bgImg = document.getElementById('background');
    const weatherIcon = document.getElementById('icon');
    const iconURL = 'http://openweathermap.org/img/wn/';


    // changing the background imagae based upon the weather data
    switch (data.weather[0].main) {
        case 'Thunderstorm':
            bgImg.style.backgroundImage = "url('../img/thunderstorm.jpg')";
            weatherIcon.setAttribute('src', iconURL + '11d@2x.png');
            break;
        case 'Drizzle':
            bgImg.style.backgroundImage = "url('../img/drizzle.jpg')";
            weatherIcon.setAttribute('src', iconURL + '09d@2x.png');
            break;
        case 'Rain':
            bgImg.style.backgroundImage = "url('../img/rain.jpg')";
            weatherIcon.setAttribute('src', iconURL + '10d@2x.png');
            break;
        case 'Snow':
            bgImg.style.backgroundImage = "url('../img/snow.jpg')";
            weatherIcon.setAttribute('src', iconURL + '13d@2x.png');
            break;
        case 'Clear':
            bgImg.style.backgroundImage = "url('../img/clear.jpg');"
            weatherIcon.setAttribute('src', iconURL + '01d@2x.png');
            break;
        case 'Clouds':
            bgImg.style.backgroundImage = "url('../img/cloudy.jpg')";
            weatherIcon.setAttribute('src', iconURL + '04d@2x.png');
            break;
        case 'Mist':
            bgImg.style.backgroundImage = "url('../img/mist.jpg')";
            weatherIcon.setAttribute('src', iconURL + '50d@2x.png');
            break;
        default:
            break;
    }

    // update all of the gauges

    //DOM Elements
    const high = document.getElementById('day-high');
    const low = document.getElementById('day-low');
    const temp = document.getElementById('current-temp');
    const feels = document.getElementById('feels-like');
    const windSpeed = document.getElementById('wind-speed');
    let windDirection = document.getElementById('wind-direction');
    const windGusts = document.getElementById('wind-gust');
    
    high.innerText = parseInt(data.main.temp_max);
    low.innerText = parseInt(data.main.temp_min);
    temp.innerText = parseInt(data.main.temp);
    feels.innerText = 'LIKE ' + parseInt(data.main.feels_like);
    windSpeed.innerText = parseInt(data.wind.speed) + ' MPH';
    windDirection.innerText = getWindDirection(data.wind.deg).toUpperCase();
    windGusts.innerText = 'Gust ' + data.wind.gust;
}

// function to get windDirection
function getWindDirection(deg) {
    if (deg >= 0 && deg <= 22.5) {
       return 'n';
    } else if (deg > 22.5 && deg <= 45){
        return 'nne';
    } else if (deg > 45 && deg <= 67.5){
        return 'ne';
    } else if (deg > 67.5 && deg <= 90){
        return 'e';
    } else if (deg > 90 && deg <= 112.5){
        return 'ese';
    } else if (deg > 112.5 && deg <= 135){
        return 'se';
    } else if (deg > 135 && deg <= 157.5){
        return 'sse';
    } else if (deg > 157.5 && deg <= 180){
        return 's';
    } else if (deg > 180 && deg <= 202.5){
        return 'ssw';
    } else if (deg > 202.5 && deg <= 225){
        return 'sw';
    } else if (deg > 225 && deg <= 247.5){
        return 'wsw';
    } else if (deg > 247.5 && deg <= 270){
        return 'w';
    } else if (deg > 270 && deg <= 292.5){
        return 'wnw';
    } else if (deg > 292.5 && deg <= 315){
        return 'nw';
    } else if (deg > 315 && deg <= 337.5){
        return 'nnw';
    } else if (deg > 337.5 && deg <= 360){
        return 'n';
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

// function to determine the type of units to be displayed
function typeOfUnits() {
    if (unitSwitchEl.value === 'false') {
        return 'units=imperial';
    } else if (unitSwitchEl.value === 'true') {
        return 'units=metric';
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

// function to see if the browswer support geo location
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}
  
// function to get the geo location
async function showPosition(position) {
    // declaring variables
    let lat = String(position.coords.latitude);
    let long = String(position.coords.longitude);
    let units = typeOfUnits();
    const location = document.getElementById('location');
    const URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKey()}&${units}`;

    try {
        // fetching data from the api
        const response = await fetch (
            URL, { mode: 'cors' }
        );

        // pushing JSON reponse data into an object
        const data = await response.json();

        // processing the weather data
        processWeatherData(data);
        
        // updating search global variable incase we need to relaod
        search = data.name + ", " + data.sys.country;

        // update the location text in the search bar
        location.value = data.name + ', ' + data.sys.country;


    } catch (err) {
        alert(err);
    }
}

// function to detrermine the users desire weather units
unitSwitchEl.addEventListener('click', (e) => {
    if(e.target.value === 'false') {
       unitSwitchEl.value = 'true';
       getWeather(search);

   } else if (e.target.value === 'true') {
       unitSwitchEl.value = false;
       getWeather(search);
   }
});

// function to get user input 
locationEl.addEventListener('keypress', (e) => {
    if (e.key == 'Enter') {
        getWeather(e.target.value);
    }
});

document.getElementById('geolocate').addEventListener('click', () => {
    getLocation();
});





