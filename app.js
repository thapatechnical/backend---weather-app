require("dotenv").config();
const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.OPENWEATHER_API_KEY;
const API_BASE = "https://api.openweathermap.org/data/2.5";

// ── Middleware ──────────────────────────────────────────────────────────────
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

// ── Helpers ─────────────────────────────────────────────────────────────────
function windDirection(deg) {
  const dirs = ["N","NE","E","SE","S","SW","W","NW"];
  return dirs[Math.round(deg / 45) % 8];
}

function formatTime(unix, offset) {
  const d = new Date((unix + offset) * 1000);
  return d.toUTCString().slice(17, 22); // HH:MM
}

function weatherBackground(id) {
  if (id >= 200 && id < 300) return "thunderstorm";
  if (id >= 300 && id < 600) return "rainy";
  if (id >= 600 && id < 700) return "snowy";
  if (id >= 700 && id < 800) return "foggy";
  if (id === 800)             return "sunny";
  if (id > 800)               return "cloudy";
  return "default";
}

// ── Routes ───────────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.render("index", { weather: null, error: null, query: "" });
});

app.post("/weather", async (req, res) => {
  const city = req.body.city?.trim();

  if (!city) {
    return res.render("index", {
      weather: null,
      error: "Please enter a city name.",
      query: "",
    });
  }

  try {
    const [currentRes, forecastRes] = await Promise.all([
      axios.get(`${API_BASE}/weather`, {
        params: { q: city, appid: API_KEY, units: "metric" },
      }),
      axios.get(`${API_BASE}/forecast`, {
        params: { q: city, appid: API_KEY, units: "metric", cnt: 40 },
      }),
    ]);

    const c = currentRes.data;
    const offset = c.timezone; // seconds offset from UTC

    // Build 5-day forecast (one entry per day at noon-ish)
    const seen = new Set();
    const forecast = forecastRes.data.list
      .filter((item) => {
        const day = new Date((item.dt + offset) * 1000).toUTCString().slice(0, 16);
        if (!seen.has(day)) { seen.add(day); return true; }
        return false;
      })
      .slice(0, 5)
      .map((item) => ({
        day: new Date((item.dt + offset) * 1000).toLocaleDateString("en-US", {
          weekday: "short", timeZone: "UTC",
        }),
        icon: item.weather[0].icon,
        desc: item.weather[0].main,
        high: Math.round(item.main.temp_max),
        low:  Math.round(item.main.temp_min),
      }));

    const weather = {
      city:        c.name,
      country:     c.sys.country,
      temp:        Math.round(c.main.temp),
      feels_like:  Math.round(c.main.feels_like),
      humidity:    c.main.humidity,
      description: c.weather[0].description,
      icon:        c.weather[0].icon,
      wind_speed:  Math.round(c.wind.speed * 3.6), // m/s → km/h
      wind_dir:    windDirection(c.wind.deg ?? 0),
      pressure:    c.main.pressure,
      visibility:  c.visibility ? Math.round(c.visibility / 1000) : "N/A",
      sunrise:     formatTime(c.sys.sunrise, offset),
      sunset:      formatTime(c.sys.sunset,  offset),
      bg:          weatherBackground(c.weather[0].id),
      forecast,
    };

    res.render("index", { weather, error: null, query: city });
  } catch (err) {
    const status = err.response?.status;
    let message = "Something went wrong. Please try again.";
    if (status === 404) message = `City "${city}" not found. Check the spelling and try again.`;
    if (status === 401) message = "Invalid API key. Please check your .env file.";

    res.render("index", { weather: null, error: message, query: city });
  }
});

// ── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🌤  Weather app running → http://localhost:${PORT}`);
});
