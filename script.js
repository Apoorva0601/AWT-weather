/**
 * Weather Web App - Main JavaScript File
 * 
 * This application fetches real-time weather data from OpenWeatherMap API
 * and displays current weather and 5-day forecast for any city.
 * 
 * Features:
 * - Search weather by city name
 * - Display current weather with details
 * - Show 5-day forecast
 * - Save last searched city in localStorage
 * - Dynamic background based on weather conditions
 * - Loading states and error handling
 * - Fully responsive design
 */

// ========================================
// CONFIGURATION
// ========================================

/**
 * API Configuration
 * IMPORTANT: Replace 'YOUR_API_KEY_HERE' with your actual OpenWeatherMap API key
 * Get free API key from: https://openweathermap.org/api
 */
const API_KEY = '0b4db5981631c80d1585d845c63d05f0';  // Replace with your API key
const API_BASE_URL = 'https://api.openweathermap.org/data/2.5';

// LocalStorage key for saving last searched city
const STORAGE_KEY = 'lastSearchedCity';

// ========================================
// DOM ELEMENTS
// ========================================

// Cache jQuery selectors for better performance
const $cityInput = $('#cityInput');
const $searchBtn = $('#searchBtn');
const $loadingSpinner = $('#loadingSpinner');
const $errorMessage = $('#errorMessage');
const $errorText = $('#errorText');
const $currentWeather = $('#currentWeather');
const $forecastSection = $('#forecastSection');

// Current Weather Elements
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

// Forecast Elements
const $forecastCards = $('#forecastCards');

// ========================================
// EVENT LISTENERS
// ========================================

/**
 * Initialize event listeners when document is ready
 */
$(document).ready(function() {
    // Search button click event
    $searchBtn.on('click', handleSearch);
    
    // Enter key press in input field
    $cityInput.on('keypress', function(e) {
        if (e.which === 13) { // Enter key code
            handleSearch();
        }
    });
    
    // Load last searched city from localStorage on page load
    loadLastSearchedCity();
});

// ========================================
// MAIN FUNCTIONS
// ========================================

/**
 * Handle search button click or Enter key press
 * Validates input and initiates weather data fetch
 */
function handleSearch() {
    const cityName = $cityInput.val().trim();
    
    // Validate input
    if (cityName === '') {
        showError('Please enter a city name');
        return;
    }
    
    // Fetch weather data
    fetchWeatherData(cityName);
}

/**
 * Fetch current weather data from OpenWeatherMap API
 * @param {string} city - City name to search for
 */
function fetchWeatherData(city) {
    // Show loading state
    showLoading();
    
    // API endpoint for current weather
    const currentWeatherURL = `${API_BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`;
    
    // Make AJAX request using jQuery
    $.ajax({
        url: currentWeatherURL,
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            // Display current weather
            displayCurrentWeather(data);
            
            // Fetch 5-day forecast
            fetchForecastData(city);
            
            // Save city to localStorage
            saveLastSearchedCity(city);
            
            // Hide loading
            hideLoading();
        },
        error: function(xhr) {
            hideLoading();
            
            // Handle different error codes
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

/**
 * Fetch 5-day weather forecast from OpenWeatherMap API
 * @param {string} city - City name to search for
 */
function fetchForecastData(city) {
    // API endpoint for 5-day forecast (data every 3 hours)
    const forecastURL = `${API_BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`;
    
    // Make AJAX request
    $.ajax({
        url: forecastURL,
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            displayForecast(data);
        },
        error: function() {
            console.error('Failed to fetch forecast data');
            // Don't show error to user as current weather is still displayed
        }
    });
}

/**
 * Display current weather information
 * @param {Object} data - Weather data from API
 */
function displayCurrentWeather(data) {
    // Extract data from API response
    const cityName = data.name;
    const country = data.sys.country;
    const temp = Math.round(data.main.temp);
    const description = data.weather[0].description;
    const iconCode = data.weather[0].icon;
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;
    const pressure = data.main.pressure;
    const visibility = (data.visibility / 1000).toFixed(1); // Convert to km
    const weatherMain = data.weather[0].main.toLowerCase();
    
    // Update DOM elements
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
    
    // Change background based on weather condition
    changeBackground(weatherMain);
    
    // Show weather section with animation
    $currentWeather.removeClass('d-none').hide().fadeIn(500);
    $errorMessage.addClass('d-none');
}

/**
 * Display 5-day weather forecast
 * @param {Object} data - Forecast data from API
 */
function displayForecast(data) {
    // Clear existing forecast cards
    $forecastCards.empty();
    
    // Get one forecast per day (API provides data every 3 hours)
    // We'll take the forecast at 12:00 PM for each day
    const dailyForecasts = getDailyForecasts(data.list);
    
    // Create forecast cards
    dailyForecasts.forEach((forecast, index) => {
        const date = new Date(forecast.dt * 1000);
        const dayName = getDayName(date);
        const dateStr = formatDate(date);
        const temp = Math.round(forecast.main.temp);
        const description = forecast.weather[0].description;
        const iconCode = forecast.weather[0].icon;
        
        // Create card HTML
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
    
    // Show forecast section with animation
    $forecastSection.removeClass('d-none').hide().fadeIn(500);
}

/**
 * Filter forecast data to get one forecast per day
 * @param {Array} forecastList - List of all forecast data points
 * @returns {Array} - Array of daily forecasts
 */
function getDailyForecasts(forecastList) {
    const dailyForecasts = [];
    const processedDates = new Set();
    
    // Loop through forecast list and get one per day
    forecastList.forEach(forecast => {
        const date = new Date(forecast.dt * 1000);
        const dateString = date.toDateString();
        const hours = date.getHours();
        
        // Get forecast around noon (12:00) and ensure unique dates
        if (hours >= 11 && hours <= 14 && !processedDates.has(dateString)) {
            dailyForecasts.push(forecast);
            processedDates.add(dateString);
        }
    });
    
    // Return maximum 5 days
    return dailyForecasts.slice(0, 5);
}

/**
 * Change background gradient based on weather condition
 * @param {string} weatherCondition - Main weather condition (e.g., 'clear', 'rain')
 */
function changeBackground(weatherCondition) {
    // Remove all weather classes
    $('body').removeClass('clear clouds rain drizzle thunderstorm snow mist fog haze sunny');
    
    // Add appropriate class based on weather
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
            // Keep default gradient
            break;
    }
}

// ========================================
// UI STATE FUNCTIONS
// ========================================

/**
 * Show loading spinner and hide other elements
 */
function showLoading() {
    $loadingSpinner.removeClass('d-none');
    $currentWeather.addClass('d-none');
    $forecastSection.addClass('d-none');
    $errorMessage.addClass('d-none');
}

/**
 * Hide loading spinner
 */
function hideLoading() {
    $loadingSpinner.addClass('d-none');
}

/**
 * Show error message
 * @param {string} message - Error message to display
 */
function showError(message) {
    $errorText.text(message);
    $errorMessage.removeClass('d-none').hide().fadeIn(300);
    $currentWeather.addClass('d-none');
    $forecastSection.addClass('d-none');
}

// ========================================
// LOCAL STORAGE FUNCTIONS
// ========================================

/**
 * Save city name to localStorage
 * @param {string} city - City name to save
 */
function saveLastSearchedCity(city) {
    try {
        localStorage.setItem(STORAGE_KEY, city);
    } catch (error) {
        console.error('Failed to save to localStorage:', error);
    }
}

/**
 * Load last searched city from localStorage and fetch its weather
 */
function loadLastSearchedCity() {
    try {
        const lastCity = localStorage.getItem(STORAGE_KEY);
        
        if (lastCity) {
            // Set input value and fetch weather
            $cityInput.val(lastCity);
            fetchWeatherData(lastCity);
        }
    } catch (error) {
        console.error('Failed to load from localStorage:', error);
    }
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Get current date formatted as string
 * @returns {string} - Formatted date string
 */
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

/**
 * Get day name from date
 * @param {Date} date - Date object
 * @returns {string} - Day name
 */
function getDayName(date) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
}

/**
 * Format date as MM/DD
 * @param {Date} date - Date object
 * @returns {string} - Formatted date
 */
function formatDate(date) {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}/${day}`;
}
