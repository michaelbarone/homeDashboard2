export function getDay(date1, index = 1) {
  const weekday: string[] = [];
  weekday[0] = "Sun";
  weekday[1] = "Mon";
  weekday[2] = "Tue";
  weekday[3] = "Wed";
  weekday[4] = "Thu";
  weekday[5] = "Fri";
  weekday[6] = "Sat";

  const date = new Date(`${date1}T00:00`);
  const curDay = new Date().getDay();
  if (index == 0 && curDay == date.getDay()) {
    return "TODAY";
  }
  return weekday[date.getDay()];
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
