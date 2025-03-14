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
          AMPMS: ["Tesiran", "Teipa"],
          DAY: ["Mderot ee are", "Mderot ee kuni", "Mderot ee ong\u2019wan", "Mderot ee inet", "Mderot ee ile", "Mderot ee sapa", "Mderot ee kwe"],
          ERANAMES: ["Kabla ya Christo", "Baada ya Christo"],
          ERAS: ["KK", "BK"],
          FIRSTDAYOFWEEK: 6,
          MONTH: [
            "Lapa le obo",
            "Lapa le waare",
            "Lapa le okuni",
            "Lapa le ong\u2019wan",
            "Lapa le imet",
            "Lapa le ile",
            "Lapa le sapa",
            "Lapa le isiet",
            "Lapa le saal",
            "Lapa le tomon",
            "Lapa le tomon obo",
            "Lapa le tomon waare"
          ],
          SHORTDAY: ["Are", "Kun", "Ong", "Ine", "Ile", "Sap", "Kwe"],
          SHORTMONTH: ["Obo", "Waa", "Oku", "Ong", "Ime", "Ile", "Sap", "Isi", "Saa", "Tom", "Tob", "Tow"],
          STANDALONEMONTH: [
            "Lapa le obo",
            "Lapa le waare",
            "Lapa le okuni",
            "Lapa le ong\u2019wan",
            "Lapa le imet",
            "Lapa le ile",
            "Lapa le sapa",
            "Lapa le isiet",
            "Lapa le saal",
            "Lapa le tomon",
            "Lapa le tomon obo",
            "Lapa le tomon waare"
          ],
          WEEKENDRANGE: [5, 6],
          fullDate: "EEEE, d MMMM y",
          longDate: "d MMMM y",
          medium: "d MMM y HH:mm:ss",
          mediumDate: "d MMM y",
          mediumTime: "HH:mm:ss",
          short: "dd/MM/y HH:mm",
          shortDate: "dd/MM/y",
          shortTime: "HH:mm"
        },
        NUMBER_FORMATS: {
          CURRENCY_SYM: "Ksh",
          DECIMAL_SEP: ".",
          GROUP_SEP: ",",
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
              negPre: "-\u00a4",
              negSuf: "",
              posPre: "\u00a4",
              posSuf: ""
            }
          ]
        },
        id: "saq",
        localeID: "saq",
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
