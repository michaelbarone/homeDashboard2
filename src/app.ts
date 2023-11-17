import express, { Request } from "express";
import cors from "cors";
import serveStatic from "serve-static";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import { getDay, HTTPResponseError } from "./utils.js";
import { logger as log, morganMiddleware } from "./logger/index.js";

const app = express();

app.use(cors());

app.use(function appUse(err, Request, Response, NextFunction) {
  Response.status(200).json(err);
});
app.use(bodyParser.urlencoded({ extended: true }));

app.use(morganMiddleware);

if (!process.env.weatherBitKey) {
  console.log("ALERT - check your .env file has been created and is updated with values");
}

const port = process.env.APP_PORT || 9876;

app.use(serveStatic("http", { index: ["index.html"] }));

const dashboardSettings = {
  checkWeatherCurrentInterval: 600000,
  checkWeatherCurrentMinimumElapsedTime: 1800000,
  checkWeatherDailyMinimumElapsedTime: 21600000,
  timezone: process.env.TIMEZONE,
  weatherGovZone: process.env.weatherGovZone,

  googleMapsApi: process.env.googleMapsApi,
  city: process.env.CITY,
  state: process.env.STATE,
  photoChange: process.env.photoChange,
  flickrFeedID: process.env.flickrFeedID,
  mapsLat: process.env.mapsLat,
  mapsLong: process.env.mapsLong
};

const backendSettings = {
  weatherBitKey: process.env.weatherBitKey
};

const api: any = {};
api.weatherBitBackOffCount = 0;
api.weatherBitBackOffLast429 = 0;
api.weatherbit = {};

let weather: any = {};
weather.version = 2020.1;
weather.alerts = {};
weather.lastUpdate = 0;
weather.lastUpdated = {};
weather.lastUpdated.current = 0;
weather.lastUpdated.daily = 0;
weather.lastUpdated.hourly = 0;
weather.lastUpdated.alerts = 0;
weather.current = {};
weather.daily = [];
weather.hourly = [];

let houseTemperature = {};
houseTemperature = { aveInside: 69.55, aveGarage: 52.7, aveOutside: 48.7, "In vs Out": -20.8, $now: 1699598090124 };
weather = {
  version: 2020.1,
  alerts: {},
  lastUpdate: 1699943888432,
  lastUpdated: { current: "Mon Nov 13 2023", daily: "2023-11-14T06:38:08.669Z", hourly: 0, alerts: 1699943888419 },
  current: {
    app_temp: 49,
    aqi: 72,
    city_name: "Elk Grove",
    clouds: 0,
    country_code: "US",
    datetime: "2023-11-14:06",
    dewpt: 44.3,
    dhi: 0,
    dni: 0,
    elev_angle: -58.69,
    ghi: 0,
    gust: 9.1,
    h_angle: -90,
    lat: 38.4088,
    lon: -121.37162,
    ob_time: "2023-11-14 06:23",
    pod: "n",
    precip: 0,
    pres: 1013.5,
    rh: 83,
    slp: 1014.8453,
    snow: 0,
    solar_rad: 0,
    sources: ["rtma", "radar", "satellite"],
    state_code: "CA",
    station: "AR866",
    sunrise: "14:45",
    sunset: "00:53",
    temp: 49,
    timezone: "America/Los_Angeles",
    ts: 1699942988,
    uv: 0,
    vis: 9.9,
    weather: { icon: "c01n", description: "Clear sky", code: 800 },
    wind_cdir: "NW",
    wind_cdir_full: "northwest",
    wind_dir: 306,
    wind_spd: 0.8,
    aqiIndex: "Moderate"
  },
  daily: [
    {
      app_max_temp: 66.5,
      app_min_temp: 46.5,
      clouds: 34,
      clouds_hi: 40,
      clouds_low: 6,
      clouds_mid: 41,
      datetime: "2023-11-13",
      dewpt: 48.5,
      high_temp: 68.8,
      low_temp: 45.2,
      max_dhi: null,
      max_temp: 68.8,
      min_temp: 45,
      moon_phase: 0.00546865,
      moon_phase_lunation: 0.02,
      moonrise_ts: 1699888295,
      moonset_ts: 1699923659,
      ozone: 308.2,
      pop: 0,
      precip: 0,
      pres: 1010.5,
      rh: 74,
      slp: 1011.8,
      snow: 0,
      snow_depth: 0,
      sunrise_ts: 1699886713,
      sunset_ts: 1699923296,
      temp: 57.3,
      ts: 1699880460,
      uv: 0,
      valid_date: "2023-11-13",
      vis: 11.9,
      weather: { description: "Scattered clouds", code: 802, icon: "c02d" },
      wind_cdir: "SSW",
      wind_cdir_full: "south-southwest",
      wind_dir: 212,
      wind_gust_spd: 6.7,
      wind_spd: 4.5
    },
    {
      app_max_temp: 64.9,
      app_min_temp: 47.3,
      clouds: 38,
      clouds_hi: 33,
      clouds_low: 26,
      clouds_mid: 7,
      datetime: "2023-11-14",
      dewpt: 46.2,
      high_temp: 67.3,
      low_temp: 43.1,
      max_dhi: null,
      max_temp: 67.3,
      min_temp: 45.2,
      moon_phase: 0.0333539,
      moon_phase_lunation: 0.05,
      moonrise_ts: 1699978879,
      moonset_ts: 1700012503,
      ozone: 306.1,
      pop: 35,
      precip: 0.039,
      pres: 1012.9,
      rh: 76,
      slp: 1014.2,
      snow: 0,
      snow_depth: 0,
      sunrise_ts: 1699973178,
      sunset_ts: 1700009649,
      temp: 54.2,
      ts: 1699948860,
      uv: 3.2,
      valid_date: "2023-11-14",
      vis: 10.9,
      weather: { description: "Scattered clouds", code: 802, icon: "c02d" },
      wind_cdir: "SSW",
      wind_cdir_full: "south-southwest",
      wind_dir: 202,
      wind_gust_spd: 9.4,
      wind_spd: 6
    },
    {
      app_max_temp: 62,
      app_min_temp: 45.1,
      clouds: 69,
      clouds_hi: 87,
      clouds_low: 67,
      clouds_mid: 26,
      datetime: "2023-11-15",
      dewpt: 46.3,
      high_temp: 64.1,
      low_temp: 49.6,
      max_dhi: null,
      max_temp: 64.1,
      min_temp: 43.1,
      moon_phase: 0.0856678,
      moon_phase_lunation: 0.09,
      moonrise_ts: 1700069403,
      moonset_ts: 1700101939,
      ozone: 304.4,
      pop: 75,
      precip: 0.233,
      pres: 1011.1,
      rh: 79,
      slp: 1012.4,
      snow: 0,
      snow_depth: 0,
      sunrise_ts: 1700059644,
      sunset_ts: 1700096004,
      temp: 53.3,
      ts: 1700035260,
      uv: 2.8,
      valid_date: "2023-11-15",
      vis: 6.6,
      weather: { description: "Light rain", code: 500, icon: "r01d" },
      wind_cdir: "ESE",
      wind_cdir_full: "east-southeast",
      wind_dir: 114,
      wind_gust_spd: 8.9,
      wind_spd: 6
    },
    {
      app_max_temp: 65,
      app_min_temp: 51,
      clouds: 60,
      clouds_hi: 51,
      clouds_low: 39,
      clouds_mid: 54,
      datetime: "2023-11-16",
      dewpt: 53,
      high_temp: 66.7,
      low_temp: 49.2,
      max_dhi: null,
      max_temp: 66.7,
      min_temp: 49.6,
      moon_phase: 0.161084,
      moon_phase_lunation: 0.12,
      moonrise_ts: 1700159617,
      moonset_ts: 1700191998,
      ozone: 315.9,
      pop: 80,
      precip: 0.328,
      pres: 1011.9,
      rh: 87,
      slp: 1013.2,
      snow: 0,
      snow_depth: 0,
      sunrise_ts: 1700146109,
      sunset_ts: 1700182361,
      temp: 56.9,
      ts: 1700121660,
      uv: 2.1,
      valid_date: "2023-11-16",
      vis: 14.2,
      weather: { description: "Light rain", code: 500, icon: "r01d" },
      wind_cdir: "WSW",
      wind_cdir_full: "west-southwest",
      wind_dir: 258,
      wind_gust_spd: 9.2,
      wind_spd: 6
    },
    {
      app_max_temp: 64,
      app_min_temp: 50.1,
      clouds: 77,
      clouds_hi: 87,
      clouds_low: 34,
      clouds_mid: 83,
      datetime: "2023-11-17",
      dewpt: 54.2,
      high_temp: 65.2,
      low_temp: 52.8,
      max_dhi: null,
      max_temp: 65.2,
      min_temp: 49.2,
      moon_phase: 0.256394,
      moon_phase_lunation: 0.16,
      moonrise_ts: 1700249320,
      moonset_ts: 1700282555,
      ozone: 311.8,
      pop: 85,
      precip: 0.398,
      pres: 1010.8,
      rh: 90,
      slp: 1012.1,
      snow: 0,
      snow_depth: 0,
      sunrise_ts: 1700232575,
      sunset_ts: 1700268719,
      temp: 57.2,
      ts: 1700208060,
      uv: 1.5,
      valid_date: "2023-11-17",
      vis: 14.4,
      weather: { description: "Moderate rain", code: 501, icon: "r02d" },
      wind_cdir: "SE",
      wind_cdir_full: "southeast",
      wind_dir: 142,
      wind_gust_spd: 8.7,
      wind_spd: 5.8
    },
    {
      app_max_temp: 62.5,
      app_min_temp: 54.2,
      clouds: 66,
      clouds_hi: 84,
      clouds_low: 75,
      clouds_mid: 76,
      datetime: "2023-11-18",
      dewpt: 57.1,
      high_temp: 64.1,
      low_temp: 51.9,
      max_dhi: null,
      max_temp: 64.1,
      min_temp: 52.8,
      moon_phase: 0.366537,
      moon_phase_lunation: 0.19,
      moonrise_ts: 1700338453,
      moonset_ts: 1700373374,
      ozone: 316.2,
      pop: 80,
      precip: 0.356,
      pres: 1011.7,
      rh: 96,
      slp: 1013,
      snow: 0,
      snow_depth: 0,
      sunrise_ts: 1700319040,
      sunset_ts: 1700355080,
      temp: 58.1,
      ts: 1700294460,
      uv: 2,
      valid_date: "2023-11-18",
      vis: 12.1,
      weather: { description: "Light rain", code: 500, icon: "r01d" },
      wind_cdir: "SSE",
      wind_cdir_full: "south-southeast",
      wind_dir: 166,
      wind_gust_spd: 12.1,
      wind_spd: 7.8
    },
    {
      app_max_temp: 66.2,
      app_min_temp: 51.9,
      clouds: 15,
      clouds_hi: 30,
      clouds_low: 4,
      clouds_mid: 10,
      datetime: "2023-11-19",
      dewpt: 48.6,
      high_temp: 67.4,
      low_temp: 48.1,
      max_dhi: null,
      max_temp: 67.4,
      min_temp: 51.9,
      moon_phase: 0.485068,
      moon_phase_lunation: 0.22,
      moonrise_ts: 1700427089,
      moonset_ts: 1700464233,
      ozone: 286.2,
      pop: 0,
      precip: 0,
      pres: 1015.6,
      rh: 72,
      slp: 1016.9,
      snow: 0,
      snow_depth: 0,
      sunrise_ts: 1700405504,
      sunset_ts: 1700441442,
      temp: 58.6,
      ts: 1700380860,
      uv: 3.5,
      valid_date: "2023-11-19",
      vis: 15,
      weather: { description: "Few clouds", code: 801, icon: "c02d" },
      wind_cdir: "WNW",
      wind_cdir_full: "west-northwest",
      wind_dir: 284,
      wind_gust_spd: 9.2,
      wind_spd: 4.7
    }
  ],
  hourly: [],
  lastChecked: 1699586197369
};

const temp_pass = true;

function check_rate_limit(res) {
  // log.verbose(res);
  // log.verbose(res.headers);
  if (res?.headers?.get("x-ratelimit-remaining")) {
    api.weatherbit.rate_limit_remaining = res?.headers?.get("x-ratelimit-remaining");
  }
  if (res?.headers?.get("x-ratelimit-reset")) {
    api.weatherbit.x_ratelimit_reset = res?.headers?.get("x-ratelimit-reset");
  }
}

app.post("/data/saveToJSON", bodyParser.json(), async (req, res) => {
  // not used anymore, all weather data should be coming from nodejs now
  if (temp_pass && req.body) {
    weather = req.body;
    console.log(JSON.stringify(weather));
    return res.status(200).json({ status: "success" });
  }
  return res.status(500).json({ status: "error" });
});

app.post("/data/saveHouseTempToJSON", bodyParser.json(), async (req, res) => {
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
    if (getDay(weather.daily[0].datetime, 0) != "TODAY") {
      while (weather.daily[0]?.datetime && getDay(weather.daily[0].datetime, 0) != "TODAY") {
        weather.daily.shift();
      }
    }
    return res.status(200).json(weather);
  }
  return res.status(500).json({ status: "error" });
});

app.get("/data/weatherStats", async (req, res) => {
  const wstats: any = {};
  wstats.version = weather.version;
  wstats.lastUpdated = weather.lastUpdated;
  wstats.api = api;
  if (temp_pass) {
    return res.status(200).json(wstats);
  }
  return res.status(500).json({ status: "error" });
});

app.get("/data/updateWeather", async (req, res) => {
  // set/check isRunning bit
  // check memory/variable, if not exist pull from local json file
  // check data, if old pull from api
  // save to local json file every X hours to keep fresh for server restarts...  need to put this in persistent storage for docker, currently wont persist
  const dateNow = Date.now();
  let difDate = dateNow - new Date(weather.lastUpdated.current).getTime();
  function returnData() {
    if (getDay(weather.daily[0].datetime, 0) != "TODAY") {
      while (weather.daily[0]?.datetime && getDay(weather.daily[0].datetime, 0) != "TODAY") {
        weather.daily.shift();
      }
    }
    weather.lastUpdate = Date.now();
    weather.lastChecked = Date.now();
    return res.status(200).json(weather);
  }
  if (weather.lastUpdated.current > 0 || difDate <= dashboardSettings.checkWeatherCurrentMinimumElapsedTime) {
    // data still fresh, send from memory:
    return returnData();
  }
  if (api.weatherBitBackOffCount > 0) {
    // wait 1 hour for each backOffCount
    const elapsedTime = Date.now() - api.weatherBitBackOffLast429;
    const cooldownTime = api.weatherBitBackOffCount * 3600000;
    if (elapsedTime > cooldownTime) {
      // good to check again
    } else {
      // wait til cool down period
      log.warn("Too Many Requests to weatherbit -- cooling down", `BackOffCount=${api.weatherBitBackOffCount}`, `Waiting for ${elapsedTime} > ${cooldownTime} `);
      weather.current = {};
      weather.lastUpdated.current = 0;

      return returnData();
    }
  }
  log.debug("API-CALL-weatherbit current");
  fetch(`https://api.weatherbit.io/v2.0/current?city=${dashboardSettings.city},${dashboardSettings.state}&units=I&key=${backendSettings.weatherBitKey}`, { method: "Get" })
    .then((res) => {
      // log.verbose(res);
      if (res.status === 429) {
        api.weatherBitBackOffCount++;
        api.weatherBitBackOffLast429 = Date.now();
        log.warn(`Too Many Requests to weatherbit -- Backing Off - count: ${api.weatherBitBackOffCount}`);
        weather.current = {};
        weather.lastUpdated.current = 0;
        throw new HTTPResponseError(res);
      }
      check_rate_limit(res);
      return res.json();
    })
    .then((json: any) => {
      // log.verbose(json);
      api.weatherBitBackOffCount = 0;
      weather.current = json?.data[0] || {};
      weather.lastUpdated.current = new Date().toDateString();

      let aqiIndex = "Good";
      const aqi = weather.current.aqi;
      switch (true) {
        case aqi < 51:
          aqiIndex = "Good";
          break;
        case aqi < 101:
          aqiIndex = "Moderate";
          break;
        case aqi < 151:
          aqiIndex = "Unhealthy for Sensative Groups";
          break;
        case aqi < 201:
          aqiIndex = "Unhealthy";
          break;
        case aqi < 301:
          aqiIndex = "Very Unhealthy";
          break;
        case aqi > 300:
          aqiIndex = "Hazardous";
          break;
        default:
          aqiIndex = "Good";
          break;
      }
      weather.current.aqiIndex = aqiIndex;
      difDate = dateNow - new Date(weather.lastUpdated.daily).getTime();
      if (
        weather.lastUpdated.daily === 0 ||
        (difDate > dashboardSettings.checkWeatherCurrentMinimumElapsedTime && (!weather.daily[0]?.datetime || dateNow > new Date(weather.daily[0].datetime).getTime()))
      ) {
        log.info("JSON data version outdated, refreshing forecast weather");
        log.debug("API-CALL-weatherbit forecast");
        fetch(`https://api.weatherbit.io/v2.0/forecast/daily?city=${dashboardSettings.city},${dashboardSettings.state}&key=${backendSettings.weatherBitKey}&units=I`, {
          method: "Get"
        })
          .then((res) => {
            // log.verbose(res);
            check_rate_limit(res);
            return res.json();
          })
          .then((json: any) => {
            if (json?.data) {
              weather.daily = json.data;
              weather.lastUpdated.daily = new Date();
            }
          })
          .catch(function (error) {
            log.error(`/data/updateWeather error: ${error}`);
            weather.lastUpdated.daily = 0;
            // dont reset this, so we can still see old forcast data
            // weather.daily = [];
          });
      }
    })
    .catch(function (error) {
      log.error(`/data/updateWeather error: ${error}`);
      weather.current = {};
      weather.lastUpdated.current = 0;
    })
    .finally(function () {
      return returnData();
      //   if (getDay(weather.daily[0].datetime, 0) != "TODAY") {
      //     while (weather.daily[0]?.datetime && getDay(weather.daily[0].datetime, 0) != "TODAY") {
      //       weather.daily.shift();
      //     }
      //   }
      //   weather.lastUpdate = Date.now();
      //   weather.lastUpdated.daily = Date.now();
      //   return res.status(200).json(weather);
    });
});

app.get("/data/weatherAlerts", async (req, res) => {
  // set/check isRunning bit
  // check data, if old pull from api
  fetch(`https://api.weather.gov/alerts/active/zone/${dashboardSettings.weatherGovZone}`, { method: "Get" })
    .then((res) => {
      return res.json();
    })
    .then((json: any) => {
      if (json.features.length > 0) {
        weather.alerts = json.features[0].properties;
        weather.lastUpdated.alerts = Date.now();
        return res.status(200).json(weather);
      }
      weather.lastUpdated.alerts = Date.now();
      weather.alerts = {};
      return res.status(201).json(weather);
    })
    .catch(function (error) {
      console.log(`/data/weatherAlerts error: ${error}`);
      weather.alerts = {};
      return res.status(500).json(weather);
    });
});

app.get("/dashboardSettings", async (req, res) => {
  if (temp_pass) {
    return res.status(200).json(dashboardSettings);
  }
  // return defaults?
  return res.status(500).json({ status: "error" });
});

const initApp = async () => {
  app.listen({ port, host: "0.0.0.0" }, () => console.log(`> Listening on port ${port}`));
};

initApp();
