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
          AMPMS: ["prijepodne", "popodne"],
          DAY: ["nedjelja", "ponedjeljak", "utorak", "srijeda", "\u010detvrtak", "petak", "subota"],
          ERANAMES: ["prije nove ere", "nove ere"],
          ERAS: ["p. n. e.", "n. e."],
          FIRSTDAYOFWEEK: 0,
          MONTH: ["januar", "februar", "mart", "april", "maj", "juni", "juli", "avgust", "septembar", "oktobar", "novembar", "decembar"],
          SHORTDAY: ["ned", "pon", "uto", "sri", "\u010det", "pet", "sub"],
          SHORTMONTH: ["jan", "feb", "mar", "apr", "maj", "jun", "jul", "avg", "sep", "okt", "nov", "dec"],
          STANDALONEMONTH: ["januar", "februar", "mart", "april", "maj", "juni", "juli", "avgust", "septembar", "oktobar", "novembar", "decembar"],
          WEEKENDRANGE: [5, 6],
          fullDate: "EEEE, d. MMMM y.",
          longDate: "d. MMMM y.",
          medium: "d. MMM. y. HH:mm:ss",
          mediumDate: "d. MMM. y.",
          mediumTime: "HH:mm:ss",
          short: "d.M.yy. HH:mm",
          shortDate: "d.M.yy.",
          shortTime: "HH:mm"
        },
        NUMBER_FORMATS: {
          CURRENCY_SYM: "KM",
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
        id: "bs-latn-ba",
        localeID: "bs_Latn_BA",
        pluralCat: function (n, opt_precision) {
          var i = n | 0;
          var vf = getVF(n, opt_precision);
          if ((vf.v == 0 && i % 10 == 1 && i % 100 != 11) || (vf.f % 10 == 1 && vf.f % 100 != 11)) {
            return PLURAL_CATEGORY.ONE;
          }
          if ((vf.v == 0 && i % 10 >= 2 && i % 10 <= 4 && (i % 100 < 12 || i % 100 > 14)) || (vf.f % 10 >= 2 && vf.f % 10 <= 4 && (vf.f % 100 < 12 || vf.f % 100 > 14))) {
            return PLURAL_CATEGORY.FEW;
          }
          return PLURAL_CATEGORY.OTHER;
        }
      });
    }
  ]
);
