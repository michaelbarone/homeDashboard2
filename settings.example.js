/*
	copy and rename this to "settings.js"
	then fill in your settings
*/
const dashboardSettings = {
  checkWeatherCurrentInterval: 900000, // milliseconds between check weather calls (default 900000 - 15 minutes)
  checkWeatherCurrentMinimumElapsedTime: 1200000, // minimum amount of time in milliseconds between weather refreshes (default 1200000 - 20 minutes)
  checkWeatherDailyMinimumElapsedTime: 21600000, // mimimum amount of time between daily forcasts (limited calls per day to weather bit api) (default 21600000 - 6 hours)
  timezone: "America/Los_Angeles", // timezone text. example: "America/Los_Angeles"
  weatherGovZone: "CAZ016", // goto https://www.weather.gov/ and find your "local forecast by city,st or zipcode" and find your location zone.  example: "CAZ016"
  weatherBitKey: "yourAPIkeyHERE", // account required from https://weatherbit.io
  googleMapsApi: "yourAPIkeyHERE", // google maps api for traffic map.. needs lat and long below
  city: "sacramento", // city for weatherbit api call
  state: "ca", // state for weatherbit api call
  photoChange: 60000, // how fast the background photo changes in milliseconds
  mapsLat: "", // latitude for map view
  mapsLong: "" // longitude for map view
};
