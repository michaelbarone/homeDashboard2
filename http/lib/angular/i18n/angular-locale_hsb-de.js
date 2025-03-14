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
          AMPMS: ["dopo\u0142dnja", "popo\u0142dnju"],
          DAY: ["njed\u017aela", "p\u00f3nd\u017aela", "wutora", "srjeda", "\u0161tw\u00f3rtk", "pjatk", "sobota"],
          ERANAMES: ["p\u0159ed Chrystowym narod\u017aenjom", "po Chrystowym narod\u017aenju"],
          ERAS: ["p\u0159.Chr.n.", "po Chr.n."],
          FIRSTDAYOFWEEK: 0,
          MONTH: ["januara", "februara", "m\u011brca", "apryla", "meje", "junija", "julija", "awgusta", "septembra", "oktobra", "nowembra", "decembra"],
          SHORTDAY: ["nje", "p\u00f3n", "wut", "srj", "\u0161tw", "pja", "sob"],
          SHORTMONTH: ["jan.", "feb.", "m\u011br.", "apr.", "mej.", "jun.", "jul.", "awg.", "sep.", "okt.", "now.", "dec."],
          STANDALONEMONTH: ["januar", "februar", "m\u011brc", "apryl", "meja", "junij", "julij", "awgust", "september", "oktober", "nowember", "december"],
          WEEKENDRANGE: [5, 6],
          fullDate: "EEEE, d. MMMM y",
          longDate: "d. MMMM y",
          medium: "d.M.y H:mm:ss",
          mediumDate: "d.M.y",
          mediumTime: "H:mm:ss",
          short: "d.M.yy H:mm 'hod\u017a'.",
          shortDate: "d.M.yy",
          shortTime: "H:mm 'hod\u017a'."
        },
        NUMBER_FORMATS: {
          CURRENCY_SYM: "\u20ac",
          DECIMAL_SEP: ",",
          GROUP_SEP: ".",
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
        id: "hsb-de",
        localeID: "hsb_DE",
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
