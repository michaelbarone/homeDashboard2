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
          AMPMS: ["\u1325\u12cb\u1275", "\u12a8\u1230\u12d3\u1275"],
          DAY: ["\u12a5\u1211\u12f5", "\u1230\u129e", "\u121b\u12ad\u1230\u129e", "\u1228\u1261\u12d5", "\u1210\u1219\u1235", "\u12d3\u122d\u1265", "\u1245\u12f3\u121c"],
          ERANAMES: ["\u12d3\u1218\u1270 \u12d3\u1208\u121d", "\u12d3\u1218\u1270 \u121d\u1215\u1228\u1275"],
          ERAS: ["\u12d3/\u12d3", "\u12d3/\u121d"],
          FIRSTDAYOFWEEK: 6,
          MONTH: [
            "\u1303\u1295\u12e9\u12c8\u122a",
            "\u134c\u1265\u1229\u12c8\u122a",
            "\u121b\u122d\u127d",
            "\u12a4\u1355\u122a\u120d",
            "\u121c\u12ed",
            "\u1301\u1295",
            "\u1301\u120b\u12ed",
            "\u12a6\u1308\u1235\u1275",
            "\u1234\u1355\u1274\u121d\u1260\u122d",
            "\u12a6\u12ad\u1276\u1260\u122d",
            "\u1296\u126c\u121d\u1260\u122d",
            "\u12f2\u1234\u121d\u1260\u122d"
          ],
          SHORTDAY: ["\u12a5\u1211\u12f5", "\u1230\u129e", "\u121b\u12ad\u1230", "\u1228\u1261\u12d5", "\u1210\u1219\u1235", "\u12d3\u122d\u1265", "\u1245\u12f3\u121c"],
          SHORTMONTH: [
            "\u1303\u1295\u12e9",
            "\u134c\u1265\u1229",
            "\u121b\u122d\u127d",
            "\u12a4\u1355\u122a",
            "\u121c\u12ed",
            "\u1301\u1295",
            "\u1301\u120b\u12ed",
            "\u12a6\u1308\u1235",
            "\u1234\u1355\u1274",
            "\u12a6\u12ad\u1276",
            "\u1296\u126c\u121d",
            "\u12f2\u1234\u121d"
          ],
          STANDALONEMONTH: [
            "\u1303\u1295\u12e9\u12c8\u122a",
            "\u134c\u1265\u1229\u12c8\u122a",
            "\u121b\u122d\u127d",
            "\u12a4\u1355\u122a\u120d",
            "\u121c\u12ed",
            "\u1301\u1295",
            "\u1301\u120b\u12ed",
            "\u12a6\u1308\u1235\u1275",
            "\u1234\u1355\u1274\u121d\u1260\u122d",
            "\u12a6\u12ad\u1276\u1260\u122d",
            "\u1296\u126c\u121d\u1260\u122d",
            "\u12f2\u1234\u121d\u1260\u122d"
          ],
          WEEKENDRANGE: [5, 6],
          fullDate: "EEEE \u1363d MMMM y",
          longDate: "d MMMM y",
          medium: "d MMM y h:mm:ss a",
          mediumDate: "d MMM y",
          mediumTime: "h:mm:ss a",
          short: "dd/MM/y h:mm a",
          shortDate: "dd/MM/y",
          shortTime: "h:mm a"
        },
        NUMBER_FORMATS: {
          CURRENCY_SYM: "Birr",
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
        id: "am",
        localeID: "am",
        pluralCat: function (n, opt_precision) {
          var i = n | 0;
          if (i == 0 || n == 1) {
            return PLURAL_CATEGORY.ONE;
          }
          return PLURAL_CATEGORY.OTHER;
        }
      });
    }
  ]
);
