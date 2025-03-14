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
          AMPMS: ["a.m.", "p.m."],
          DAY: ["domingo", "luns", "martes", "m\u00e9rcores", "xoves", "venres", "s\u00e1bado"],
          ERANAMES: ["antes de Cristo", "despois de Cristo"],
          ERAS: ["a.C.", "d.C."],
          FIRSTDAYOFWEEK: 0,
          MONTH: ["xaneiro", "febreiro", "marzo", "abril", "maio", "xu\u00f1o", "xullo", "agosto", "setembro", "outubro", "novembro", "decembro"],
          SHORTDAY: ["dom.", "luns", "mar.", "m\u00e9r.", "xov.", "ven.", "s\u00e1b."],
          SHORTMONTH: ["xan.", "feb.", "mar.", "abr.", "maio", "xu\u00f1o", "xul.", "ago.", "set.", "out.", "nov.", "dec."],
          STANDALONEMONTH: ["Xaneiro", "Febreiro", "Marzo", "Abril", "Maio", "Xu\u00f1o", "Xullo", "Agosto", "Setembro", "Outubro", "Novembro", "Decembro"],
          WEEKENDRANGE: [5, 6],
          fullDate: "EEEE, d 'de' MMMM 'de' y",
          longDate: "d 'de' MMMM 'de' y",
          medium: "d 'de' MMM 'de' y HH:mm:ss",
          mediumDate: "d 'de' MMM 'de' y",
          mediumTime: "HH:mm:ss",
          short: "dd/MM/yy HH:mm",
          shortDate: "dd/MM/yy",
          shortTime: "HH:mm"
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
        id: "gl-es",
        localeID: "gl_ES",
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
