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
          DAY: ["dimans", "lindi", "mardi", "merkredi", "zedi", "vandredi", "samdi"],
          ERANAMES: ["avan Zezi-Krist", "apre Zezi-Krist"],
          ERAS: ["av. Z-K", "ap. Z-K"],
          FIRSTDAYOFWEEK: 0,
          MONTH: ["zanvie", "fevriye", "mars", "avril", "me", "zin", "zilye", "out", "septam", "oktob", "novam", "desam"],
          SHORTDAY: ["dim", "lin", "mar", "mer", "ze", "van", "sam"],
          SHORTMONTH: ["zan", "fev", "mar", "avr", "me", "zin", "zil", "out", "sep", "okt", "nov", "des"],
          STANDALONEMONTH: ["zanvie", "fevriye", "mars", "avril", "me", "zin", "zilye", "out", "septam", "oktob", "novam", "desam"],
          WEEKENDRANGE: [5, 6],
          fullDate: "EEEE d MMMM y",
          longDate: "d MMMM y",
          medium: "d MMM, y HH:mm:ss",
          mediumDate: "d MMM, y",
          mediumTime: "HH:mm:ss",
          short: "d/M/y HH:mm",
          shortDate: "d/M/y",
          shortTime: "HH:mm"
        },
        NUMBER_FORMATS: {
          CURRENCY_SYM: "MURs",
          DECIMAL_SEP: ".",
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
              negPre: "-\u00a4\u00a0",
              negSuf: "",
              posPre: "\u00a4\u00a0",
              posSuf: ""
            }
          ]
        },
        id: "mfe",
        localeID: "mfe",
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
