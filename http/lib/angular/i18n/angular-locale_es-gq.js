"use strict";
angular.module(
  "ngLocale",
  [],
  [
    "$provide",
    function ($provide) {
      var PLURAL_CATEGORY = { ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other" };
      $provide.value("$locale", {
        DATETIME_FORMATS: {
          AMPMS: ["a. m.", "p. m."],
          DAY: ["domingo", "lunes", "martes", "mi\u00e9rcoles", "jueves", "viernes", "s\u00e1bado"],
          ERANAMES: ["antes de Cristo", "despu\u00e9s de Cristo"],
          ERAS: ["a. C.", "d. C."],
          FIRSTDAYOFWEEK: 0,
          MONTH: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
          SHORTDAY: ["dom.", "lun.", "mar.", "mi\u00e9.", "jue.", "vie.", "s\u00e1b."],
          SHORTMONTH: ["ene.", "feb.", "mar.", "abr.", "may.", "jun.", "jul.", "ago.", "sept.", "oct.", "nov.", "dic."],
          STANDALONEMONTH: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
          WEEKENDRANGE: [5, 6],
          fullDate: "EEEE, d 'de' MMMM 'de' y",
          longDate: "d 'de' MMMM 'de' y",
          medium: "d MMM y H:mm:ss",
          mediumDate: "d MMM y",
          mediumTime: "H:mm:ss",
          short: "d/M/yy H:mm",
          shortDate: "d/M/yy",
          shortTime: "H:mm"
        },
        NUMBER_FORMATS: {
          CURRENCY_SYM: "FCFA",
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
              maxFrac: 0,
              minFrac: 0,
              minInt: 1,
              negPre: "-\u00a4",
              negSuf: "",
              posPre: "\u00a4",
              posSuf: ""
            }
          ]
        },
        id: "es-gq",
        localeID: "es_GQ",
        pluralCat: function (n, opt_precision) {
          if (n == 1) {
            return PLURAL_CATEGORY.ONE;
          }
          return PLURAL_CATEGORY.OTHER;
        }
      });
    }
  ]
);
