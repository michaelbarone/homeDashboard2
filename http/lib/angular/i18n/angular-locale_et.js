"use strict";
angular.module(
  "ngLocale",
  [],
  [
    "$provide",
    function ($provide) {
      var PLURAL_CATEGORY = { ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other" };
      function getDecimals(n) {
        n = n + "";
        var i = n.indexOf(".");
        return i == -1 ? 0 : n.length - i - 1;
      }

      function getVF(n, opt_precision) {
        var v = opt_precision;

        if (undefined === v) {
          v = Math.min(getDecimals(n), 3);
        }

        var base = Math.pow(10, v);
        var f = ((n * base) | 0) % base;
        return { v: v, f: f };
      }

      $provide.value("$locale", {
        DATETIME_FORMATS: {
          AMPMS: ["AM", "PM"],
          DAY: ["p\u00fchap\u00e4ev", "esmasp\u00e4ev", "teisip\u00e4ev", "kolmap\u00e4ev", "neljap\u00e4ev", "reede", "laup\u00e4ev"],
          ERANAMES: ["enne Kristust", "p\u00e4rast Kristust"],
          ERAS: ["eKr", "pKr"],
          FIRSTDAYOFWEEK: 0,
          MONTH: ["jaanuar", "veebruar", "m\u00e4rts", "aprill", "mai", "juuni", "juuli", "august", "september", "oktoober", "november", "detsember"],
          SHORTDAY: ["P", "E", "T", "K", "N", "R", "L"],
          SHORTMONTH: ["jaan", "veebr", "m\u00e4rts", "apr", "mai", "juuni", "juuli", "aug", "sept", "okt", "nov", "dets"],
          STANDALONEMONTH: ["jaanuar", "veebruar", "m\u00e4rts", "aprill", "mai", "juuni", "juuli", "august", "september", "oktoober", "november", "detsember"],
          WEEKENDRANGE: [5, 6],
          fullDate: "EEEE, d. MMMM y",
          longDate: "d. MMMM y",
          medium: "d. MMM y HH:mm:ss",
          mediumDate: "d. MMM y",
          mediumTime: "HH:mm:ss",
          short: "dd.MM.yy HH:mm",
          shortDate: "dd.MM.yy",
          shortTime: "HH:mm"
        },
        NUMBER_FORMATS: {
          CURRENCY_SYM: "\u20ac",
          DECIMAL_SEP: ",",
          GROUP_SEP: "\u00a0",
          PATTERNS: [
            {
              gSize: 3,
              lgSize: 3,
              maxFrac: 3,
              minFrac: 0,
              minInt: 1,
              negPre: "-",
              negSuf: "",
              posPre: "",
              posSuf: ""
            },
            {
              gSize: 3,
              lgSize: 3,
              maxFrac: 2,
              minFrac: 2,
              minInt: 1,
              negPre: "-",
              negSuf: "\u00a0\u00a4",
              posPre: "",
              posSuf: "\u00a0\u00a4"
            }
          ]
        },
        id: "et",
        localeID: "et",
        pluralCat: function (n, opt_precision) {
          var i = n | 0;
          var vf = getVF(n, opt_precision);
          if (i == 1 && vf.v == 0) {
            return PLURAL_CATEGORY.ONE;
          }
          return PLURAL_CATEGORY.OTHER;
        }
      });
    }
  ]
);
