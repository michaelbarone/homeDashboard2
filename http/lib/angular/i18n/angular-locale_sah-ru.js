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
          AMPMS: ["\u042d\u0418", "\u042d\u041a"],
          DAY: [
            "\u0431\u0430\u0441\u043a\u044b\u04bb\u044b\u0430\u043d\u043d\u044c\u0430",
            "\u0431\u044d\u043d\u0438\u0434\u0438\u044d\u043d\u043d\u044c\u0438\u043a",
            "\u043e\u043f\u0442\u0443\u043e\u0440\u0443\u043d\u043d\u044c\u0443\u043a",
            "\u0441\u044d\u0440\u044d\u0434\u044d",
            "\u0447\u044d\u043f\u043f\u0438\u044d\u0440",
            "\u0411\u044d\u044d\u0442\u0438\u04a5\u0441\u044d",
            "\u0441\u0443\u0431\u0443\u043e\u0442\u0430"
          ],
          ERANAMES: ["\u0431. \u044d. \u0438.", "\u0431. \u044d"],
          ERAS: ["\u0431. \u044d. \u0438.", "\u0431. \u044d"],
          FIRSTDAYOFWEEK: 0,
          MONTH: [
            "\u0422\u043e\u0445\u0441\u0443\u043d\u043d\u044c\u0443",
            "\u041e\u043b\u0443\u043d\u043d\u044c\u0443",
            "\u041a\u0443\u043b\u0443\u043d \u0442\u0443\u0442\u0430\u0440",
            "\u041c\u0443\u0443\u0441 \u0443\u0441\u0442\u0430\u0440",
            "\u042b\u0430\u043c \u044b\u0439\u044b\u043d",
            "\u0411\u044d\u0441 \u044b\u0439\u044b\u043d",
            "\u041e\u0442 \u044b\u0439\u044b\u043d",
            "\u0410\u0442\u044b\u0440\u0434\u044c\u044b\u0445 \u044b\u0439\u044b\u043d",
            "\u0411\u0430\u043b\u0430\u0495\u0430\u043d \u044b\u0439\u044b\u043d",
            "\u0410\u043b\u0442\u044b\u043d\u043d\u044c\u044b",
            "\u0421\u044d\u0442\u0438\u043d\u043d\u044c\u0438",
            "\u0430\u0445\u0441\u044b\u043d\u043d\u044c\u044b"
          ],
          SHORTDAY: ["\u0431\u0441", "\u0431\u043d", "\u043e\u043f", "\u0441\u044d", "\u0447\u043f", "\u0431\u044d", "\u0441\u0431"],
          SHORTMONTH: [
            "\u0422\u043e\u0445\u0441",
            "\u041e\u043b\u0443\u043d",
            "\u041a\u043b\u043d",
            "\u041c\u0441\u0443",
            "\u042b\u0430\u043c",
            "\u0411\u044d\u0441",
            "\u041e\u0442\u0439",
            "\u0410\u0442\u0440",
            "\u0411\u043b\u0495",
            "\u0410\u043b\u0442",
            "\u0421\u044d\u0442",
            "\u0410\u0445\u0441"
          ],
          STANDALONEMONTH: [
            "\u0442\u043e\u0445\u0441\u0443\u043d\u043d\u044c\u0443",
            "\u043e\u043b\u0443\u043d\u043d\u044c\u0443",
            "\u043a\u0443\u043b\u0443\u043d \u0442\u0443\u0442\u0430\u0440",
            "\u043c\u0443\u0443\u0441 \u0443\u0441\u0442\u0430\u0440",
            "\u044b\u0430\u043c \u044b\u0439\u0430",
            "\u0431\u044d\u0441 \u044b\u0439\u0430",
            "\u043e\u0442 \u044b\u0439\u0430",
            "\u0430\u0442\u044b\u0440\u0434\u044c\u044b\u0445 \u044b\u0439\u0430",
            "\u0431\u0430\u043b\u0430\u0495\u0430\u043d \u044b\u0439\u0430",
            "\u0430\u043b\u0442\u044b\u043d\u043d\u044c\u044b",
            "\u0441\u044d\u0442\u0438\u043d\u043d\u044c\u0438",
            "\u0430\u0445\u0441\u044b\u043d\u043d\u044c\u044b"
          ],
          WEEKENDRANGE: [5, 6],
          fullDate: "y '\u0441\u044b\u043b' MMMM d '\u043a\u04af\u043d\u044d', EEEE",
          longDate: "y, MMMM d",
          medium: "y, MMM d HH:mm:ss",
          mediumDate: "y, MMM d",
          mediumTime: "HH:mm:ss",
          short: "yy/M/d HH:mm",
          shortDate: "yy/M/d",
          shortTime: "HH:mm"
        },
        NUMBER_FORMATS: {
          CURRENCY_SYM: "\u20bd",
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
        id: "sah-ru",
        localeID: "sah_RU",
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
