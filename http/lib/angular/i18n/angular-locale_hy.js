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
          DAY: [
            "\u056f\u056b\u0580\u0561\u056f\u056b",
            "\u0565\u0580\u056f\u0578\u0582\u0577\u0561\u0562\u0569\u056b",
            "\u0565\u0580\u0565\u0584\u0577\u0561\u0562\u0569\u056b",
            "\u0579\u0578\u0580\u0565\u0584\u0577\u0561\u0562\u0569\u056b",
            "\u0570\u056b\u0576\u0563\u0577\u0561\u0562\u0569\u056b",
            "\u0578\u0582\u0580\u0562\u0561\u0569",
            "\u0577\u0561\u0562\u0561\u0569"
          ],
          ERANAMES: [
            "\u0554\u0580\u056b\u057d\u057f\u0578\u057d\u056b\u0581 \u0561\u057c\u0561\u057b",
            "\u0554\u0580\u056b\u057d\u057f\u0578\u057d\u056b\u0581 \u0570\u0565\u057f\u0578"
          ],
          ERAS: ["\u0574.\u0569.\u0561.", "\u0574.\u0569."],
          FIRSTDAYOFWEEK: 0,
          MONTH: [
            "\u0570\u0578\u0582\u0576\u057e\u0561\u0580\u056b",
            "\u0583\u0565\u057f\u0580\u057e\u0561\u0580\u056b",
            "\u0574\u0561\u0580\u057f\u056b",
            "\u0561\u057a\u0580\u056b\u056c\u056b",
            "\u0574\u0561\u0575\u056b\u057d\u056b",
            "\u0570\u0578\u0582\u0576\u056b\u057d\u056b",
            "\u0570\u0578\u0582\u056c\u056b\u057d\u056b",
            "\u0585\u0563\u0578\u057d\u057f\u0578\u057d\u056b",
            "\u057d\u0565\u057a\u057f\u0565\u0574\u0562\u0565\u0580\u056b",
            "\u0570\u0578\u056f\u057f\u0565\u0574\u0562\u0565\u0580\u056b",
            "\u0576\u0578\u0575\u0565\u0574\u0562\u0565\u0580\u056b",
            "\u0564\u0565\u056f\u057f\u0565\u0574\u0562\u0565\u0580\u056b"
          ],
          SHORTDAY: ["\u056f\u056b\u0580", "\u0565\u0580\u056f", "\u0565\u0580\u0584", "\u0579\u0580\u0584", "\u0570\u0576\u0563", "\u0578\u0582\u0580", "\u0577\u0562\u0569"],
          SHORTMONTH: [
            "\u0570\u0576\u057e",
            "\u0583\u057f\u057e",
            "\u0574\u0580\u057f",
            "\u0561\u057a\u0580",
            "\u0574\u0575\u057d",
            "\u0570\u0576\u057d",
            "\u0570\u056c\u057d",
            "\u0585\u0563\u057d",
            "\u057d\u0565\u057a",
            "\u0570\u0578\u056f",
            "\u0576\u0578\u0575",
            "\u0564\u0565\u056f"
          ],
          STANDALONEMONTH: [
            "\u0570\u0578\u0582\u0576\u057e\u0561\u0580",
            "\u0583\u0565\u057f\u0580\u057e\u0561\u0580",
            "\u0574\u0561\u0580\u057f",
            "\u0561\u057a\u0580\u056b\u056c",
            "\u0574\u0561\u0575\u056b\u057d",
            "\u0570\u0578\u0582\u0576\u056b\u057d",
            "\u0570\u0578\u0582\u056c\u056b\u057d",
            "\u0585\u0563\u0578\u057d\u057f\u0578\u057d",
            "\u057d\u0565\u057a\u057f\u0565\u0574\u0562\u0565\u0580",
            "\u0570\u0578\u056f\u057f\u0565\u0574\u0562\u0565\u0580",
            "\u0576\u0578\u0575\u0565\u0574\u0562\u0565\u0580",
            "\u0564\u0565\u056f\u057f\u0565\u0574\u0562\u0565\u0580"
          ],
          WEEKENDRANGE: [5, 6],
          fullDate: "y \u0569. MMMM d, EEEE",
          longDate: "dd MMMM, y \u0569.",
          medium: "dd MMM, y \u0569. HH:mm:ss",
          mediumDate: "dd MMM, y \u0569.",
          mediumTime: "HH:mm:ss",
          short: "dd.MM.yy HH:mm",
          shortDate: "dd.MM.yy",
          shortTime: "HH:mm"
        },
        NUMBER_FORMATS: {
          CURRENCY_SYM: "Dram",
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
              negPre: "-\u00a4\u00a0",
              negSuf: "",
              posPre: "\u00a4\u00a0",
              posSuf: ""
            }
          ]
        },
        id: "hy",
        localeID: "hy",
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
