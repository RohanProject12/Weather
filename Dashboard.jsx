import React, { useState, useEffect } from "react";

const API_KEY = "3cd680cff6e01f3eb8498ddc4c3d36fc"; 

export default function WeatherDashboard() {
  const [city, setCity] = useState("New York");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchWeather = async () => {
    setLoading(true);
    try {
      const weatherRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      const weatherData = await weatherRes.json();
      setWeather(weatherData);

      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
      );
      const forecastData = await forecastRes.json();
      setForecast(forecastData);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  const getDailyForecast = () => {
    if (!forecast) return [];
    const daily = {};
    forecast.list.forEach((item) => {
      const date = item.dt_txt.split(" ")[0];
      if (!daily[date]) {
        daily[date] = item;
      }
    });
    return Object.values(daily).slice(0, 5);
  };

  return (
    <div className="min-h-screen bg-blue-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
        <h1 className="text-2xl font-bold text-center mb-4">Weather Dashboard</h1>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name"
            className="flex-1 px-4 py-2 border rounded-lg"
          />
          <button
            onClick={fetchWeather}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Get Weather"}
          </button>
        </div>
        {weather && weather.main && (
          <div className="text-center">
            <h2 className="text-xl font-semibold">{weather.name}</h2>
            <p className="text-lg capitalize">{weather.weather[0].description}</p>
            <p className="text-4xl font-bold">{weather.main.temp}&deg;C</p>
            <p>Humidity: {weather.main.humidity}%</p>
            <p>Wind: {weather.wind.speed} m/s</p>
          </div>
        )}
        {forecast && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">5-Day Forecast</h3>
            <div className="grid grid-cols-1 gap-4">
              {getDailyForecast().map((day, index) => (
                <div key={index} className="p-4 bg-blue-50 rounded-lg text-center">
                  <p className="font-medium">{new Date(day.dt_txt).toLocaleDateString()}</p>
                  <p className="capitalize">{day.weather[0].description}</p>
                  <p className="text-2xl font-bold">{day.main.temp}&deg;C</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
