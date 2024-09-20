//Variable Declarations
const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const locationButton = document.querySelector(".location-btn");
const currentWeatherDiv = document.querySelector(".current-weather");
const weatherCardsDiv = document.querySelector(".weather-cards");


//API KEY from OpenWeatherMap API
const API_KEY = "6750d26999398b76353af70668a73f81";

//Function to create weather card
const createWeatherCard = (cityName, weatherItem, index) => {  //This function takes three arguments: cityName, weatherItem, and index.
    const date = new Date(weatherItem.dt_txt).toLocaleDateString("en-US", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric" 
    });
    if(index === 0){ //HTML for the main weather card
        return `<div class="details">
                    <h2>${cityName} - (${date})</h2>
                    <h4>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)}°c</h4>
                    <h4>Wind: ${weatherItem.wind.speed} M/S</h4>
                    <h4>Humidity: ${weatherItem.main.humidity}%</h4>
                </div>
                <div class="icon">
                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
                    <h4>${weatherItem.weather[0].description}</h4>
                </div>`;
    } else{ //HTML for the other five day forecast card
        return `<li class="card">
                    <h3>(${date}) - ${weatherItem.weather[0].description}</h3>
                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="weather-icon">
                    <h4>Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)}°c</h4>
                    <h4>Wind: ${weatherItem.wind.speed} M/S</h4>
                    <h4>Humidity: ${weatherItem.main.humidity}%</h4>
                </li>`;
    }
    
}

//getWeatherDetails Function
const getWeatherDetails = (cityName, lat, lon) =>{   //This function takes three arguments: cityName, lat, and lon.
    //It constructs the API URL to fetch weather data based on the provided city name, latitude, and longitude.
    const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    
    //It fetches the data using the Fetch API and parses the response as JSON.
    fetch( WEATHER_API_URL).then(res => res.json()).then(data => {
        //Filter the forecast data to get only one forecast data per day
        const uniqueForecastDays = [];
        const fiveDaysForecast = data.list.filter( forecast => {
            const forecastDate = new Date (forecast.dt_txt).getDate();
            if( !uniqueForecastDays.includes( forecastDate)){
                return uniqueForecastDays.push( forecastDate);
            }
        });
        
        //clearing previous weather data
        cityInput.value ="";
        currentWeatherDiv.innerHTML = "";
        weatherCardsDiv.innerHTML = "";
    
        
        //creating weather cards and adding them to the DOM
        fiveDaysForecast.forEach((weatherItem, index) => {
            if(index === 0){
                currentWeatherDiv.insertAdjacentHTML("beforeend",createWeatherCard(cityName, weatherItem, index));
            }else{
                weatherCardsDiv.insertAdjacentHTML("beforeend",createWeatherCard(cityName, weatherItem, index));
            }
        
            
        });

        

        
    }) .catch(( ) => {  //It includes error handling to display an alert message in case of any issues during data fetching.
            alert("An error occurred while fetching the Weather Forecast!");
        });
}

//getCity Function:This function triggers when the user clicks the search button.
const getCity = () =>{
    //remove extra spaces and user get the entered city name
    const cityName = cityInput.value.trim();
    if(!cityName) return; //return if city name is empty
    //console.log(cityName); 
    const GEOCODING_API_URL=`https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;
    

   // Rest of your code...
    
    //get weather details using latitude and longitude
    fetch(GEOCODING_API_URL).then(res => res.json()).then(data =>{
        if(!data.length) return alert(`No data found for ${cityName}`);
        const{name, lat, lon} = data[0];
        getWeatherDetails(name, lat, lon);
        
        
    }) .catch(( ) => {
            alert("An error occurred while fetching the coordinates!");
    });
    
}

//getUser Function:This function triggers when the user clicks the location button.
const getUser = ( ) => {
    navigator.geolocation.getCurrentPosition(
        position => {
        const {latitude, longitude} = position.coords;
            const REVERSE_GEOCODING_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;

        

            //Get city name from cordinates using reverse geocoding API
            fetch(REVERSE_GEOCODING_URL).then(res => res.json()).then(data =>{
                const{ name } = data[0];
                getWeatherDetails(name, latitude, longitude);
                
            }).catch(( ) => {
                alert("An error occurred while fetching the city!");
            });
            
        },
        error => {
            if(error.code === error.PERMISSION_DENIED) {
                alert(" Geolocation request denied. Please reset your location permission.");
            } 
        }
    );
}


locationButton.addEventListener("click", getUser); // Triggers the getUser function when the location button is clicked.
searchButton.addEventListener("click", getCity);   // Triggers the getCity function when the search button is clicked.
cityInput.addEventListener("keyup", e => e.key === "Enter" && getCity());  //Triggers the getCity function when the user presses the Enter key inside the city input field