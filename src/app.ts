import express, { Request } from "express";
import cors from "cors";
import serveStatic from "serve-static";

const app = express();

app.use(cors());

app.use(function appUse(err, Request, Response, NextFunction) {
  Response.status(200).json(err);
});

if (!process.env.APP_PORT) {
  console.log("ALERT - check your .env file has been created and is updated with values");
}

const port = process.env.APP_PORT || 9234;

app.use(serveStatic("http", { index: ["index.html"] }));

const dashboardSettings = {
  checkWeatherCurrentInterval: 60000,
  checkWeatherCurrentMinimumElapsedTime: 1800000,
  checkWeatherDailyMinimumElapsedTime: 21600000,
  timezone: process.env.TIMEZONE,
  weatherGovZone: process.env.weatherGovZone,
  weatherBitKey: process.env.weatherBitKey,
  googleMapsApi: process.env.googleMapsApi,
  city: process.env.CITY,
  state: process.env.STATE,
  photoChange: process.env.photoChange,
  flickrFeedID: process.env.flickrFeedID,
  mapsLat: process.env.mapsLat,
  mapsLong: process.env.mapsLong
};

let houseTemperature = {};
houseTemperature = { aveInside: 69.55, aveGarage: 52.7, aveOutside: 48.7, "In vs Out": -20.8, $now: 1699598090124 };
let weather = {
  version: 2020.1,
  alerts: {},
  lastUpdate: 1699586197752,
  lastUpdated: { current: "2023-11-10T03:16:37.645Z", daily: "2023-11-10T03:16:37.752Z", hourly: 0 },
  current: {
    app_temp: 51,
    aqi: 72,
    city_name: "Elk Grove",
    clouds: 0,
    country_code: "US",
    datetime: "2023-11-10:03",
    dewpt: 38.9,
    dhi: 0,
    dni: 0,
    elev_angle: -24.24,
    ghi: 0,
    gust: 4.7,
    h_angle: -90,
    lat: 38.4088,
    lon: -121.37162,
    ob_time: "2023-11-10 03:01",
    pod: "n",
    precip: 0,
    pres: 1019.5,
    rh: 62,
    slp: 1020.84674,
    snow: 0,
    solar_rad: 0,
    sources: ["rtma", "radar", "satellite"],
    state_code: "CA",
    station: "AR866",
    sunrise: "14:41",
    sunset: "00:57",
    temp: 51,
    timezone: "America/Los_Angeles",
    ts: 1699585265,
    uv: 0,
    vis: 9.9,
    weather: { description: "Clear sky", code: 800, icon: "c01n" },
    wind_cdir: "WNW",
    wind_cdir_full: "west-northwest",
    wind_dir: 289,
    wind_spd: 1.1,
    aqiIndex: "Moderate"
  },
  daily: [
    {
      app_max_temp: 64,
      app_min_temp: 36.4,
      clouds: 31,
      clouds_hi: 41,
      clouds_low: 0,
      clouds_mid: 26,
      datetime: "2023-11-09",
      dewpt: 39.1,
      high_temp: 65.2,
      low_temp: 39.8,
      max_dhi: null,
      max_temp: 65.2,
      min_temp: 36.4,
      moon_phase: 0.0594252,
      moon_phase_lunation: 0.89,
      moonrise_ts: 1699527420,
      moonset_ts: 1699573035,
      ozone: 315.8,
      pop: 0,
      precip: 0,
      pres: 1019.6,
      rh: 62,
      slp: 1020.9,
      snow: 0,
      snow_depth: 0,
      sunrise_ts: 1699540850,
      sunset_ts: 1699577902,
      temp: 52.6,
      ts: 1699534860,
      uv: 0.6,
      valid_date: "2023-11-09",
      vis: 11.9,
      weather: { description: "Scattered clouds", code: 802, icon: "c02d" },
      wind_cdir: "SSW",
      wind_cdir_full: "south-southwest",
      wind_dir: 204,
      wind_gust_spd: 4.9,
      wind_spd: 3.4
    },
    {
      app_max_temp: 64.5,
      app_min_temp: 39.5,
      clouds: 30,
      clouds_hi: 84,
      clouds_low: 2,
      clouds_mid: 42,
      datetime: "2023-11-10",
      dewpt: 39.2,
      high_temp: 68,
      low_temp: 41,
      max_dhi: null,
      max_temp: 68,
      min_temp: 39.8,
      moon_phase: 0.0205337,
      moon_phase_lunation: 0.92,
      moonrise_ts: 1699617418,
      moonset_ts: 1699660852,
      ozone: 309.8,
      pop: 0,
      precip: 0,
      pres: 1018.4,
      rh: 64,
      slp: 1019.8,
      snow: 0,
      snow_depth: 0,
      sunrise_ts: 1699627316,
      sunset_ts: 1699664248,
      temp: 52.5,
      ts: 1699603260,
      uv: 3.1,
      valid_date: "2023-11-10",
      vis: 10.7,
      weather: { description: "Scattered clouds", code: 802, icon: "c02d" },
      wind_cdir: "W",
      wind_cdir_full: "west",
      wind_dir: 277,
      wind_gust_spd: 6.3,
      wind_spd: 4
    },
    {
      app_max_temp: 65.2,
      app_min_temp: 42.2,
      clouds: 16,
      clouds_hi: 46,
      clouds_low: 0,
      clouds_mid: 0,
      datetime: "2023-11-11",
      dewpt: 41.9,
      high_temp: 68.3,
      low_temp: 42.1,
      max_dhi: null,
      max_temp: 68.3,
      min_temp: 41,
      moon_phase: 0.0205337,
      moon_phase_lunation: 0.95,
      moonrise_ts: 1699707536,
      moonset_ts: 1699747252,
      ozone: 283.1,
      pop: 0,
      precip: 0,
      pres: 1016.9,
      rh: 67,
      slp: 1018.2,
      snow: 0,
      snow_depth: 0,
      sunrise_ts: 1699713781,
      sunset_ts: 1699750596,
      temp: 53.5,
      ts: 1699689660,
      uv: 3.4,
      valid_date: "2023-11-11",
      vis: 15.8,
      weather: { description: "Few clouds", code: 801, icon: "c02d" },
      wind_cdir: "W",
      wind_cdir_full: "west",
      wind_dir: 268,
      wind_gust_spd: 5.6,
      wind_spd: 3.8
    },
    {
      app_max_temp: 66.1,
      app_min_temp: 42.2,
      clouds: 34,
      clouds_hi: 70,
      clouds_low: 0,
      clouds_mid: 12,
      datetime: "2023-11-12",
      dewpt: 42.9,
      high_temp: 69.6,
      low_temp: 43.9,
      max_dhi: null,
      max_temp: 69.6,
      min_temp: 42.1,
      moon_phase: 0.00171912,
      moon_phase_lunation: 0.99,
      moonrise_ts: 1699797825,
      moonset_ts: 1699835287,
      ozone: 292.8,
      pop: 0,
      precip: 0,
      pres: 1012,
      rh: 68,
      slp: 1013.3,
      snow: 0,
      snow_depth: 0,
      sunrise_ts: 1699800247,
      sunset_ts: 1699836945,
      temp: 54.5,
      ts: 1699776060,
      uv: 2.8,
      valid_date: "2023-11-12",
      vis: 15,
      weather: { description: "Scattered clouds", code: 802, icon: "c02d" },
      wind_cdir: "SE",
      wind_cdir_full: "southeast",
      wind_dir: 128,
      wind_gust_spd: 6.9,
      wind_spd: 4.7
    },
    {
      app_max_temp: 64,
      app_min_temp: 46,
      clouds: 47,
      clouds_hi: 78,
      clouds_low: 0,
      clouds_mid: 69,
      datetime: "2023-11-13",
      dewpt: 44.8,
      high_temp: 67.2,
      low_temp: 44.5,
      max_dhi: null,
      max_temp: 67.2,
      min_temp: 43.9,
      moon_phase: 0.00546865,
      moon_phase_lunation: 0.02,
      moonrise_ts: 1699888295,
      moonset_ts: 1699923659,
      ozone: 292.6,
      pop: 20,
      precip: 0.002,
      pres: 1010.8,
      rh: 69,
      slp: 1012.1,
      snow: 0,
      snow_depth: 0,
      sunrise_ts: 1699886713,
      sunset_ts: 1699923296,
      temp: 55.1,
      ts: 1699862460,
      uv: 2.3,
      valid_date: "2023-11-13",
      vis: 15,
      weather: { description: "Broken clouds", code: 803, icon: "c03d" },
      wind_cdir: "SSW",
      wind_cdir_full: "south-southwest",
      wind_dir: 212,
      wind_gust_spd: 8.5,
      wind_spd: 5.8
    },
    {
      app_max_temp: 63.8,
      app_min_temp: 46.5,
      clouds: 48,
      clouds_hi: 0,
      clouds_low: 18,
      clouds_mid: 25,
      datetime: "2023-11-14",
      dewpt: 43.9,
      high_temp: 67.8,
      low_temp: 50.2,
      max_dhi: null,
      max_temp: 66.8,
      min_temp: 44.5,
      moon_phase: 0.0333539,
      moon_phase_lunation: 0.05,
      moonrise_ts: 1699978879,
      moonset_ts: 1700012503,
      ozone: 302.6,
      pop: 80,
      precip: 0.278,
      pres: 1010.9,
      rh: 67,
      slp: 1012.2,
      snow: 0,
      snow_depth: 0,
      sunrise_ts: 1699973178,
      sunset_ts: 1700009649,
      temp: 55.4,
      ts: 1699948860,
      uv: 2.5,
      valid_date: "2023-11-14",
      vis: 15,
      weather: { description: "Light rain", code: 500, icon: "r01d" },
      wind_cdir: "S",
      wind_cdir_full: "south",
      wind_dir: 175,
      wind_gust_spd: 11.9,
      wind_spd: 7.6
    },
    {
      app_max_temp: 68.5,
      app_min_temp: 50.2,
      clouds: 20,
      clouds_hi: 28,
      clouds_low: 0,
      clouds_mid: 14,
      datetime: "2023-11-15",
      dewpt: 32.3,
      high_temp: 70.8,
      low_temp: 52.2,
      max_dhi: null,
      max_temp: 70.8,
      min_temp: 50.2,
      moon_phase: 0.0856678,
      moon_phase_lunation: 0.09,
      moonrise_ts: 1700069403,
      moonset_ts: 1700101939,
      ozone: 304.5,
      pop: 0,
      precip: 0,
      pres: 1009.8,
      rh: 39,
      slp: 1011.1,
      snow: 0,
      snow_depth: 0,
      sunrise_ts: 1700059644,
      sunset_ts: 1700096004,
      temp: 59,
      ts: 1700035260,
      uv: 3.6,
      valid_date: "2023-11-15",
      vis: 15,
      weather: { description: "Few clouds", code: 801, icon: "c02d" },
      wind_cdir: "S",
      wind_cdir_full: "south",
      wind_dir: 175,
      wind_gust_spd: 4.3,
      wind_spd: 3.1
    }
  ],
  hourly: [],
  lastChecked: 1699586197369
};

const temp_pass = true;

app.post("/data/saveToJSON", async (req, res) => {
  if (temp_pass && req.body) {
    weather = req.body;
    console.log(JSON.stringify(weather));
    return res.status(200).json({ status: "success" });
  }
  return res.status(500).json({ status: "error" });
});

app.post("/data/saveHouseTempToJSON", async (req, res) => {
  if (temp_pass && req.body) {
    houseTemperature = req.body;
    return res.status(200).json({ status: "success" });
  }
  return res.status(500).json({ status: "error" });
});

app.get("/data/houseTemperature", async (req, res) => {
  if (temp_pass) {
    return res.status(200).json(houseTemperature);
  }
  return res.status(500).json({ status: "error" });
});

app.get("/data/weather", async (req, res) => {
  if (temp_pass) {
    return res.status(200).json(weather);
  }
  return res.status(500).json({ status: "error" });
});

app.get("/dashboardSettings", async (req, res) => {
  if (temp_pass) {
    return res.status(200).json(dashboardSettings);
  }
  return res.status(500).json({ status: "error" });
});

const initApp = async () => {
  app.listen(port, () => console.log(`> Listening on port ${port}`));
};

initApp();
