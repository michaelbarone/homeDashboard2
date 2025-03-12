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
  log.critical("ALERT - check your .env file has been created and is updated with values");
}

const port = process.env.APP_PORT || 9876;

app.use(serveStatic("http", { index: ["index.html"] }));

export const dashboardSettings = {
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

export const backendSettings = {
  weatherBitKey: process.env.weatherBitKey
};

const api: any = {};
api.weatherBitBackOffCount = 0;
api.weatherBitBackOffLast429 = 0;
api.weatherbit = {};
api.logs = {};

// Function to add a new API log entry
function addApiLog(message: string): void {
  const timestamp = new Date().toISOString();
  api.logs[timestamp] = message;

  // Function to remove old log entries
  // Default to 48 hours
  const now = Date.now();
  const cutoffTime = now - 48 * 60 * 60 * 1000;

  Object.keys(api.logs).forEach((ts) => {
    if (new Date(ts).getTime() < cutoffTime) {
      delete api.logs[ts];
    }
  });
}

addApiLog("App Start");

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

let fetchingUpdates = false;

let houseTemperature = {};
houseTemperature = { aveInside: 69.55, aveGarage: 52.7, aveOutside: 48.7, "In vs Out": -20.8, $now: 1699598090124 };

const temp_pass = true;

async function check_rate_limit(res) {
  // log.verbose(res);
  // log.verbose(res.headers);
  if (res?.headers?.get("x-ratelimit-remaining")) {
    api.weatherbit.rate_limit_remaining = res?.headers?.get("x-ratelimit-remaining");
  }
  if (res?.headers?.get("x-ratelimit-reset")) {
    api.weatherbit.x_ratelimit_reset = res?.headers?.get("x-ratelimit-reset");
  }
}

async function returnWeather(res) {
  if (weather?.daily[0] && getDay(weather?.daily[0]?.datetime, 0) != "TODAY") {
    while (weather.daily[0]?.datetime && getDay(weather.daily[0].datetime, 0) != "TODAY") {
      weather.daily.shift();
    }
  }
  // weather.lastUpdate = Date.now();
  weather.lastChecked = Date.now();
  weather.api = api;
  return res.status(200).json(weather);
}

app.post("/data/saveToJSON", bodyParser.json(), async (req, res) => {
  // not used anymore, all weather data should be coming from nodejs now
  if (temp_pass && req.body) {
    weather = req.body;
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
    return returnWeather(res);
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

  // trim old data
  if (weather?.daily[0] && getDay(weather?.daily[0]?.datetime, 0) != "TODAY") {
    while (weather.daily[0]?.datetime && getDay(weather.daily[0].datetime, 0) != "TODAY") {
      weather.daily.shift();
    }
  }

  if (weather.lastUpdated.current > 0 && difDate <= dashboardSettings.checkWeatherCurrentMinimumElapsedTime) {
    // data still fresh, send from memory:
    return returnWeather(res);
  }
  if (api.weatherBitBackOffCount > 0) {
    // wait 1 hour for each backOffCount
    const elapsedTime = Date.now() - api.weatherBitBackOffLast429;
    const cooldownTime = api.weatherBitBackOffCount * 3600000;
    if (elapsedTime <= cooldownTime) {
      // Still in cooldown period
      log.warn("Too Many Requests to weatherbit -- cooling down", `BackOffCount=${api.weatherBitBackOffCount}`, `Waiting for ${elapsedTime} > ${cooldownTime} `);

      // Don't clear current weather data if we have it
      if (!weather.current || Object.keys(weather.current).length === 0) {
        weather.current = {};
        weather.lastUpdated.current = Date.now();
      }
      return returnWeather(res);
    }
  }
  if (fetchingUpdates) {
    // Wait for updates to complete using a polling mechanism
    const waitForUpdates = () => {
      // Maximum wait time of 30 seconds
      const MAX_WAIT_TIME = 30000;
      const startTime = Date.now();

      return new Promise<void>((resolve) => {
        const checkUpdates = () => {
          if (!fetchingUpdates || Date.now() - startTime >= MAX_WAIT_TIME) {
            if (Date.now() - startTime >= MAX_WAIT_TIME) {
              log.warn("Weather update wait time exceeded maximum of 30 seconds");
              addApiLog("Weather update timeout after 30 seconds");
            }
            resolve();
          } else {
            // Poll every 100ms
            setTimeout(checkUpdates, 100);
          }
        };
        checkUpdates();
      }).then(() => returnWeather(res));
    };
    return waitForUpdates();
  }
  log.debug("API-CALL-weatherbit current");
  addApiLog("API-CALL-weatherbit current");
  fetchingUpdates = true;
  fetch(`https://api.weatherbit.io/v2.0/current?city=${dashboardSettings.city},${dashboardSettings.state}&units=I&key=${backendSettings.weatherBitKey}`, { method: "Get" })
    .then((res) => {
      log.verbose(res);
      check_rate_limit(res);
      if (res.status === 429) {
        api.weatherBitBackOffCount++;
        api.weatherBitBackOffLast429 = Date.now();
        log.warn(`Too Many Requests to weatherbit -- Backing Off - count: ${api.weatherBitBackOffCount}`);
        weather.current = {};
        if (weather.lastUpdate.current !== 0) {
          addApiLog(`Too Many Requests to weatherbit -- Backing Off - count: ${api.weatherBitBackOffCount}`);
        }
        weather.lastUpdated.current = Date.now();
        throw new HTTPResponseError(res);
      }
      return res.json();
    })
    .then((json: any) => {
      // log.verbose(json);
      api.weatherBitBackOffCount = 0;
      weather.current = json?.data[0] || {};
      // TODO set to lastupdated from json data
      weather.lastUpdated.current = Date.now();
      weather.lastUpdate = Date.now();

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
          // aqiIndex = "Unhealthy for Sensative Groups";
          aqiIndex = "Unhealthy-ish";
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
        // (difDate > dashboardSettings.checkWeatherCurrentMinimumElapsedTime && (!weather?.daily[0]?.datetime || dateNow > new Date(weather?.daily[0].datetime).getTime()))
        (difDate > dashboardSettings.checkWeatherCurrentMinimumElapsedTime &&
          (!weather?.daily[0]?.datetime || !weather.daily[3]?.datetime || dateNow - weather.lastUpdated.daily < 21600000)) // 21600000 is 1/4 day
      ) {
        log.info("JSON data version outdated, refreshing forecast weather");
        log.debug("API-CALL-weatherbit forecast");
        addApiLog("API-CALL-weatherbit forecast");
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
              weather.lastUpdated.daily = Date.now();
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
      weather.lastUpdated.current = Date.now();
    })
    .finally(function () {
      fetchingUpdates = false;
      return returnWeather(res);
    });
});

app.get("/data/weatherAlerts", async (req, res) => {
  // set/check isRunning bit
  // TODO check data, if old pull from api otherwise return current
  fetch(`https://api.weather.gov/alerts/active/zone/${dashboardSettings.weatherGovZone}`, { method: "Get" })
    .then((res) => {
      return res.json();
    })
    .then((json: any) => {
      if (json.features.length > 0) {
        weather.alerts = json.features[0].properties;
        // TODO set to lastupdated from json data
        weather.lastUpdated.alerts = Date.now();
        return res.status(200).json(weather);
      }
      weather.lastUpdated.alerts = Date.now();
      weather.alerts = {};
      return res.status(201).json(weather);
    })
    .catch(function (error) {
      log.error(`/data/weatherAlerts error: ${error}`);
      weather.alerts = {};
      return res.status(500).json(weather);
    });

  // TODO not working
  // try {
  //   const weatherAlerts: any = await fetch(`https://api.weather.gov/alerts/active/zone/${dashboardSettings.weatherGovZone}`, { method: "Get" });
  //   const json = weatherAlerts.json();
  //   log.debug(json);
  //   if (json.features.length > 0) {
  //     weather.alerts = json.features[0].properties;
  //     // TODO set to lastupdated from json data
  //     weather.lastUpdated.alerts = Date.now();
  //     return res.status(200).json(weather);
  //   }
  //   weather.lastUpdated.alerts = Date.now();
  //   weather.alerts = {};
  //   return res.status(201).json(weather);
  // } catch (error) {
  //   log.error(`/data/weatherAlerts error: ${error}`);
  //   weather.alerts = {};
  //   return res.status(500).json(weather);
  // }
});

app.get("/dashboardSettings", async (req, res) => {
  if (temp_pass) {
    return res.status(200).json(dashboardSettings);
  }
  // return defaults?
  return res.status(500).json({ status: "error" });
});

const initApp = async () => {
  app.listen({ port, host: "0.0.0.0" }, () => log.warn(`> Listening on port ${port}`));
};

initApp();
