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
          AMPMS: ["PG", "PTG"],
          DAY: ["Ahad", "Isnin", "Selasa", "Rabu", "Khamis", "Jumaat", "Sabtu"],
          ERANAMES: ["S.M.", "TM"],
          ERAS: ["S.M.", "TM"],
          FIRSTDAYOFWEEK: 6,
          MONTH: ["Januari", "Februari", "Mac", "April", "Mei", "Jun", "Julai", "Ogos", "September", "Oktober", "November", "Disember"],
          SHORTDAY: ["Ahd", "Isn", "Sel", "Rab", "Kha", "Jum", "Sab"],
          SHORTMONTH: ["Jan", "Feb", "Mac", "Apr", "Mei", "Jun", "Jul", "Ogo", "Sep", "Okt", "Nov", "Dis"],
          STANDALONEMONTH: ["Januari", "Februari", "Mac", "April", "Mei", "Jun", "Julai", "Ogos", "September", "Oktober", "November", "Disember"],
          WEEKENDRANGE: [5, 6],
          fullDate: "EEEE, d MMMM y",
          longDate: "d MMMM y",
          medium: "d MMM y h:mm:ss a",
          mediumDate: "d MMM y",
          mediumTime: "h:mm:ss a",
          short: "d/MM/yy h:mm a",
          shortDate: "d/MM/yy",
          shortTime: "h:mm a"
        },
        NUMBER_FORMATS: {
          CURRENCY_SYM: "$",
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
        id: "ms-sg",
        localeID: "ms_SG",
        pluralCat: function (n, opt_precision) {
          return PLURAL_CATEGORY.OTHER;
        }
      });
    }
  ]
);
