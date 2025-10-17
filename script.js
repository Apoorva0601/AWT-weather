const API_KEY = '0b4db5981631c80d1585d845c63d05f0';
const API_BASE_URL = 'https://api.openweathermap.org/data/2.5';

const STORAGE_KEY = 'lastSearchedCity';

const $cityInput = $('#cityInput');
const $searchBtn = $('#searchBtn');
const $loadingSpinner = $('#loadingSpinner');
const $errorMessage = $('#errorMessage');
const $errorText = $('#errorText');
const $currentWeather = $('#currentWeather');
const $forecastSection = $('#forecastSection');

const $cityName = $('#cityName');
const $country = $('#country');
const $currentDate = $('#currentDate');
const $temperature = $('#temperature');
const $weatherDesc = $('#weatherDesc');
const $weatherIcon = $('#weatherIcon');
const $humidity = $('#humidity');
const $windSpeed = $('#windSpeed');
const $pressure = $('#pressure');
const $visibility = $('#visibility');

const $forecastCards = $('#forecastCards');

$(document).ready(function() {
    $searchBtn.on('click', handleSearch);
    
    $cityInput.on('keypress', function(e) {
        if (e.which === 13) {
            handleSearch();
        }
    });
    
    loadLastSearchedCity();
});

function handleSearch() {
    const cityName = $cityInput.val().trim();
    
    if (cityName === '') {
        showError('Please enter a city name');
        return;
    }
    
    fetchWeatherData(cityName);
}

function fetchWeatherData(city) {
    showLoading();
    
    const currentWeatherURL = `${API_BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`;
    
    $.ajax({
        url: currentWeatherURL,
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            displayCurrentWeather(data);
            
            fetchForecastData(city);
            
            saveLastSearchedCity(city);
            
            hideLoading();
        },
        error: function(xhr) {
            hideLoading();
            
            if (xhr.status === 404) {
                showError('City not found. Please check the spelling and try again.');
            } else if (xhr.status === 401) {
                showError('Invalid API key. Please check your OpenWeatherMap API key.');
            } else {
                showError('Failed to fetch weather data. Please try again later.');
            }
        }
    });
}

function fetchForecastData(city) {
    const forecastURL = `${API_BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`;
    
    $.ajax({
        url: forecastURL,
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            displayForecast(data);
        },
        error: function() {
            console.error('Failed to fetch forecast data');
        }
    });
}

function displayCurrentWeather(data) {
    const cityName = data.name;
    const country = data.sys.country;
    const temp = Math.round(data.main.temp);
    const description = data.weather[0].description;
    const iconCode = data.weather[0].icon;
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;
    const pressure = data.main.pressure;
    const visibility = (data.visibility / 1000).toFixed(1);
    const weatherMain = data.weather[0].main.toLowerCase();
    
    $cityName.text(cityName);
    $country.text(country);
    $currentDate.text(getCurrentDate());
    $temperature.text(`${temp}°C`);
    $weatherDesc.text(description);
    $weatherIcon.attr('src', `https://openweathermap.org/img/wn/${iconCode}@2x.png`);
    $weatherIcon.attr('alt', description);
    $humidity.text(`${humidity}%`);
    $windSpeed.text(`${windSpeed} m/s`);
    $pressure.text(`${pressure} hPa`);
    $visibility.text(`${visibility} km`);
    
    changeBackground(weatherMain);
    
    $currentWeather.removeClass('d-none').hide().fadeIn(500);
    $errorMessage.addClass('d-none');
}

function displayForecast(data) {
    $forecastCards.empty();
    
    const dailyForecasts = getDailyForecasts(data.list);
    
    dailyForecasts.forEach((forecast, index) => {
        const date = new Date(forecast.dt * 1000);
        const dayName = getDayName(date);
        const dateStr = formatDate(date);
        const temp = Math.round(forecast.main.temp);
        const description = forecast.weather[0].description;
        const iconCode = forecast.weather[0].icon;
        
        const cardHTML = `
            <div class="col">
                <div class="card forecast-card shadow h-100">
                    <div class="card-body text-center p-3">
                        <h5 class="forecast-day mb-1">${dayName}</h5>
                        <p class="forecast-date mb-3">${dateStr}</p>
                        <img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" 
                             alt="${description}" 
                             class="forecast-icon mb-2">
                        <p class="forecast-temp mb-2">${temp}°C</p>
                        <p class="forecast-desc mb-0">${description}</p>
                    </div>
                </div>
            </div>
        `;
        
        $forecastCards.append(cardHTML);
    });
    
    $forecastSection.removeClass('d-none').hide().fadeIn(500);
}

function getDailyForecasts(forecastList) {
    const dailyForecasts = [];
    const processedDates = new Set();
    
    forecastList.forEach(forecast => {
        const date = new Date(forecast.dt * 1000);
        const dateString = date.toDateString();
        const hours = date.getHours();
        
        if (hours >= 11 && hours <= 14 && !processedDates.has(dateString)) {
            dailyForecasts.push(forecast);
            processedDates.add(dateString);
        }
    });
    
    return dailyForecasts.slice(0, 5);
}

function changeBackground(weatherCondition) {
    $('body').removeClass('clear clouds rain drizzle thunderstorm snow mist fog haze sunny');
    
    switch(weatherCondition) {
        case 'clear':
            $('body').addClass('sunny');
            break;
        case 'clouds':
            $('body').addClass('clouds');
            break;
        case 'rain':
            $('body').addClass('rain');
            break;
        case 'drizzle':
            $('body').addClass('drizzle');
            break;
        case 'thunderstorm':
            $('body').addClass('thunderstorm');
            break;
        case 'snow':
            $('body').addClass('snow');
            break;
        case 'mist':
        case 'fog':
        case 'haze':
            $('body').addClass('mist');
            break;
        default:
            break;
    }
}

function showLoading() {
    $loadingSpinner.removeClass('d-none');
    $currentWeather.addClass('d-none');
    $forecastSection.addClass('d-none');
    $errorMessage.addClass('d-none');
}

function hideLoading() {
    $loadingSpinner.addClass('d-none');
}

function showError(message) {
    $errorText.text(message);
    $errorMessage.removeClass('d-none').hide().fadeIn(300);
    $currentWeather.addClass('d-none');
    $forecastSection.addClass('d-none');
}

function saveLastSearchedCity(city) {
    try {
        localStorage.setItem(STORAGE_KEY, city);
    } catch (error) {
        console.error('Failed to save to localStorage:', error);
    }
}

function loadLastSearchedCity() {
    try {
        const lastCity = localStorage.getItem(STORAGE_KEY);
        
        if (lastCity) {
            $cityInput.val(lastCity);
            fetchWeatherData(lastCity);
        }
    } catch (error) {
        console.error('Failed to load from localStorage:', error);
    }
}

function getCurrentDate() {
    const date = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
}

function getDayName(date) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
}

function formatDate(date) {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}/${day}`;
}
