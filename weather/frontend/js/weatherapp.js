const cityName = document.getElementById('cityName');
const weatherImageElement = document.getElementById('weatherImage');
const timezone = document.getElementById('timezone');
const date = document.getElementById('date');
const ContryRelated = document.getElementById('ContryRelated');
const speedElem = document.getElementById('speed');
const countryElem = document.getElementById('country');
const cityInput = document.getElementById('cityInput');
const weatherIconElem = document.getElementById('weatherIcon');
const descriptionElem = document.getElementById('description');
const temperatureElem = document.getElementById('temperature');
const errorElem = document.getElementById('error');
var weatherImages = [];


cityInput.addEventListener('keyup', function (event) {
    if (event.key === 'Enter') {
        getWeather();
    }
});

async function fetchWeatherImages() {
    const imageUrl = 'http://localhost/OPENSOOQ/weather/frontend/js/image.json';

    try {
        const response = await fetch(imageUrl);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        weatherImages = await response.json();
        return weatherImages;
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

fetchWeatherImages();




function getWeather(cityInputValue) {

    const cityInput = cityInputValue || document.getElementById('cityInput').value;


    errorElem.innerText = '';

    if (cityInput.trim() === '') {
        cityName.innerHTML = '';
        speedElem.innerText = '';
        weatherImageElement.src = '';
        temperatureElem.innerHTML = '';
        descriptionElem.innerHTML = '';
        countryElem.innerHTML = '';
        weatherIconElem.src = '';

        errorElem.innerText = 'Please Enter The Name Of Your City.';
        return;
    }

    fetchWeather(cityInput)

        .then(data => {
            cityName.innerHTML = `<i class="fa-solid fa-location-crosshairs"></i> ${data.name} `
            temperatureElem.innerHTML = `<i class="fa-solid fa-temperature-high"></i> ${data.main.temp} °C`;
            speedElem.innerHTML = ` <i class="fas fa-wind"></i>   ${data.wind.speed} m/s`;
            descriptionElem.innerHTML = `<i class="fa-solid fa-circle-info"></i> ${data.weather[0].description}`;
            weatherIconElem.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
            weatherImageElement.src = weatherImages[data.weather[0].description];
            countryElem.innerHTML = `<i class="fa-solid fa-flag"></i>   ${data.sys.country}`;



            const { time, today } = KnowIfPMoAM(data.timezone);

            timezone.innerHTML = time;
            date.innerHTML = today;

            getRandomCityBasedOnCountry(data.sys.country);
        })
        .catch(error => {
            cityName.innerHTML = '';
            speedElem.innerText = '';
            weatherImageElement.src = '';
            temperatureElem.innerHTML = '';
            descriptionElem.innerHTML = '';
            countryElem.innerHTML = '';
            weatherIconElem.src = '';

            errorElem.innerText = 'City not found. Please enter a valid city name.';
        });
}


async function fetchWeather(city) {
    try {
        const response = await fetch(`http://localhost/OPENSOOQ/weather/backend/weather.php?city=${city}`);
        const data = await response.json();



        ContryRelated.innerHTML = ''
        ContryRelated.style.transition = 'transform 0.8s ease-in-out';
        ContryRelated.style.transform = 'translateX(-45px) translateY(6px)';
        return data;

    } catch (error) {
        // Display the error message and error image
        console.error('Fetch error:', error);
        displayErrorMessage("City not found. Please enter a valid city name.");
    }
}



function getUserLocation() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => resolve(position.coords),
                error => reject(error)
            );
        } else {
            reject('Geolocation is not supported by this browser.');
        }
    });
}

async function fetchWeatherByCoordinates(latitude, longitude) {
    console.log('latitude', latitude);
    try {
        const response = await fetch(`http://localhost/OPENSOOQ/weather/backend/weather.php?lat=${latitude}&lon=${longitude}`);
        const data = await response.json();

        return data;

    } catch (error) {
        throw new Error('Failed to fetch weather data.');
    }
}

function updateUI(data) {

    errorElem.innerText = '';


    cityName.innerHTML = `<i class="fa-solid fa-location-crosshairs"></i> ${data.name} `
    temperatureElem.innerHTML = `<i class="fa-solid fa-temperature-high"></i> ${data.main.temp} °C`;
    speedElem.innerHTML = ` <i class="fas fa-wind"></i>   ${data.wind.speed} m/s`;
    descriptionElem.innerHTML = `<i class="fa-solid fa-circle-info"></i> ${data.weather[0].description}`;
    weatherIconElem.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
    countryElem.innerHTML = `<i class="fa-solid fa-flag"></i>  ${data.sys.country} `;

    weatherImageElement.src = weatherImages[data.weather[0].description];


    const { time, today } = KnowIfPMoAM(data.timezone);

    timezone.innerHTML = time;
    date.innerHTML = today;

    getRandomCityBasedOnCountry(data.sys.country);


}



function handleErrors(error) {
    const errorElem = document.getElementById('error');
    errorElem.innerText = error.message || 'An error occurred.';
}

async function getUserTimeZoneAndFetchWeather() {
    console.log('getUserTimeZoneAndFetchWeather');
    try {
        const userLocation = await getUserLocation();
        const { latitude, longitude } = userLocation;

        const weatherData = await fetchWeatherByCoordinates(latitude, longitude);

        updateUI(weatherData);
    } catch (error) {
        handleErrors(error);
    }


}

getUserTimeZoneAndFetchWeather();





function KnowIfPMoAM(timezone) {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const currentDate = new Date();
    const updatedTime = new Date(currentDate.getTime() - (timezone / 3600) * 60 * 60 * 1000 + timezone * 1000);

    const hours12 = updatedTime.getHours() % 12 || 12;
    const minutes = updatedTime.getMinutes();
    const period = updatedTime.getHours() < 12 ? 'AM' : 'PM';
    const time = hours12 + ':' + (minutes < 10 ? '0' : '') + minutes + ' ' + period;
    const year = updatedTime.getFullYear();
    const month = updatedTime.getMonth() + 1;
    const day = updatedTime.getDate();
    const dayOfWeek = daysOfWeek[updatedTime.getDay()];
    const today = `${dayOfWeek}, ${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`;
    return { time, today };
}

(async () => {
    try {
        const userLocation = await getUserLocation();
        const { latitude, longitude } = userLocation;

        const weatherData = await fetchWeatherByCoordinates(latitude, longitude);

        updateUI(weatherData);

        setInterval(async () => {
            const { time, today } = KnowIfPMoAM(weatherData.timezone);
            timezone.innerHTML = time;
            date.innerHTML = today;
        }, 20000);
    } catch (error) {
        handleErrors(error);
    }
})();




async function getRandomCityBasedOnCountry(countrycode) {
    try {
        const response = await fetch('https://countriesnow.space/api/v0.1/countries/iso');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const citys = data.data.find(country => country.Iso2 === countrycode);
        getRandomCityBasedOnCountryfffffff(citys.name);
    } catch (error) {
        console.error('Fetch error:', error);
        displayErrorMessage("There is no information available about the weather of nearby cities. Please try again later.");
    }
}

async function getRandomCityBasedOnCountryfffffff(country) {
    const apiUrl = 'https://countriesnow.space/api/v0.1/countries/cities';

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ country }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        let element = '';

        for (let i = 0; i < 6; i++) {
            const cityData = await fetchWeather(data.data[i]);
            console.log('cityData', cityData);

            element += `
                        <div class="card">
                            <b>${cityData.name}</b>
                            <p>${cityData.main.temp} °C</p>
                            <p>${cityData.weather[0].description}</p>
                            <img src='${weatherImages[cityData.weather[0].description]}'>
                        </div>
                    `;
        }

        ContryRelated.innerHTML = element;
        ContryRelated.style.transition = 'transform 0.8s ease-in-out';
        ContryRelated.style.transform = 'translateX(-45px) translateY(6px)';
    } catch (error) {
        console.error('Fetch error:', error);
        displayErrorMessage("There is no information available about the weather of nearby cities. Please try again later.");
    }
}

function displayErrorMessage(message) {
    ContryRelated.innerHTML = `<p class="error-message">${message}</p>`;

}
