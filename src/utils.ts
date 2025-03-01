import { dashboardSettings } from "./app.js";

// getDay function also in dash.controller.js
export function getDay(date, index = 1) {
  const inputDay = new Date(`${date} 12:00.000Z`).toLocaleString("en-US", { timeZone: dashboardSettings.timezone, weekday: "short" });
  const currentDay = new Date().toLocaleString("en-US", { timeZone: dashboardSettings.timezone, weekday: "short" });
  const d = new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles", dateStyle: "short" });
  const currentDate = new Date(d).toISOString().split("T")[0];
  // console.log(`${date}--${currentDate} || ${inputDay}--${currentDay}`);
  if (index == 0 && date == currentDate && currentDay == inputDay) {
    // console.log("return today");
    return "TODAY";
  }
  return inputDay;
}

export class HTTPResponseError extends Error {
  response: any;

  constructor(response) {
    super(`HTTP Error Response: ${response.status} ${response.statusText}`);
    this.response = response;
  }
}

export default getDay;

// module.exports = { getDay };
