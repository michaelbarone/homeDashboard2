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
          AMPMS: ["A.M.", "P.M."],
          DAY: ["Mb\u1ecds\u1ecb \u1ee4ka", "M\u1ecdnde", "Tiuzdee", "Wenezdee", "T\u1ecd\u1ecdzdee", "Fra\u1ecbdee", "Sat\u1ecddee"],
          ERANAMES: ["Tupu Kristi", "Af\u1ecd Kristi"],
          ERAS: ["T.K.", "A.K."],
          FIRSTDAYOFWEEK: 0,
          MONTH: [
            "Jen\u1ee5war\u1ecb",
            "Febr\u1ee5war\u1ecb",
            "Maach\u1ecb",
            "Eprel",
            "Mee",
            "Juun",
            "Jula\u1ecb",
            "\u1eccg\u1ecd\u1ecdst",
            "Septemba",
            "\u1eccktoba",
            "Novemba",
            "Disemba"
          ],
          SHORTDAY: ["\u1ee4ka", "M\u1ecdn", "Tiu", "Wen", "T\u1ecd\u1ecd", "Fra\u1ecb", "Sat"],
          SHORTMONTH: ["Jen", "Feb", "Maa", "Epr", "Mee", "Juu", "Jul", "\u1eccg\u1ecd", "Sep", "\u1ecckt", "Nov", "Dis"],
          STANDALONEMONTH: [
            "Jen\u1ee5war\u1ecb",
            "Febr\u1ee5war\u1ecb",
            "Maach\u1ecb",
            "Eprel",
            "Mee",
            "Juun",
            "Jula\u1ecb",
            "\u1eccg\u1ecd\u1ecdst",
            "Septemba",
            "\u1eccktoba",
            "Novemba",
            "Disemba"
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
          CURRENCY_SYM: "\u20a6",
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
        id: "ig",
        localeID: "ig",
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
