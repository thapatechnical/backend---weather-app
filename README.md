# 🌤 Skyline — Weather App

A clean, polished weather app built with **Node.js**, **Express**, and **EJS**.
Uses the free OpenWeatherMap API to show current conditions + a 5-day forecast.

---

## 📦 Tech Stack

| Layer     | Technology          |
|-----------|---------------------|
| Runtime   | Node.js ≥ 18        |
| Framework | Express 4           |
| Templates | EJS                 |
| HTTP      | Axios               |
| Styling   | Vanilla CSS         |

---

## 🚀 Local Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
```
Open `.env` and paste your API key:
```
OPENWEATHER_API_KEY=your_key_here
```
Get a free key at [openweathermap.org/api](https://openweathermap.org/api).
The **Current Weather** + **5-Day Forecast** endpoints are both on the free tier.

### 3. Run locally
```bash
npm start        # production
npm run dev      # with auto-reload (nodemon)
```
Visit → http://localhost:3000

---

## ☁️ Hostinger Deployment (Business Plan)

Hostinger's Node.js hosting reads `process.env.PORT` automatically —
the app already handles this.

### Step-by-step

1. **Upload** your project files via hPanel → File Manager **or** Git.
   - You can skip `node_modules/` — Hostinger installs them for you.

2. **Set environment variable** in hPanel:
   - Go to **Hosting → Node.js → Environment Variables**
   - Add `OPENWEATHER_API_KEY` = `<your key>`

3. **Entry point**: confirm it is `app.js` in hPanel's Node.js settings.

4. **Start command**: `node app.js`
   (hPanel detects the `start` script in `package.json` automatically.)

5. **Restart** the Node.js application from hPanel.

Your app will be live at your Hostinger domain. 🎉

---

## 📁 Project Structure

```
weather-app/
├── app.js              # Express server & routes
├── package.json
├── .env.example        # Copy to .env and fill in your key
├── .gitignore
├── views/
│   └── index.ejs       # Main EJS template
└── public/
    └── css/
        └── style.css   # All styles
```

---

## 🌈 Features

- Current temperature, feels-like, humidity, wind, pressure, visibility
- Sunrise / sunset times (local to the searched city)
- 5-day forecast
- Dynamic background that changes with weather conditions
- Fully responsive (mobile-friendly)
