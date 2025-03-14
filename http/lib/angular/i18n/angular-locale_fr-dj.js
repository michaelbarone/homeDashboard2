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
          AMPMS: ["AM", "PM"],
          DAY: ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"],
          ERANAMES: ["avant J\u00e9sus-Christ", "apr\u00e8s J\u00e9sus-Christ"],
          ERAS: ["av. J.-C.", "ap. J.-C."],
          FIRSTDAYOFWEEK: 5,
          MONTH: ["janvier", "f\u00e9vrier", "mars", "avril", "mai", "juin", "juillet", "ao\u00fbt", "septembre", "octobre", "novembre", "d\u00e9cembre"],
          SHORTDAY: ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."],
          SHORTMONTH: ["janv.", "f\u00e9vr.", "mars", "avr.", "mai", "juin", "juil.", "ao\u00fbt", "sept.", "oct.", "nov.", "d\u00e9c."],
          STANDALONEMONTH: ["janvier", "f\u00e9vrier", "mars", "avril", "mai", "juin", "juillet", "ao\u00fbt", "septembre", "octobre", "novembre", "d\u00e9cembre"],
          WEEKENDRANGE: [5, 6],
          fullDate: "EEEE d MMMM y",
          longDate: "d MMMM y",
          medium: "d MMM y h:mm:ss a",
          mediumDate: "d MMM y",
          mediumTime: "h:mm:ss a",
          short: "dd/MM/y h:mm a",
          shortDate: "dd/MM/y",
          shortTime: "h:mm a"
        },
        NUMBER_FORMATS: {
          CURRENCY_SYM: "Fdj",
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
              maxFrac: 0,
              minFrac: 0,
              minInt: 1,
              negPre: "-",
              negSuf: "\u00a0\u00a4",
              posPre: "",
              posSuf: "\u00a0\u00a4"
            }
          ]
        },
        id: "fr-dj",
        localeID: "fr_DJ",
        pluralCat: function (n, opt_precision) {
          var i = n | 0;
          if (i == 0 || i == 1) {
            return PLURAL_CATEGORY.ONE;
          }
          return PLURAL_CATEGORY.OTHER;
        }
      });
    }
  ]
);
