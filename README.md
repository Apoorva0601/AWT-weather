# Weather Web App 🌤️
A beautiful, responsive weather application built with HTML, CSS, JavaScript, jQuery, and Bootstrap 5. Get real-time weather information and 5-day forecasts for any city in the world.

## Features ✨
- **Real-time Weather Data**: Fetch current weather information from OpenWeatherMap API
- **5-Day Forecast**: View detailed weather predictions for the next 5 days
- **Responsive Design**: Fully responsive layout that works on desktop, tablet, and mobile devices
- **Dynamic Backgrounds**: Background gradient changes based on current weather conditions
- **Local Storage**: Automatically saves and loads your last searched city
- **Loading States**: Smooth loading animations while fetching data
- **Error Handling**: Comprehensive error messages for invalid cities or API issues
- **Weather Details**: Display temperature, humidity, wind speed, pressure, and visibility
- **Beautiful UI**: Modern card-based design with smooth animations

## Technologies Used 🛠️

- **HTML5**: Semantic markup
- **CSS3**: Custom styles with animations and gradients
- **JavaScript (ES6)**: Core functionality
- **jQuery 3.6**: DOM manipulation and AJAX requests
- **Bootstrap 5**: Responsive grid system and components
- **Font Awesome**: Weather and UI icons
- **OpenWeatherMap API**: Weather data provider

## Setup Instructions 📋

### 1. Get API Key

1. Visit [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Navigate to API keys section
4. Generate a new API key (free tier allows 1,000 calls/day)

### 2. Configure the App

1. Open `script.js`
2. Find line 22: `const API_KEY = 'YOUR_API_KEY_HERE';`
3. Replace `'YOUR_API_KEY_HERE'` with your actual API key:
   ```javascript
   const API_KEY = 'your_actual_api_key_here';
   ```

### 3. Run the Application

#### Option 1: Simple File Opening
- Open `index.html` in your web browser

#### Option 2: Using Live Server (Recommended)
1. Install Live Server extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

#### Option 3: Using Python HTTP Server
```bash
# Python 3
python -m http.server 8000

# Then open http://localhost:8000 in your browser
```

#### Option 4: Using Node.js HTTP Server
```bash
# Install http-server globally
npm install -g http-server

# Run server
http-server

# Open the provided URL in your browser
```

## File Structure 📁

```
weather-app/
├── index.html          # Main HTML file
├── styles.css          # Custom CSS styles
├── script.js           # JavaScript functionality
└── README.md           # This file
```

## How to Use 🎯

1. **Search for a City**
   - Enter a city name in the search bar
   - Click the "Search" button or press Enter
   - Wait for the weather data to load

2. **View Current Weather**
   - See current temperature, weather description, and icon
   - View detailed metrics: humidity, wind speed, pressure, visibility

3. **Check 5-Day Forecast**
   - Scroll down to see the 5-day weather forecast
   - Each card shows the day, date, temperature, and conditions

4. **Automatic Loading**
   - The app remembers your last searched city
   - Weather data automatically loads when you return to the page

## Weather Background Themes 🎨

The app dynamically changes the background gradient based on weather conditions:

- **Sunny/Clear**: Purple gradient
- **Clouds**: Gray gradient
- **Rain**: Blue-gray gradient
- **Thunderstorm**: Dark gradient
- **Snow**: Light gray gradient
- **Mist/Fog**: Cool gray gradient

## API Information 📡

### Current Weather API
```
GET https://api.openweathermap.org/data/2.5/weather
```

Parameters:
- `q`: City name
- `appid`: Your API key
- `units`: metric (for Celsius)

### 5-Day Forecast API
```
GET https://api.openweathermap.org/data/2.5/forecast
```

Parameters:
- `q`: City name
- `appid`: Your API key
- `units`: metric (for Celsius)

## Browser Compatibility 🌐

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Opera (latest)

## Responsive Breakpoints 📱

- **Mobile**: < 576px
- **Tablet**: 576px - 768px
- **Desktop**: > 768px

## Features Explained 🔍

### 1. LocalStorage Integration
The app uses browser's localStorage to remember your last searched city:
- Saves city name after successful search
- Automatically loads weather on page reload
- No login required

### 2. Loading States
- Displays spinner while fetching data
- Prevents multiple simultaneous requests
- Provides visual feedback

### 3. Error Handling
- Invalid city name detection
- API key validation
- Network error handling
- User-friendly error messages

### 4. Dynamic UI
- Animated weather icon
- Smooth fade-in effects
- Hover effects on cards
- Responsive layout adjustments

## Customization Options ⚙️

### Change Temperature Unit
In `script.js`, modify the API URL parameter:
- Celsius: `units=metric`
- Fahrenheit: `units=imperial`
- Kelvin: Remove units parameter

### Modify Colors
Edit CSS variables in `styles.css`:
```css
:root {
    --sunny-gradient: linear-gradient(...);
    --cloudy-gradient: linear-gradient(...);
    /* Add your custom gradients */
}
```

### Add More Weather Details
In `script.js`, access additional data from API response:
```javascript
const feelsLike = data.main.feels_like;
const sunrise = data.sys.sunrise;
const sunset = data.sys.sunset;
```

## Troubleshooting 🔧

### Weather data not loading?
1. Check your API key is correct in `script.js`
2. Ensure you have internet connection
3. Verify API key is activated (may take a few minutes)
4. Check browser console for error messages

### City not found?
1. Check spelling of city name
2. Try adding country code: "London,UK"
3. Use official city names

### Forecast not showing?
- Forecast API requires valid API key
- Check browser console for errors
- Ensure current weather loaded successfully

## Performance Tips ⚡

- Images are cached by the browser
- jQuery selectors are cached for efficiency
- API calls are optimized (one per search)
- Smooth animations using CSS transforms

## License 📄

This project is open source and available for educational purposes.

## Credits 👏

- Weather data: [OpenWeatherMap](https://openweathermap.org/)
- Icons: [Font Awesome](https://fontawesome.com/)
- Framework: [Bootstrap 5](https://getbootstrap.com/)
- Library: [jQuery](https://jquery.com/)

## Support 💬

For issues or questions:
1. Check the troubleshooting section
2. Review OpenWeatherMap API documentation
3. Check browser console for errors

## Future Enhancements 🚀

Potential features to add:
- [ ] Hourly forecast
- [ ] Weather maps
- [ ] Multiple city comparison
- [ ] Weather alerts
- [ ] Favorite cities list
- [ ] Geolocation support
- [ ] Dark/Light theme toggle
- [ ] Weather charts and graphs

---

**Note**: Remember to replace `'YOUR_API_KEY_HERE'` with your actual OpenWeatherMap API key in `script.js` before running the app!

Enjoy using the Weather Web App! 🌈
