document.addEventListener("DOMContentLoaded", () => {
    const urlWeather = `https://api.openweathermap.org/data/2.5/weather?lat=${myLat}&lon=${myLon}&appid=${myKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${myLat}&lon=${myLon}&appid=${myKey}`;
  
    async function apiFetch() {
        try {
            const response = await fetch(urlWeather);
            if (response.ok) {
                const data = await response.json();
                displayResults(data);
            } else {
                throw new Error(await response.text());
            }
        } catch (error) {
            console.error(error);
        }
    }
  
    const displayResults = (data) => {
        const eventMainBox = document.querySelector("#weather-main");
        eventMainBox.innerHTML = "";
  
        const iconsrc = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
        let desc = data.weather[0].description;
  
        eventMainBox.innerHTML = `
                <div class="current-weather">
                    <h2>The current Weather in: <span id="city-name">${data.name}</span></h2>
                    <p>Temperature: <span id="current-temp">${parseFloat(data.main.temp).toFixed(0)}&deg;F</span></p>
                    <figure>
                        <img id="weather-icon" src="${iconsrc}" alt="${desc}">
                        <figcaption>${desc}</figcaption>
                    </figure>
                </div>
            `;
    };
  
    async function apiForecastFetch() {
        try {
            const response = await fetch(forecastUrl);
            if (response.ok) {
                const forecastData = await response.json();
                displayResultsForecast(forecastData);
            } else {
                throw new Error(await response.text());
            }
        } catch (error) {
            console.log(error);
        }
    }
  
    const displayResultsForecast = (forecastData) => {
        const weatherForecast = document.querySelector("#weather-forecast");
        weatherForecast.innerHTML = "";
  
        const forecast = document.createElement("article");
        forecast.className = "forecast";
        forecast.innerHTML = `<h3>3-Days Weather Forecast</h3>`;
        weatherForecast.appendChild(forecast);
  
        const dailyForecasts = forecastData.list.slice(0, 3);
        dailyForecasts.forEach((dailyData, index) => {
            const iconsrc = `https://openweathermap.org/img/wn/${dailyData.weather[0].icon}@2x.png`;
            const forecastHTML = `
                <div class="day-box">
                    <h4>${new Date(dailyData.dt * 1000).toLocaleDateString()}</h4>
                    <figure>
                        <img src="${iconsrc}" alt="">
                        <figcaption>${dailyData.weather[0].description}</figcaption>
                    </figure>
                    <p>Temperature: <span>${parseFloat(dailyData.main.temp).toFixed(0)}°F</span></p>
                </div>
            `;
            forecast.insertAdjacentHTML("beforeend", forecastHTML);
        });
    };
  
    apiFetch();
    apiForecastFetch();
  });