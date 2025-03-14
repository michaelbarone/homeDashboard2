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
          AMPMS: ["am Vormittag", "am Namittag"],
          DAY: ["Sunntig", "M\u00e4\u00e4ntig", "Ziischtig", "Mittwuch", "Dunschtig", "Friitig", "Samschtig"],
          ERANAMES: ["v. Chr.", "n. Chr."],
          ERAS: ["v. Chr.", "n. Chr."],
          FIRSTDAYOFWEEK: 0,
          MONTH: ["Januar", "Februar", "M\u00e4rz", "April", "Mai", "Juni", "Juli", "Auguscht", "Sept\u00e4mber", "Oktoober", "Nov\u00e4mber", "Dez\u00e4mber"],
          SHORTDAY: ["Su.", "M\u00e4.", "Zi.", "Mi.", "Du.", "Fr.", "Sa."],
          SHORTMONTH: ["Jan", "Feb", "M\u00e4r", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"],
          STANDALONEMONTH: ["Januar", "Februar", "M\u00e4rz", "April", "Mai", "Juni", "Juli", "Auguscht", "Sept\u00e4mber", "Oktoober", "Nov\u00e4mber", "Dez\u00e4mber"],
          WEEKENDRANGE: [5, 6],
          fullDate: "EEEE, d. MMMM y",
          longDate: "d. MMMM y",
          medium: "dd.MM.y HH:mm:ss",
          mediumDate: "dd.MM.y",
          mediumTime: "HH:mm:ss",
          short: "dd.MM.yy HH:mm",
          shortDate: "dd.MM.yy",
          shortTime: "HH:mm"
        },
        NUMBER_FORMATS: {
          CURRENCY_SYM: "CHF",
          DECIMAL_SEP: ".",
          GROUP_SEP: "\u2019",
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
        id: "gsw-ch",
        localeID: "gsw_CH",
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
