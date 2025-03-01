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
api.logs[Date.now()] = "App Start";

// Function to remove old log entries
function cleanupApiLogs(maxAgeMs = 48 * 60 * 60 * 1000) {
  // Default to 48 hours
  const now = Date.now();
  const cutoffTime = now - maxAgeMs;

  Object.keys(api.logs).forEach((timestamp) => {
    if (parseInt(timestamp) < cutoffTime) {
      delete api.logs[timestamp];
    }
  });
}

// Clean up logs every hour
setInterval(cleanupApiLogs, 60 * 60 * 1000);

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
weather = {
  version: 2020.1,
  alerts: {
    "@id": "https://api.weather.gov/alerts/urn:oid:2.49.0.1.840.0.440bd736aac4a635f3d7d2299836dc94d5e2fe58.001.1",
    "@type": "wx:Alert",
    id: "urn:oid:2.49.0.1.840.0.440bd736aac4a635f3d7d2299836dc94d5e2fe58.001.1",
    areaDesc:
      "Northern Sacramento Valley; Central Sacramento Valley; Southern Sacramento Valley; Carquinez Strait and Delta; Mountains Southwestern Shasta County to Western Colusa County",
    geocode: {
      SAME: ["006089", "006103", "006007", "006011", "006021", "006057", "006101", "006115", "006005", "006017", "006061", "006067", "006095", "006113", "006077"],
      UGC: ["CAZ015", "CAZ016", "CAZ017", "CAZ018", "CAZ063"]
    },
    affectedZones: [
      "https://api.weather.gov/zones/forecast/CAZ015",
      "https://api.weather.gov/zones/forecast/CAZ016",
      "https://api.weather.gov/zones/forecast/CAZ017",
      "https://api.weather.gov/zones/forecast/CAZ018",
      "https://api.weather.gov/zones/forecast/CAZ063"
    ],
    references: [],
    sent: "2023-11-22T13:30:00-08:00",
    effective: "2023-11-22T13:30:00-08:00",
    onset: "2023-11-23T10:00:00-08:00",
    expires: "2023-11-23T04:00:00-08:00",
    ends: "2023-11-24T13:00:00-08:00",
    status: "Actual",
    messageType: "Alert",
    category: "Met",
    severity: "Moderate",
    certainty: "Likely",
    urgency: "Expected",
    event: "Wind Advisory",
    sender: "w-nws.webmaster@noaa.gov",
    senderName: "NWS Sacramento CA",
    headline: "Wind Advisory issued November 22 at 1:30PM PST until November 24 at 1:00PM PST by NWS Sacramento CA",
    description:
      "* WHAT...North winds 15 to 25 mph with gusts up to 45 mph\nexpected.\n\n* WHERE...Portions of the Sacramento Valley, the Delta, and\nnorthern Coastal Range, strongest west of Interstate 5.\n\n* WHEN...From 10 AM Thursday to 1 PM PST Friday.\n\n* IMPACTS...Gusty winds could blow around unsecured objects such\nas holiday decorations or temporary structures. Tree limbs\ncould be blown down and a few power outages may result.\n\n* ADDITIONAL DETAILS...Strongest winds Thursday night.",
    instruction: "Use extra caution when driving, especially if operating a high\nprofile vehicle. Secure outdoor objects.",
    response: "Execute",
    parameters: {
      AWIPSidentifier: ["NPWSTO"],
      WMOidentifier: ["WWUS76 KSTO 222130"],
      NWSheadline: ["WIND ADVISORY IN EFFECT FROM 10 AM THURSDAY TO 1 PM PST FRIDAY"],
      BLOCKCHANNEL: ["EAS", "NWEM", "CMAS"],
      VTEC: ["/O.NEW.KSTO.WI.Y.0019.231123T1800Z-231124T2100Z/"],
      eventEndingTime: ["2023-11-24T21:00:00+00:00"]
    }
  },
  lastUpdate: 1700718650877,
  lastUpdated: {
    current: 1700718650877,
    daily: 1700945840918,
    hourly: 0,
    alerts: 1700718605834
  },
  current: {
    app_temp: 50,
    aqi: 46,
    city_name: "Elk Grove",
    clouds: 91,
    country_code: "US",
    datetime: "2023-11-23:05",
    dewpt: 44.3,
    dhi: 0,
    dni: 0,
    elev_angle: -48.87,
    ghi: 0,
    gust: 7.4,
    h_angle: -90,
    lat: 38.4088,
    lon: -121.37162,
    ob_time: "2023-11-23 05:29",
    pod: "n",
    precip: 0,
    pres: 1015,
    rh: 83,
    slp: 1016.3486,
    snow: 0,
    solar_rad: 0,
    sources: ["rtma", "radar", "satellite"],
    state_code: "CA",
    station: "AR866",
    sunrise: "14:55",
    sunset: "00:48",
    temp: 50,
    timezone: "America/Los_Angeles",
    ts: 1700717353,
    uv: 0,
    vis: 9.9,
    weather: {
      code: 804,
      icon: "c04n",
      description: "Overcast clouds"
    },
    wind_cdir: "NW",
    wind_cdir_full: "northwest",
    wind_dir: 308,
    wind_spd: 3.4,
    aqiIndex: "Good"
  },
  daily: [
    {
      app_max_temp: 65,
      app_min_temp: 41.2,
      clouds: 15,
      clouds_hi: 9,
      clouds_low: 1,
      clouds_mid: 22,
      datetime: "2023-11-22",
      dewpt: 40.8,
      high_temp: 67.8,
      low_temp: 42.3,
      max_dhi: null,
      max_temp: 67.8,
      min_temp: 41.5,
      moon_phase: 0.901068,
      moon_phase_lunation: 0.36,
      moonrise_ts: 1700779250,
      moonset_ts: 1700740609,
      ozone: 299.6,
      pop: 0,
      precip: 0,
      pres: 1010.4,
      rh: 64,
      slp: 1011.7,
      snow: 0,
      snow_depth: 0,
      sunrise_ts: 1700751360,
      sunset_ts: 1700786910,
      temp: 54.1,
      ts: 1700726460,
      uv: 3.1,
      valid_date: "2023-11-22",
      vis: 7.8,
      weather: {
        icon: "c02d",
        description: "Few clouds",
        code: 801
      },
      wind_cdir: "NW",
      wind_cdir_full: "northwest",
      wind_dir: 316,
      wind_gust_spd: 13.6,
      wind_spd: 8.9
    },
    {
      app_max_temp: 65,
      app_min_temp: 41.2,
      clouds: 15,
      clouds_hi: 9,
      clouds_low: 1,
      clouds_mid: 22,
      datetime: "2023-11-23",
      dewpt: 40.8,
      high_temp: 67.8,
      low_temp: 42.3,
      max_dhi: null,
      max_temp: 67.8,
      min_temp: 41.5,
      moon_phase: 0.901068,
      moon_phase_lunation: 0.36,
      moonrise_ts: 1700779250,
      moonset_ts: 1700740609,
      ozone: 299.6,
      pop: 0,
      precip: 0,
      pres: 1010.4,
      rh: 64,
      slp: 1011.7,
      snow: 0,
      snow_depth: 0,
      sunrise_ts: 1700751360,
      sunset_ts: 1700786910,
      temp: 54.1,
      ts: 1700726460,
      uv: 3.1,
      valid_date: "2023-11-23",
      vis: 7.8,
      weather: {
        icon: "c02d",
        description: "Few clouds",
        code: 801
      },
      wind_cdir: "NW",
      wind_cdir_full: "northwest",
      wind_dir: 316,
      wind_gust_spd: 13.6,
      wind_spd: 8.9
    },
    {
      app_max_temp: 60,
      app_min_temp: 37.3,
      clouds: 1,
      clouds_hi: 0,
      clouds_low: 0,
      clouds_mid: 0,
      datetime: "2023-11-24",
      dewpt: 30.4,
      high_temp: 61.6,
      low_temp: 36.4,
      max_dhi: null,
      max_temp: 61.6,
      min_temp: 42,
      moon_phase: 0.959595,
      moon_phase_lunation: 0.39,
      moonrise_ts: 1700867253,
      moonset_ts: 1700831320,
      ozone: 298.9,
      pop: 0,
      precip: 0,
      pres: 1011,
      rh: 46,
      slp: 1012.4,
      snow: 0,
      snow_depth: 0,
      sunrise_ts: 1700837823,
      sunset_ts: 1700873282,
      temp: 50.8,
      ts: 1700812860,
      uv: 3.1,
      valid_date: "2023-11-24",
      vis: 4.7,
      weather: {
        icon: "c01d",
        description: "Clear Sky",
        code: 800
      },
      wind_cdir: "NNW",
      wind_cdir_full: "north-northwest",
      wind_dir: 340,
      wind_gust_spd: 17.7,
      wind_spd: 11.6
    },
    {
      app_max_temp: 59,
      app_min_temp: 32.9,
      clouds: 2,
      clouds_hi: 0,
      clouds_low: 0,
      clouds_mid: 0,
      datetime: "2023-11-25",
      dewpt: 32.6,
      high_temp: 60.5,
      low_temp: 35.8,
      max_dhi: null,
      max_temp: 60.5,
      min_temp: 36.4,
      moon_phase: 0.99216,
      moon_phase_lunation: 0.43,
      moonrise_ts: 1700955445,
      moonset_ts: 1700922067,
      ozone: 278.3,
      pop: 0,
      precip: 0,
      pres: 1014.5,
      rh: 59,
      slp: 1015.9,
      snow: 0,
      snow_depth: 0,
      sunrise_ts: 1700924285,
      sunset_ts: 1700959656,
      temp: 47.2,
      ts: 1700899260,
      uv: 3.1,
      valid_date: "2023-11-25",
      vis: 15,
      weather: {
        icon: "c02d",
        description: "Few clouds",
        code: 801
      },
      wind_cdir: "NNW",
      wind_cdir_full: "north-northwest",
      wind_dir: 349,
      wind_gust_spd: 9.2,
      wind_spd: 6.3
    },
    {
      app_max_temp: 58.4,
      app_min_temp: 33.2,
      clouds: 3,
      clouds_hi: 0,
      clouds_low: 0,
      clouds_mid: 0,
      datetime: "2023-11-26",
      dewpt: 33.8,
      high_temp: 59.9,
      low_temp: 33.5,
      max_dhi: null,
      max_temp: 59.9,
      min_temp: 35.8,
      moon_phase: 0.998178,
      moon_phase_lunation: 0.46,
      moonrise_ts: 1701041845,
      moonset_ts: 1701012748,
      ozone: 279.5,
      pop: 0,
      precip: 0,
      pres: 1015,
      rh: 62,
      slp: 1016.3,
      snow: 0,
      snow_depth: 0,
      sunrise_ts: 1701010747,
      sunset_ts: 1701046032,
      temp: 46.7,
      ts: 1700985660,
      uv: 3.1,
      valid_date: "2023-11-26",
      vis: 15,
      weather: {
        icon: "c02d",
        description: "Few clouds",
        code: 801
      },
      wind_cdir: "WNW",
      wind_cdir_full: "west-northwest",
      wind_dir: 302,
      wind_gust_spd: 8.5,
      wind_spd: 5.6
    },
    {
      app_max_temp: 56.9,
      app_min_temp: 32.2,
      clouds: 7,
      clouds_hi: 0,
      clouds_low: 0,
      clouds_mid: 0,
      datetime: "2023-11-27",
      dewpt: 34.6,
      high_temp: 58.7,
      low_temp: 39.7,
      max_dhi: null,
      max_temp: 58.7,
      min_temp: 33.5,
      moon_phase: 0.979058,
      moon_phase_lunation: 0.49,
      moonrise_ts: 1701130335,
      moonset_ts: 1701103177,
      ozone: 291.8,
      pop: 0,
      precip: 0,
      pres: 1016.4,
      rh: 66,
      slp: 1017.7,
      snow: 0,
      snow_depth: 0,
      sunrise_ts: 1701097208,
      sunset_ts: 1701132410,
      temp: 45.8,
      ts: 1701072060,
      uv: 3.2,
      valid_date: "2023-11-27",
      vis: 15,
      weather: {
        icon: "c02d",
        description: "Few clouds",
        code: 801
      },
      wind_cdir: "SSW",
      wind_cdir_full: "south-southwest",
      wind_dir: 208,
      wind_gust_spd: 6.9,
      wind_spd: 4.7
    },
    {
      app_max_temp: 60.5,
      app_min_temp: 43.1,
      clouds: 0,
      clouds_hi: 0,
      clouds_low: 0,
      clouds_mid: 0,
      datetime: "2023-11-28",
      dewpt: 24.2,
      high_temp: 60.5,
      low_temp: 43.5,
      max_dhi: null,
      max_temp: 60.5,
      min_temp: 42.5,
      moon_phase: 0.937812,
      moon_phase_lunation: 0.53,
      moonrise_ts: 1701219226,
      moonset_ts: 1701193157,
      ozone: 301.2,
      pop: 0,
      precip: 0,
      pres: 1018,
      rh: 38,
      slp: 1019.4,
      snow: 0,
      snow_depth: 0,
      sunrise_ts: 1701183669,
      sunset_ts: 1701218790,
      temp: 49.9,
      ts: 1701158460,
      uv: 3.3,
      valid_date: "2023-11-28",
      vis: 15,
      weather: {
        icon: "c01d",
        description: "Clear Sky",
        code: 800
      },
      wind_cdir: "S",
      wind_cdir_full: "south",
      wind_dir: 186,
      wind_gust_spd: 2,
      wind_spd: 2
    }
  ],
  hourly: [],
  lastChecked: 1700718650877
};
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
  api.logs[Date.now()] = "API-CALL-weatherbit current";
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
          api.logs[Date.now()] = `Too Many Requests to weatherbit -- Backing Off - count: ${api.weatherBitBackOffCount}`;
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
        api.logs[Date.now()] = "API-CALL-weatherbit forecast";
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
