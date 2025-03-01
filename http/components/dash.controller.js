app.controller("dashCtrl", [
  "$rootScope",
  "$scope",
  "$timeout",
  "$interval",
  "$http",
  "Idle",
  "$location",
  "ModalService",
  "spinnerService",
  "$route",
  function ($rootScope, $scope, $timeout, $interval, $http, Idle, $location, ModalService, spinnerService, $route) {
    spinnerService.clear();

    $scope.data = {};
    $scope.data.weather = {};
    $scope.data.weather.version = 2020.1;
    $scope.data.weather.alerts = {};
    $scope.data.weather.lastUpdate = 0;
    $scope.data.weather.lastUpdated = {};
    $scope.data.weather.lastUpdated.current = 0;
    $scope.data.weather.lastUpdated.daily = 0;
    $scope.data.weather.lastUpdated.hourly = 0;
    $scope.data.weather.lastUpdated.alerts = 0;
    $scope.data.weather.current = {};
    $scope.data.weather.daily = [];
    $scope.data.weather.hourly = [];
    $scope.data.background = {};
    $scope.data.background.currentImage = "";
    $scope.data.background.nextImage = "";
    $scope.data.background.images = {};

    $scope.data.background.odd = "";
    $scope.data.background.even = "";
    $scope.data.background.count = 0;
    $scope.data.background.countValue = "Even";

    $scope.data.houseTemperature = {};
    $scope.data.params = [];
    $scope.functions = {};

    $scope.data.time = {};
    $scope.idle = false;

    let currentDay = "";

    // initialize dashboardSettings before pre-load
    let dashboardSettings = {};

    $.get("/dashboardSettings", function (data) {
      if (data) {
        dashboardSettings = data;
      } else {
        console.log("Could not get dashboardSettings");
        // TODO set defaults? or return defaults form api?
      }
    }).then(function () {
      angular.forEach($location.search(), function (value, key) {
        $scope.data.params[key] = value;
      });

      $scope.functions.updateFrameSize = function (limit = false) {
        $scope.frameHeight = window.innerHeight;
        $scope.frameWidth = window.innerWidth;
        const m = (($scope.frameWidth - 180) / 120).toFixed(0);
        const f = (($scope.frameWidth - 160) / 70).toFixed(0);
        $scope.mainWeatherTiles = m;
        $scope.frameWeatherTiles = f;
      };
      $scope.functions.updateFrameSize();
      angular.element(window).bind("resize", function () {
        $scope.functions.updateFrameSize();
      });

      $scope.$on("IdleStart", function () {
        // the user appears to have gone idle
        if (!$scope.data.params.kiosk) {
          $scope.idle = true;
          console.log("idle");
        } else {
          console.log("idle in kiosk");
        }
        // reset to default states
        $scope.showHouseTemp = false;
        $scope.showHourly = false;
        $scope.showMaps = false;
        $scope.showAlert = false;
        $scope.functions.showMap("close");
      });

      $scope.$on("IdleEnd", function () {
        // the user has come back from AFK and is doing stuff. if you are warning them, you can use this to hide the dialog
        $scope.idle = false;
        console.log("not idle");
      });

      $interval(updateTime, 1e3);
      async function updateTime() {
        $scope.data.time.raw = moment().tz(dashboardSettings.timezone);
        $scope.data.time.hour = $scope.data.time.raw.format("h");
        $scope.data.time.minute = $scope.data.time.raw.format("mm");
        $scope.data.time.second = $scope.data.time.raw.format("ss");
        $scope.data.time.ampm = $scope.data.time.raw.format("A");
        $scope.data.time.day = $scope.data.time.raw.format("dddd");
        $scope.data.time.date = $scope.data.time.raw.format("D");
        $scope.data.time.month = $scope.data.time.raw.format("MMMM");
        $scope.data.time.year = $scope.data.time.raw.format("YYYY");
        if (currentDay == "") {
          currentDay = $scope.data.time.day;
        } else if (currentDay != $scope.data.time.day) {
          await updateWeather();
          currentDay = $scope.data.time.day;
        }
      }

      $scope.functions.updatePhoto = function () {
        if ($scope.data.background.images[0]) {
          if ($scope.idle) {
            setTimeout(function () {
              $scope.functions.updatePhoto();
            }, 5000);
          } else {
            $scope.data.background.count++;
            if ($scope.data.background.count % 2 == 0) {
              $scope.data.background.countValue = "Even";
            } else {
              $scope.data.background.countValue = "Odd";
            }

            if ($scope.data.background.count == 1) {
              $scope.data.background.odd = $scope.data.background.images[0].media.m.replace("_m", "_b");
              $scope.data.background.even = $scope.data.background.images[1].media.m.replace("_m", "_b");
              $scope.data.background.images.shift();
              $scope.data.background.images.shift();
            } else {
              setTimeout(function () {
                if ($scope.data.background.countValue == "Even") {
                  $scope.data.background.odd = $scope.data.background.images[0].media.m.replace("_m", "_b");
                  $scope.data.background.images.shift();
                } else {
                  $scope.data.background.even = $scope.data.background.images[0].media.m.replace("_m", "_b");
                  $scope.data.background.images.shift();
                }
              }, 5000);
            }
            setTimeout(function () {
              $scope.functions.updatePhoto();
            }, dashboardSettings.photoChange);
          }
        } else {
          if (!dashboardSettings.flickrFeedID) {
            console.log("set flickrFeedID env for background images");
            return;
          }
          $.getJSON(
            "https://api.flickr.com/services/feeds/groups_pool.gne?jsoncallback=?",
            {
              // 78249294@N00 - "title": "Beautiful Scenery & Landscapes Pool"
              // id: "78249294@N00",
              id: dashboardSettings.flickrFeedID,
              format: "json"
            },
            function (data) {
              $scope.data.background.images = data.items;
              $scope.data.background.count = 0;
              // console.log(backgroundImages);
              $scope.functions.updatePhoto();
            }
          );
        }
      };
      $scope.functions.updatePhoto();

      // getDay function also in utils.ts file
      $scope.functions.getDay = function (date, index = 1) {
        // const inputDay = new Date(date).toLocaleString("en-US", { timeZone: dashboardSettings.timezone, weekday: "short" });
        // const currentDay1 = new Date().toLocaleString("en-US", { timeZone: dashboardSettings.timezone, weekday: "short" });
        // if (index == 0 && currentDay1 == inputDay) {
        //   return "TODAY";
        // }
        // return inputDay;

        const inputDay = new Date(`${date} 12:00.000Z`).toLocaleString("en-US", { timeZone: dashboardSettings.timezone, weekday: "short" });
        const currentDay1 = new Date().toLocaleString("en-US", { timeZone: dashboardSettings.timezone, weekday: "short" });
        const d = new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles", dateStyle: "short" });
        const currentDate = new Date(d).toISOString().split("T")[0];
        // console.log(`${date}--${currentDate} || ${inputDay}--${currentDay}`);
        if (index == 0 && date == currentDate && currentDay1 == inputDay) {
          // console.log("return today");
          return "TODAY";
        }
        return inputDay;
      };

      /**
       * START NOT USED (used on html)
       *
       *
       *
       *
       */

      function correctHours(i) {
        if (i > 12) {
          i -= 12;
        } else if (i < 1) {
          i = 12;
        }
        return i;
      }
      function correctMinute(i) {
        if (i < 10) {
          i = `0${i}`;
        }
        return i;
      }
      function amORpm(i) {
        if (i < 12) {
          return "am";
        }
        return "pm";
      }

      $scope.functions.getSunrise = function (time, date) {
        if (!date) {
          return;
        }
        let sunrise = new Date(`${date.split(":")[0]}T${time}:00.000Z`);
        if (sunrise.getMinutes() < 10) {
          sunrise = `${sunrise.getHours()}:0${sunrise.getMinutes()}`;
        } else {
          sunrise = `${sunrise.getHours()}:${sunrise.getMinutes()}`;
        }
        return sunrise;
      };

      $scope.functions.getSunset = function (time, date) {
        if (!date) {
          return;
        }
        let sunset = new Date(`${date.split(":")[0]}T${time}:00.000Z`);
        if (sunset.getMinutes() < 10) {
          sunset = `${(sunset.getHours() + 24) % 12 || 12}:0${sunset.getMinutes()}`;
        } else {
          sunset = `${(sunset.getHours() + 24) % 12 || 12}:${sunset.getMinutes()}`;
        }
        return sunset;
      };

      $scope.functions.getTime = function getTime(inputtime) {
        if (inputtime === 0) {
          return "Never";
        }
        const time = new Date(inputtime);
        const currentTime = `${time.getMonth() + 1}/${time.getDate()} | ${correctHours(time.getHours())}:${correctMinute(time.getMinutes())} ${amORpm(time.getHours())}`;

        return currentTime;
      };
      /**
       * END NOT USED
       *
       *
       *
       */

      // $scope.functions.updateWeatherFromObject = function () {
      //   if ($scope.functions.getDay($scope.data.weather.daily[0].datetime, 0) != "TODAY") {
      //     while ($scope.data.weather.daily[0]?.datetime && $scope.functions.getDay($scope.data.weather.daily[0].datetime, 0) != "TODAY") {
      //       $scope.data.weather.daily.shift();
      //     }
      //   }
      //   $scope.data.weather.lastUpdate = Date.now();
      //   // $.post("./data/saveToJSON.php", JSON.stringify($scope.data.weather));
      //   $.post("./data/saveToJSON", JSON.stringify($scope.data.weather));
      // };

      $scope.functions.getHouseTemperature = function () {
        // $.getJSON("./data/houseTemperature.json", function (ht) {
        $.getJSON("/data/houseTemperature", function (ht) {
          const temp = {};
          angular.forEach(ht, function (value, key) {
            key = key.replace("ave", "");
            switch (key) {
              case "Outside":
                temp[1] = { temp: value, name: key };
                break;
              case "Upstairs":
                temp[2] = { temp: value, name: key };
                break;
              case "Downstairs":
                temp[3] = { temp: value, name: key };
                break;
              case "Inside":
                temp[3] = { temp: value, name: key };
                break;
              case "Garage":
                temp[4] = { temp: value, name: key };
                break;
              case "In vs Out":
                temp[5] = { temp: value, name: key };
                break;
              case "$now":
                temp.$now = value;
                break;
              default:
            }
          });
          $scope.data.houseTemperature = temp;
        }).fail(function () {
          $scope.data.houseTemperature = {};
        });
      };
      function getHouseTemp() {
        $scope.functions.getHouseTemperature();
      }
      $interval(getHouseTemp, 180000);

      $scope.functions.getWeather = function () {
        $.get("/data/updateWeather", function (data) {
          if (data.version && $scope.data.weather.version == data.version) {
            $scope.data.weather = data;
          } else {
            console.log("JSON data version outdated, refreshing from sources");
          }
        })
          .fail(function () {
            $scope.data.weather.lastUpdate = 0;
            $scope.data.weather.lastUpdated.current = 0;
            $scope.data.weather.lastUpdated.daily = 0;
            $scope.data.weather.lastUpdated.hourly = 0;
          })
          .always(function () {
            // placeholder
          });
      };

      $scope.functions.getWeatherAlerts = function () {
        $.get("/data/weatherAlerts", function (data) {
          if (data) {
            $scope.data.weather.alerts = data.alerts;
          } else {
            console.log("Could not getWeatherAlerts");
            scope.data.weather.alerts = {};
          }
        }).fail(function () {
          $scope.data.weather.alerts = {};
        });
      };

      const getDailyReset = 0;
      // reset when day changes

      $interval(updateWeather, dashboardSettings.checkWeatherCurrentInterval);
      updateWeather();
      async function updateWeather() {
        console.log("updating weather");
        $.get("/data/weather", function (data) {
          if (data.version && $scope.data.weather.version == data.version) {
            $scope.data.weather = data;
          } else {
            console.log("JSON data version outdated, refreshing from sources");
          }
        })
          .fail(function () {
            $scope.data.weather.lastUpdate = 0;
            $scope.data.weather.lastUpdated.current = 0;
            $scope.data.weather.lastUpdated.daily = 0;
            $scope.data.weather.lastUpdated.hourly = 0;
          })
          .always(function () {
            const dateNow = Date.now();
            $scope.data.weather.lastChecked = dateNow;
            $scope.functions.getWeatherAlerts();
            $scope.functions.getHouseTemperature();
            const difDate = dateNow - new Date($scope.data.weather.lastUpdated.current);
            if ($scope.data.weather.lastUpdated.current === 0 || difDate > dashboardSettings.checkWeatherCurrentMinimumElapsedTime) {
              console.log("JSON data version outdated, refreshing current weather");
              $scope.functions.getWeather();
            }
          });
      }

      $scope.functions.isObjectEmpty = function (obj) {
        return Object.keys(obj).length === 0;
      };

      $scope.weekday = new Array(7);
      $scope.weekday[0] = "Sun";
      $scope.weekday[1] = "Mon";
      $scope.weekday[2] = "Tue";
      $scope.weekday[3] = "Wed";
      $scope.weekday[4] = "Thu";
      $scope.weekday[5] = "Fri";
      $scope.weekday[6] = "Sat";

      $scope.functions.weatherCode = function (input) {
        let theWeatherCode = 3200;
        switch (parseInt(input, 10)) {
          case 200:
          case 201:
          case 230:
          case 231:
          case 232:
            theWeatherCode = 4;
            break;
          case 202:
            theWeatherCode = 45;
            break;
          case 233:
            theWeatherCode = 3;
            break;
          case 300:
          case 301:
          case 500:
            theWeatherCode = 9;
            break;
          case 302:
          case 501:
          case 502:
          case 900:
            theWeatherCode = 11;
            break;
          case 511:
            theWeatherCode = 10;
            break;
          case 520:
          case 521:
          case 522:
            theWeatherCode = 12;
            break;
          case 600:
          case 601:
            theWeatherCode = 16;
            break;
          case 602:
          case 622:
            theWeatherCode = 43;
            break;
          case 610:
            theWeatherCode = 14;
            break;
          case 611:
          case 612:
            theWeatherCode = 18;
            break;
          case 621:
            theWeatherCode = 46;
            break;
          case 623:
            theWeatherCode = 13;
            break;
          case 700:
          case 721:
            theWeatherCode = 21;
            break;
          case 711:
            theWeatherCode = 22;
            break;
          case 731:
            theWeatherCode = 19;
            break;
          case 741:
          case 751:
            theWeatherCode = 20;
            break;
          case 800:
            theWeatherCode = 32;
            break;
          case 801:
          case 802:
          case 803:
            theWeatherCode = 30;
            break;
          case 804:
            theWeatherCode = 26;
            break;
          default:
        }
        return theWeatherCode;
      };

      $scope.functions.showMap = function (type) {
        if (type == "traffic" && $scope.currentMap != "traffic") {
          $scope.currentMap = "traffic";
          const map = new google.maps.Map(document.getElementById("map"), {
            zoom: 11,
            center: {
              lat: parseFloat(dashboardSettings.mapsLat),
              lng: parseFloat(dashboardSettings.mapsLong)
            }
          });

          const trafficLayer = new google.maps.TrafficLayer();
          trafficLayer.setMap(map);
        } else if (type == "weather" && $scope.currentMap != "weather") {
          $scope.currentMap = "weather";
          document.getElementById(
            "weatherMap"
          ).innerHTML = `<iframe src="https://www.rainviewer.com/map.html?loc=${dashboardSettings.mapsLat},${dashboardSettings.mapsLong},8&amp;oFa=0&amp;oC=0&amp;oU=0&amp;oCUB=1&amp;oCS=1&amp;oF=0&amp;oAP=0&amp;rmt=4" style="border:0px #ffffff none;" name="myiFrame" scrolling="no" marginheight="0px" marginwidth="0px" height="100%" width="100%" allowfullscreen=""></iframe>`;
        } else if (type == "close") {
          $scope.currentMap = "";
          if (document.getElementById("map") !== null) {
            document.getElementById("map").innerHTML = "";
          }
          if (document.getElementById("weatherMap") !== null) {
            document.getElementById("weatherMap").innerHTML = "";
          }
        }
      };

      if ($scope.data.params.background == "transparent") {
        const css = "body, html {background: rgba(0,0,0,0);} .windowContainer {background: rgba(0,0,0,0);} .dashboard {font-size: 8pt !important}";
        const head = document.head || document.getElementsByTagName("head")[0];
        const style = document.createElement("style");
        head.appendChild(style);
        // eslint-disable-next-line deprecation/deprecation
        style.type = "text/css";
        if (style.styleSheet) {
          // This is required for IE8 and below.
          style.styleSheet.cssText = css;
        } else {
          style.appendChild(document.createTextNode(css));
        }
      }

      if (!$scope.data.params.kiosk) {
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = `https://maps.googleapis.com/maps/api/js?key=${dashboardSettings.googleMapsApi}`;
        document.body.appendChild(script);
      }
    });
  }
]);
