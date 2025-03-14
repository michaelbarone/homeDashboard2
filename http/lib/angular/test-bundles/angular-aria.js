/**
 * @license AngularJS v1.7.8
 * (c) 2010-2018 Google, Inc. http://angularjs.org
 * License: MIT
 */
(function (window, angular) {
  "use strict";

  /**
   * @ngdoc module
   * @name ngAria
   * @description
   *
   * The `ngAria` module provides support for common
   * [<abbr title="Accessible Rich Internet Applications">ARIA</abbr>](http://www.w3.org/TR/wai-aria/)
   * attributes that convey state or semantic information about the application for users
   * of assistive technologies, such as screen readers.
   *
   * ## Usage
   *
   * For ngAria to do its magic, simply include the module `ngAria` as a dependency. The following
   * directives are supported:
   * `ngModel`, `ngChecked`, `ngReadonly`, `ngRequired`, `ngValue`, `ngDisabled`, `ngShow`, `ngHide`,
   * `ngClick`, `ngDblClick`, and `ngMessages`.
   *
   * Below is a more detailed breakdown of the attributes handled by ngAria:
   *
   * | Directive                                   | Supported Attributes                                                                                |
   * |---------------------------------------------|-----------------------------------------------------------------------------------------------------|
   * | {@link ng.directive:ngModel ngModel}        | aria-checked, aria-valuemin, aria-valuemax, aria-valuenow, aria-invalid, aria-required, input roles |
   * | {@link ng.directive:ngDisabled ngDisabled}  | aria-disabled                                                                                       |
   * | {@link ng.directive:ngRequired ngRequired}  | aria-required                                                                                       |
   * | {@link ng.directive:ngChecked ngChecked}    | aria-checked                                                                                        |
   * | {@link ng.directive:ngReadonly ngReadonly}  | aria-readonly                                                                                       |
   * | {@link ng.directive:ngValue ngValue}        | aria-checked                                                                                        |
   * | {@link ng.directive:ngShow ngShow}          | aria-hidden                                                                                         |
   * | {@link ng.directive:ngHide ngHide}          | aria-hidden                                                                                         |
   * | {@link ng.directive:ngDblclick ngDblclick}  | tabindex                                                                                            |
   * | {@link module:ngMessages ngMessages}        | aria-live                                                                                           |
   * | {@link ng.directive:ngClick ngClick}        | tabindex, keydown event, button role                                                                |
   *
   * Find out more information about each directive by reading the
   * {@link guide/accessibility ngAria Developer Guide}.
   *
   * ## Example
   * Using ngDisabled with ngAria:
   * ```html
   * <md-checkbox ng-disabled="disabled">
   * ```
   * Becomes:
   * ```html
   * <md-checkbox ng-disabled="disabled" aria-disabled="true">
   * ```
   *
   * ## Disabling Specific Attributes
   * It is possible to disable individual attributes added by ngAria with the
   * {@link ngAria.$ariaProvider#config config} method. For more details, see the
   * {@link guide/accessibility Developer Guide}.
   *
   * ## Disabling `ngAria` on Specific Elements
   * It is possible to make `ngAria` ignore a specific element, by adding the `ng-aria-disable`
   * attribute on it. Note that only the element itself (and not its child elements) will be ignored.
   */
  var ARIA_DISABLE_ATTR = "ngAriaDisable";

  var ngAriaModule = angular.module("ngAria", ["ng"]).info({ angularVersion: "1.7.8" }).provider("$aria", $AriaProvider);

  /**
   * Internal Utilities
   */
  var nodeBlackList = ["BUTTON", "A", "INPUT", "TEXTAREA", "SELECT", "DETAILS", "SUMMARY"];

  var isNodeOneOf = function (elem, nodeTypeArray) {
    if (nodeTypeArray.indexOf(elem[0].nodeName) !== -1) {
      return true;
    }
  };
  /**
   * @ngdoc provider
   * @name $ariaProvider
   * @this
   *
   * @description
   *
   * Used for configuring the ARIA attributes injected and managed by ngAria.
   *
   * ```js
   * angular.module('myApp', ['ngAria'], function config($ariaProvider) {
   *   $ariaProvider.config({
   *     ariaValue: true,
   *     tabindex: false
   *   });
   * });
   *```
   *
   * ## Dependencies
   * Requires the {@link ngAria} module to be installed.
   *
   */
  function $AriaProvider() {
    var config = {
      ariaHidden: true,
      ariaChecked: true,
      ariaReadonly: true,
      ariaDisabled: true,
      ariaRequired: true,
      ariaInvalid: true,
      ariaValue: true,
      tabindex: true,
      bindKeydown: true,
      bindRoleForClick: true
    };

    /**
     * @ngdoc method
     * @name $ariaProvider#config
     *
     * @param {object} config object to enable/disable specific ARIA attributes
     *
     *  - **ariaHidden** – `{boolean}` – Enables/disables aria-hidden tags
     *  - **ariaChecked** – `{boolean}` – Enables/disables aria-checked tags
     *  - **ariaReadonly** – `{boolean}` – Enables/disables aria-readonly tags
     *  - **ariaDisabled** – `{boolean}` – Enables/disables aria-disabled tags
     *  - **ariaRequired** – `{boolean}` – Enables/disables aria-required tags
     *  - **ariaInvalid** – `{boolean}` – Enables/disables aria-invalid tags
     *  - **ariaValue** – `{boolean}` – Enables/disables aria-valuemin, aria-valuemax and
     *    aria-valuenow tags
     *  - **tabindex** – `{boolean}` – Enables/disables tabindex tags
     *  - **bindKeydown** – `{boolean}` – Enables/disables keyboard event binding on non-interactive
     *    elements (such as `div` or `li`) using ng-click, making them more accessible to users of
     *    assistive technologies
     *  - **bindRoleForClick** – `{boolean}` – Adds role=button to non-interactive elements (such as
     *    `div` or `li`) using ng-click, making them more accessible to users of assistive
     *    technologies
     *
     * @description
     * Enables/disables various ARIA attributes
     */
    this.config = function (newConfig) {
      config = angular.extend(config, newConfig);
    };

    function watchExpr(attrName, ariaAttr, nodeBlackList, negate) {
      return function (scope, elem, attr) {
        if (attr.hasOwnProperty(ARIA_DISABLE_ATTR)) return;

        var ariaCamelName = attr.$normalize(ariaAttr);
        if (config[ariaCamelName] && !isNodeOneOf(elem, nodeBlackList) && !attr[ariaCamelName]) {
          scope.$watch(attr[attrName], function (boolVal) {
            // ensure boolean value
            boolVal = negate ? !boolVal : !!boolVal;
            elem.attr(ariaAttr, boolVal);
          });
        }
      };
    }
    /**
     * @ngdoc service
     * @name $aria
     *
     * @description
     * @priority 200
     *
     * The $aria service contains helper methods for applying common
     * [ARIA](http://www.w3.org/TR/wai-aria/) attributes to HTML directives.
     *
     * ngAria injects common accessibility attributes that tell assistive technologies when HTML
     * elements are enabled, selected, hidden, and more. To see how this is performed with ngAria,
     * let's review a code snippet from ngAria itself:
     *
     *```js
     * ngAriaModule.directive('ngDisabled', ['$aria', function($aria) {
     *   return $aria.$$watchExpr('ngDisabled', 'aria-disabled', nodeBlackList, false);
     * }])
     *```
     * Shown above, the ngAria module creates a directive with the same signature as the
     * traditional `ng-disabled` directive. But this ngAria version is dedicated to
     * solely managing accessibility attributes on custom elements. The internal `$aria` service is
     * used to watch the boolean attribute `ngDisabled`. If it has not been explicitly set by the
     * developer, `aria-disabled` is injected as an attribute with its value synchronized to the
     * value in `ngDisabled`.
     *
     * Because ngAria hooks into the `ng-disabled` directive, developers do not have to do
     * anything to enable this feature. The `aria-disabled` attribute is automatically managed
     * simply as a silent side-effect of using `ng-disabled` with the ngAria module.
     *
     * The full list of directives that interface with ngAria:
     * * **ngModel**
     * * **ngChecked**
     * * **ngReadonly**
     * * **ngRequired**
     * * **ngDisabled**
     * * **ngValue**
     * * **ngShow**
     * * **ngHide**
     * * **ngClick**
     * * **ngDblclick**
     * * **ngMessages**
     *
     * Read the {@link guide/accessibility ngAria Developer Guide} for a thorough explanation of each
     * directive.
     *
     *
     * ## Dependencies
     * Requires the {@link ngAria} module to be installed.
     */
    this.$get = function () {
      return {
        config: function (key) {
          return config[key];
        },
        $$watchExpr: watchExpr
      };
    };
  }

  ngAriaModule
    .directive("ngShow", [
      "$aria",
      function ($aria) {
        return $aria.$$watchExpr("ngShow", "aria-hidden", [], true);
      }
    ])
    .directive("ngHide", [
      "$aria",
      function ($aria) {
        return $aria.$$watchExpr("ngHide", "aria-hidden", [], false);
      }
    ])
    .directive("ngValue", [
      "$aria",
      function ($aria) {
        return $aria.$$watchExpr("ngValue", "aria-checked", nodeBlackList, false);
      }
    ])
    .directive("ngChecked", [
      "$aria",
      function ($aria) {
        return $aria.$$watchExpr("ngChecked", "aria-checked", nodeBlackList, false);
      }
    ])
    .directive("ngReadonly", [
      "$aria",
      function ($aria) {
        return $aria.$$watchExpr("ngReadonly", "aria-readonly", nodeBlackList, false);
      }
    ])
    .directive("ngRequired", [
      "$aria",
      function ($aria) {
        return $aria.$$watchExpr("ngRequired", "aria-required", nodeBlackList, false);
      }
    ])
    .directive("ngModel", [
      "$aria",
      function ($aria) {
        function shouldAttachAttr(attr, normalizedAttr, elem, allowBlacklistEls) {
          return (
            $aria.config(normalizedAttr) &&
            !elem.attr(attr) &&
            (allowBlacklistEls || !isNodeOneOf(elem, nodeBlackList)) &&
            (elem.attr("type") !== "hidden" || elem[0].nodeName !== "INPUT")
          );
        }

        function shouldAttachRole(role, elem) {
          // if element does not have role attribute
          // AND element type is equal to role (if custom element has a type equaling shape) <-- remove?
          // AND element is not in nodeBlackList
          return !elem.attr("role") && elem.attr("type") === role && !isNodeOneOf(elem, nodeBlackList);
        }

        function getShape(attr, elem) {
          var type = attr.type,
            role = attr.role;

          return (type || role) === "checkbox" || role === "menuitemcheckbox"
            ? "checkbox"
            : (type || role) === "radio" || role === "menuitemradio"
            ? "radio"
            : type === "range" || role === "progressbar" || role === "slider"
            ? "range"
            : "";
        }

        return {
          restrict: "A",
          require: "ngModel",
          priority: 200, //Make sure watches are fired after any other directives that affect the ngModel value
          compile: function (elem, attr) {
            if (attr.hasOwnProperty(ARIA_DISABLE_ATTR)) return;

            var shape = getShape(attr, elem);

            return {
              post: function (scope, elem, attr, ngModel) {
                var needsTabIndex = shouldAttachAttr("tabindex", "tabindex", elem, false);

                function ngAriaWatchModelValue() {
                  return ngModel.$modelValue;
                }

                function getRadioReaction(newVal) {
                  // Strict comparison would cause a BC
                  // eslint-disable-next-line eqeqeq
                  var boolVal = attr.value == ngModel.$viewValue;
                  elem.attr("aria-checked", boolVal);
                }

                function getCheckboxReaction() {
                  elem.attr("aria-checked", !ngModel.$isEmpty(ngModel.$viewValue));
                }

                switch (shape) {
                  case "radio":
                  case "checkbox":
                    if (shouldAttachRole(shape, elem)) {
                      elem.attr("role", shape);
                    }
                    if (shouldAttachAttr("aria-checked", "ariaChecked", elem, false)) {
                      scope.$watch(ngAriaWatchModelValue, shape === "radio" ? getRadioReaction : getCheckboxReaction);
                    }
                    if (needsTabIndex) {
                      elem.attr("tabindex", 0);
                    }
                    break;
                  case "range":
                    if (shouldAttachRole(shape, elem)) {
                      elem.attr("role", "slider");
                    }
                    if ($aria.config("ariaValue")) {
                      var needsAriaValuemin = !elem.attr("aria-valuemin") && (attr.hasOwnProperty("min") || attr.hasOwnProperty("ngMin"));
                      var needsAriaValuemax = !elem.attr("aria-valuemax") && (attr.hasOwnProperty("max") || attr.hasOwnProperty("ngMax"));
                      var needsAriaValuenow = !elem.attr("aria-valuenow");

                      if (needsAriaValuemin) {
                        attr.$observe("min", function ngAriaValueMinReaction(newVal) {
                          elem.attr("aria-valuemin", newVal);
                        });
                      }
                      if (needsAriaValuemax) {
                        attr.$observe("max", function ngAriaValueMinReaction(newVal) {
                          elem.attr("aria-valuemax", newVal);
                        });
                      }
                      if (needsAriaValuenow) {
                        scope.$watch(ngAriaWatchModelValue, function ngAriaValueNowReaction(newVal) {
                          elem.attr("aria-valuenow", newVal);
                        });
                      }
                    }
                    if (needsTabIndex) {
                      elem.attr("tabindex", 0);
                    }
                    break;
                }

                if (!attr.hasOwnProperty("ngRequired") && ngModel.$validators.required && shouldAttachAttr("aria-required", "ariaRequired", elem, false)) {
                  // ngModel.$error.required is undefined on custom controls
                  attr.$observe("required", function () {
                    elem.attr("aria-required", !!attr["required"]);
                  });
                }

                if (shouldAttachAttr("aria-invalid", "ariaInvalid", elem, true)) {
                  scope.$watch(
                    function ngAriaInvalidWatch() {
                      return ngModel.$invalid;
                    },
                    function ngAriaInvalidReaction(newVal) {
                      elem.attr("aria-invalid", !!newVal);
                    }
                  );
                }
              }
            };
          }
        };
      }
    ])
    .directive("ngDisabled", [
      "$aria",
      function ($aria) {
        return $aria.$$watchExpr("ngDisabled", "aria-disabled", nodeBlackList, false);
      }
    ])
    .directive("ngMessages", function () {
      return {
        restrict: "A",
        require: "?ngMessages",
        link: function (scope, elem, attr, ngMessages) {
          if (attr.hasOwnProperty(ARIA_DISABLE_ATTR)) return;

          if (!elem.attr("aria-live")) {
            elem.attr("aria-live", "assertive");
          }
        }
      };
    })
    .directive("ngClick", [
      "$aria",
      "$parse",
      function ($aria, $parse) {
        return {
          restrict: "A",
          compile: function (elem, attr) {
            if (attr.hasOwnProperty(ARIA_DISABLE_ATTR)) return;

            var fn = $parse(attr.ngClick);
            return function (scope, elem, attr) {
              if (!isNodeOneOf(elem, nodeBlackList)) {
                if ($aria.config("bindRoleForClick") && !elem.attr("role")) {
                  elem.attr("role", "button");
                }

                if ($aria.config("tabindex") && !elem.attr("tabindex")) {
                  elem.attr("tabindex", 0);
                }

                if ($aria.config("bindKeydown") && !attr.ngKeydown && !attr.ngKeypress && !attr.ngKeyup) {
                  elem.on("keydown", function (event) {
                    var keyCode = event.which || event.keyCode;

                    if (keyCode === 13 || keyCode === 32) {
                      // If the event is triggered on a non-interactive element ...
                      if (nodeBlackList.indexOf(event.target.nodeName) === -1 && !event.target.isContentEditable) {
                        // ... prevent the default browser behavior (e.g. scrolling when pressing spacebar)
                        // See https://github.com/angular/angular.js/issues/16664
                        event.preventDefault();
                      }
                      scope.$apply(callback);
                    }

                    function callback() {
                      fn(scope, { $event: event });
                    }
                  });
                }
              }
            };
          }
        };
      }
    ])
    .directive("ngDblclick", [
      "$aria",
      function ($aria) {
        return function (scope, elem, attr) {
          if (attr.hasOwnProperty(ARIA_DISABLE_ATTR)) return;

          if ($aria.config("tabindex") && !elem.attr("tabindex") && !isNodeOneOf(elem, nodeBlackList)) {
            elem.attr("tabindex", 0);
          }
        };
      }
    ]);

  /* globals nodeBlackList false */

  describe("$aria", function () {
    var scope, $compile, element;

    beforeEach(module("ngAria"));

    afterEach(function () {
      dealoc(element);
    });

    describe("with `ngAriaDisable`", function () {
      beforeEach(injectScopeAndCompiler);
      beforeEach(function () {
        jasmine.addMatchers({
          toHaveAttribute: function toHaveAttributeMatcher() {
            return {
              compare: function toHaveAttributeCompare(element, attr) {
                var node = element[0];
                var pass = node.hasAttribute(attr);
                var message = "Expected `" + node.outerHTML + "` " + (pass ? "not " : "") + "to have attribute `" + attr + "`.";

                return {
                  pass: pass,
                  message: message
                };
              }
            };
          }
        });
      });

      // ariaChecked
      it("should not attach aria-checked to custom checkbox", function () {
        compileElement('<div role="checkbox" ng-model="val" ng-aria-disable></div>');

        scope.$apply("val = false");
        expect(element).not.toHaveAttribute("aria-checked");

        scope.$apply("val = true");
        expect(element).not.toHaveAttribute("aria-checked");
      });

      it("should not attach aria-checked to custom radio controls", function () {
        compileElement('<div role="radio" ng-model="val" value="one" ng-aria-disable></div>' + '<div role="radio" ng-model="val" value="two" ng-aria-disable></div>');

        var radio1 = element.eq(0);
        var radio2 = element.eq(1);

        scope.$apply('val = "one"');
        expect(radio1).not.toHaveAttribute("aria-checked");
        expect(radio2).not.toHaveAttribute("aria-checked");

        scope.$apply('val = "two"');
        expect(radio1).not.toHaveAttribute("aria-checked");
        expect(radio2).not.toHaveAttribute("aria-checked");
      });

      // ariaDisabled
      it("should not attach aria-disabled to custom controls", function () {
        compileElement('<div ng-disabled="val" ng-aria-disable></div>');

        scope.$apply("val = false");
        expect(element).not.toHaveAttribute("aria-disabled");

        scope.$apply("val = true");
        expect(element).not.toHaveAttribute("aria-disabled");
      });

      // ariaHidden
      it("should not attach aria-hidden to `ngShow`", function () {
        compileElement('<div ng-show="val" ng-aria-disable></div>');

        scope.$apply("val = false");
        expect(element).not.toHaveAttribute("aria-hidden");

        scope.$apply("val = true");
        expect(element).not.toHaveAttribute("aria-hidden");
      });

      it("should not attach aria-hidden to `ngHide`", function () {
        compileElement('<div ng-hide="val" ng-aria-disable></div>');

        scope.$apply("val = false");
        expect(element).not.toHaveAttribute("aria-hidden");

        scope.$apply("val = true");
        expect(element).not.toHaveAttribute("aria-hidden");
      });

      // ariaInvalid
      it("should not attach aria-invalid to input", function () {
        compileElement('<input ng-model="val" ng-minlength="10" ng-aria-disable />');

        scope.$apply('val = "lt 10"');
        expect(element).not.toHaveAttribute("aria-invalid");

        scope.$apply('val = "gt 10 characters"');
        expect(element).not.toHaveAttribute("aria-invalid");
      });

      it("should not attach aria-invalid to custom controls", function () {
        compileElement('<div role="textbox" ng-model="val" ng-minlength="10" ng-aria-disable></div>');

        scope.$apply('val = "lt 10"');
        expect(element).not.toHaveAttribute("aria-invalid");

        scope.$apply('val = "gt 10 characters"');
        expect(element).not.toHaveAttribute("aria-invalid");
      });

      // ariaLive
      it("should not attach aria-live to `ngMessages`", function () {
        compileElement('<div ng-messages="val" ng-aria-disable>');
        expect(element).not.toHaveAttribute("aria-live");
      });

      // ariaReadonly
      it("should not attach aria-readonly to custom controls", function () {
        compileElement('<div ng-readonly="val" ng-aria-disable></div>');

        scope.$apply("val = false");
        expect(element).not.toHaveAttribute("aria-readonly");

        scope.$apply("val = true");
        expect(element).not.toHaveAttribute("aria-readonly");
      });

      // ariaRequired
      it("should not attach aria-required to custom controls with `required`", function () {
        compileElement('<div ng-model="val" required ng-aria-disable></div>');
        expect(element).not.toHaveAttribute("aria-required");
      });

      it("should not attach aria-required to custom controls with `ngRequired`", function () {
        compileElement('<div ng-model="val" ng-required="val" ng-aria-disable></div>');

        scope.$apply("val = false");
        expect(element).not.toHaveAttribute("aria-required");

        scope.$apply("val = true");
        expect(element).not.toHaveAttribute("aria-required");
      });

      // ariaValue
      it("should not attach aria-value* to input[range]", function () {
        compileElement('<input type="range" ng-model="val" min="0" max="100" ng-aria-disable />');

        expect(element).not.toHaveAttribute("aria-valuemax");
        expect(element).not.toHaveAttribute("aria-valuemin");
        expect(element).not.toHaveAttribute("aria-valuenow");

        scope.$apply("val = 50");
        expect(element).not.toHaveAttribute("aria-valuemax");
        expect(element).not.toHaveAttribute("aria-valuemin");
        expect(element).not.toHaveAttribute("aria-valuenow");

        scope.$apply("val = 150");
        expect(element).not.toHaveAttribute("aria-valuemax");
        expect(element).not.toHaveAttribute("aria-valuemin");
        expect(element).not.toHaveAttribute("aria-valuenow");
      });

      it("should not attach aria-value* to custom controls", function () {
        compileElement(
          '<div role="progressbar" ng-model="val" min="0" max="100" ng-aria-disable></div>' + '<div role="slider" ng-model="val" min="0" max="100" ng-aria-disable></div>'
        );

        var progressbar = element.eq(0);
        var slider = element.eq(1);

        ["aria-valuemax", "aria-valuemin", "aria-valuenow"].forEach(function (attr) {
          expect(progressbar).not.toHaveAttribute(attr);
          expect(slider).not.toHaveAttribute(attr);
        });

        scope.$apply("val = 50");
        ["aria-valuemax", "aria-valuemin", "aria-valuenow"].forEach(function (attr) {
          expect(progressbar).not.toHaveAttribute(attr);
          expect(slider).not.toHaveAttribute(attr);
        });

        scope.$apply("val = 150");
        ["aria-valuemax", "aria-valuemin", "aria-valuenow"].forEach(function (attr) {
          expect(progressbar).not.toHaveAttribute(attr);
          expect(slider).not.toHaveAttribute(attr);
        });
      });

      // bindKeypress
      it("should not bind keypress to `ngClick`", function () {
        scope.onClick = jasmine.createSpy("onClick");
        compileElement('<div ng-click="onClick()" tabindex="0" ng-aria-disable></div>' + '<ul><li ng-click="onClick()" tabindex="0" ng-aria-disable></li></ul>');

        var div = element.find("div");
        var li = element.find("li");

        div.triggerHandler({ type: "keypress", keyCode: 32 });
        li.triggerHandler({ type: "keypress", keyCode: 32 });

        expect(scope.onClick).not.toHaveBeenCalled();
      });

      // bindRoleForClick
      it("should not attach role to custom controls", function () {
        compileElement(
          '<div ng-click="onClick()" ng-aria-disable></div>' +
            '<div type="checkbox" ng-model="val" ng-aria-disable></div>' +
            '<div type="radio" ng-model="val" ng-aria-disable></div>' +
            '<div type="range" ng-model="val" ng-aria-disable></div>'
        );

        expect(element.eq(0)).not.toHaveAttribute("role");
        expect(element.eq(1)).not.toHaveAttribute("role");
        expect(element.eq(2)).not.toHaveAttribute("role");
        expect(element.eq(3)).not.toHaveAttribute("role");
      });

      // tabindex
      it("should not attach tabindex to custom controls", function () {
        compileElement('<div role="checkbox" ng-model="val" ng-aria-disable></div>' + '<div role="slider" ng-model="val" ng-aria-disable></div>');

        expect(element.eq(0)).not.toHaveAttribute("tabindex");
        expect(element.eq(1)).not.toHaveAttribute("tabindex");
      });

      it("should not attach tabindex to `ngClick` or `ngDblclick`", function () {
        compileElement('<div ng-click="onClick()" ng-aria-disable></div>' + '<div ng-dblclick="onDblclick()" ng-aria-disable></div>');

        expect(element.eq(0)).not.toHaveAttribute("tabindex");
        expect(element.eq(1)).not.toHaveAttribute("tabindex");
      });
    });

    describe("aria-hidden", function () {
      beforeEach(injectScopeAndCompiler);

      it("should attach aria-hidden to ng-show", function () {
        compileElement('<div ng-show="val"></div>');
        scope.$apply("val = false");
        expect(element.attr("aria-hidden")).toBe("true");

        scope.$apply("val = true");
        expect(element.attr("aria-hidden")).toBe("false");
      });

      it("should attach aria-hidden to ng-hide", function () {
        compileElement('<div ng-hide="val"></div>');
        scope.$apply("val = false");
        expect(element.attr("aria-hidden")).toBe("false");

        scope.$apply("val = true");
        expect(element.attr("aria-hidden")).toBe("true");
      });

      it("should not change aria-hidden if it is already present on ng-show", function () {
        compileElement('<div ng-show="val" aria-hidden="userSetValue"></div>');
        expect(element.attr("aria-hidden")).toBe("userSetValue");

        scope.$apply("val = true");
        expect(element.attr("aria-hidden")).toBe("userSetValue");
      });

      it("should not change aria-hidden if it is already present on ng-hide", function () {
        compileElement('<div ng-hide="val" aria-hidden="userSetValue"></div>');
        expect(element.attr("aria-hidden")).toBe("userSetValue");

        scope.$apply("val = true");
        expect(element.attr("aria-hidden")).toBe("userSetValue");
      });

      it("should always set aria-hidden to a boolean value", function () {
        compileElement('<div ng-hide="val"></div>');

        scope.$apply('val = "test angular"');
        expect(element.attr("aria-hidden")).toBe("true");

        scope.$apply("val = null");
        expect(element.attr("aria-hidden")).toBe("false");

        scope.$apply("val = {}");
        expect(element.attr("aria-hidden")).toBe("true");

        compileElement('<div ng-show="val"></div>');

        scope.$apply('val = "test angular"');
        expect(element.attr("aria-hidden")).toBe("false");

        scope.$apply("val = null");
        expect(element.attr("aria-hidden")).toBe("true");

        scope.$apply("val = {}");
        expect(element.attr("aria-hidden")).toBe("false");
      });
    });

    describe("aria-hidden when disabled", function () {
      beforeEach(
        configAriaProvider({
          ariaHidden: false
        })
      );
      beforeEach(injectScopeAndCompiler);

      it("should not attach aria-hidden", function () {
        scope.$apply("val = false");
        compileElement('<div ng-show="val"></div>');
        expect(element.attr("aria-hidden")).toBeUndefined();

        compileElement('<div ng-hide="val"></div>');
        expect(element.attr("aria-hidden")).toBeUndefined();
      });
    });

    describe("aria-checked", function () {
      beforeEach(injectScopeAndCompiler);

      it('should not attach itself to native input type="checkbox"', function () {
        compileElement('<input type="checkbox" ng-model="val">');

        scope.$apply("val = true");
        expect(element.attr("aria-checked")).toBeUndefined();

        scope.$apply("val = false");
        expect(element.attr("aria-checked")).toBeUndefined();
      });

      it("should attach itself to custom checkbox", function () {
        compileElement('<div role="checkbox" ng-model="val"></div>');

        scope.$apply('val = "checked"');
        expect(element.attr("aria-checked")).toBe("true");

        scope.$apply("val = null");
        expect(element.attr("aria-checked")).toBe("false");
      });

      it("should use `$isEmpty()` to determine if the checkbox is checked", function () {
        compileElement('<div role="checkbox" ng-model="val"></div>');
        var ctrl = element.controller("ngModel");
        ctrl.$isEmpty = function (value) {
          return value === "not-checked";
        };

        scope.$apply("val = true");
        expect(ctrl.$modelValue).toBe(true);
        expect(element.attr("aria-checked")).toBe("true");

        scope.$apply("val = false");
        expect(ctrl.$modelValue).toBe(false);
        expect(element.attr("aria-checked")).toBe("true");

        scope.$apply('val = "not-checked"');
        expect(ctrl.$modelValue).toBe("not-checked");
        expect(element.attr("aria-checked")).toBe("false");

        scope.$apply('val = "checked"');
        expect(ctrl.$modelValue).toBe("checked");
        expect(element.attr("aria-checked")).toBe("true");
      });

      it("should not handle native checkbox with ngChecked", function () {
        var element = $compile('<input type="checkbox" ng-checked="val">')(scope);

        scope.$apply("val = true");
        expect(element.attr("aria-checked")).toBeUndefined();

        scope.$apply("val = false");
        expect(element.attr("aria-checked")).toBeUndefined();
      });

      it("should handle custom checkbox with ngChecked", function () {
        var element = $compile('<div role="checkbox" ng-checked="val">')(scope);

        scope.$apply("val = true");
        expect(element.eq(0).attr("aria-checked")).toBe("true");

        scope.$apply("val = false");
        expect(element.eq(0).attr("aria-checked")).toBe("false");
      });

      it('should not attach to native input type="radio"', function () {
        var element = $compile('<input type="radio" ng-model="val" value="one">' + '<input type="radio" ng-model="val" value="two">')(scope);

        scope.$apply("val='one'");
        expect(element.eq(0).attr("aria-checked")).toBeUndefined();
        expect(element.eq(1).attr("aria-checked")).toBeUndefined();

        scope.$apply("val='two'");
        expect(element.eq(0).attr("aria-checked")).toBeUndefined();
        expect(element.eq(1).attr("aria-checked")).toBeUndefined();
      });

      it("should attach to custom radio controls", function () {
        var element = $compile('<div role="radio" ng-model="val" value="one"></div>' + '<div role="radio" ng-model="val" value="two"></div>')(scope);

        scope.$apply("val='one'");
        expect(element.eq(0).attr("aria-checked")).toBe("true");
        expect(element.eq(1).attr("aria-checked")).toBe("false");

        scope.$apply("val='two'");
        expect(element.eq(0).attr("aria-checked")).toBe("false");
        expect(element.eq(1).attr("aria-checked")).toBe("true");
      });

      it("should handle custom radios with integer model values", function () {
        var element = $compile('<div role="radio" ng-model="val" value="0"></div>' + '<div role="radio" ng-model="val" value="1"></div>')(scope);

        scope.$apply("val=0");
        expect(element.eq(0).attr("aria-checked")).toBe("true");
        expect(element.eq(1).attr("aria-checked")).toBe("false");

        scope.$apply("val=1");
        expect(element.eq(0).attr("aria-checked")).toBe("false");
        expect(element.eq(1).attr("aria-checked")).toBe("true");
      });

      it("should handle radios with boolean model values using ngValue", function () {
        var element = $compile('<div role="radio" ng-model="val" ng-value="valExp"></div>' + '<div role="radio" ng-model="val" ng-value="valExp2"></div>')(scope);

        scope.$apply(function () {
          scope.valExp = true;
          scope.valExp2 = false;
          scope.val = true;
        });
        expect(element.eq(0).attr("aria-checked")).toBe("true");
        expect(element.eq(1).attr("aria-checked")).toBe("false");

        scope.$apply("val = false");
        expect(element.eq(0).attr("aria-checked")).toBe("false");
        expect(element.eq(1).attr("aria-checked")).toBe("true");
      });

      it('should attach itself to role="menuitemradio"', function () {
        scope.val = "one";
        compileElement('<div role="menuitemradio" ng-model="val" value="one"></div>');
        expect(element.attr("aria-checked")).toBe("true");

        scope.$apply("val = 'two'");
        expect(element.attr("aria-checked")).toBe("false");
      });

      it('should attach itself to role="menuitemcheckbox"', function () {
        compileElement('<div role="menuitemcheckbox" ng-model="val"></div>');

        scope.$apply('val = "checked"');
        expect(element.attr("aria-checked")).toBe("true");

        scope.$apply("val = null");
        expect(element.attr("aria-checked")).toBe("false");
      });

      it("should not attach itself if an aria-checked value is already present", function () {
        var element = [
          $compile("<div role='radio' ng-model='val' value='{{val3}}' aria-checked='userSetValue'></div>")(scope),
          $compile("<div role='menuitemradio' ng-model='val' value='{{val3}}' aria-checked='userSetValue'></div>")(scope),
          $compile("<div role='checkbox' checked='checked' aria-checked='userSetValue'></div>")(scope),
          $compile("<div role='menuitemcheckbox' checked='checked' aria-checked='userSetValue'></div>")(scope)
        ];
        scope.$apply("val1=true;val2='one';val3='1'");
        expectAriaAttrOnEachElement(element, "aria-checked", "userSetValue");
      });
    });

    describe("roles for custom inputs", function () {
      beforeEach(injectScopeAndCompiler);

      it('should add missing role="button" to custom input', function () {
        compileElement('<div ng-click="someFunction()"></div>');
        expect(element.attr("role")).toBe("button");
      });

      it('should not add role="button" to anchor', function () {
        compileElement('<a ng-click="someFunction()"></a>');
        expect(element.attr("role")).not.toBe("button");
      });

      it('should add missing role="checkbox" to custom input', function () {
        compileElement('<div type="checkbox" ng-model="val"></div>');
        expect(element.attr("role")).toBe("checkbox");
      });

      it("should not add a role to a native checkbox", function () {
        compileElement('<input type="checkbox" ng-model="val"/>');
        expect(element.attr("role")).toBeUndefined();
      });

      it('should add missing role="radio" to custom input', function () {
        compileElement('<div type="radio" ng-model="val"></div>');
        expect(element.attr("role")).toBe("radio");
      });

      it("should not add a role to a native radio button", function () {
        compileElement('<input type="radio" ng-model="val"/>');
        expect(element.attr("role")).toBeUndefined();
      });

      it('should add missing role="slider" to custom input', function () {
        compileElement('<div type="range" ng-model="val"></div>');
        expect(element.attr("role")).toBe("slider");
      });

      it("should not add a role to a native range input", function () {
        compileElement('<input type="range" ng-model="val"/>');
        expect(element.attr("role")).toBeUndefined();
      });

      they(
        "should not add role to native $prop controls",
        {
          input: '<input type="text" ng-model="val">',
          select: '<select type="checkbox" ng-model="val"></select>',
          textarea: '<textarea type="checkbox" ng-model="val"></textarea>',
          button: '<button ng-click="doClick()"></button>',
          summary: '<summary ng-click="doClick()"></summary>',
          details: '<details ng-click="doClick()"></details>',
          a: '<a ng-click="doClick()"></a>'
        },
        function (tmpl) {
          var element = $compile(tmpl)(scope);
          expect(element.attr("role")).toBeUndefined();
        }
      );
    });

    describe("aria-checked when disabled", function () {
      beforeEach(
        configAriaProvider({
          ariaChecked: false
        })
      );
      beforeEach(injectScopeAndCompiler);

      it("should not attach aria-checked", function () {
        compileElement("<div role='radio' ng-model='val' value='{{val}}'></div>");
        expect(element.attr("aria-checked")).toBeUndefined();

        compileElement("<div role='menuitemradio' ng-model='val' value='{{val}}'></div>");
        expect(element.attr("aria-checked")).toBeUndefined();

        compileElement("<div role='checkbox' checked='checked'></div>");
        expect(element.attr("aria-checked")).toBeUndefined();

        compileElement("<div role='menuitemcheckbox' checked='checked'></div>");
        expect(element.attr("aria-checked")).toBeUndefined();
      });
    });

    describe("aria-disabled", function () {
      beforeEach(injectScopeAndCompiler);

      they(
        "should not attach itself to native $prop controls",
        {
          input: '<input ng-disabled="val">',
          textarea: '<textarea ng-disabled="val"></textarea>',
          select: '<select ng-disabled="val"></select>',
          button: '<button ng-disabled="val"></button>'
        },
        function (tmpl) {
          var element = $compile(tmpl)(scope);
          scope.$apply("val = true");

          expect(element.attr("disabled")).toBeDefined();
          expect(element.attr("aria-disabled")).toBeUndefined();
        }
      );

      it("should attach itself to custom controls", function () {
        compileElement('<div ng-disabled="val"></div>');
        expect(element.attr("aria-disabled")).toBe("false");

        scope.$apply("val = true");
        expect(element.attr("aria-disabled")).toBe("true");
      });

      it("should not attach itself if an aria-disabled attribute is already present", function () {
        compileElement('<div ng-disabled="val" aria-disabled="userSetValue"></div>');

        expect(element.attr("aria-disabled")).toBe("userSetValue");
      });

      it("should always set aria-disabled to a boolean value", function () {
        compileElement('<div ng-disabled="val"></div>');

        scope.$apply('val = "test angular"');
        expect(element.attr("aria-disabled")).toBe("true");

        scope.$apply("val = null");
        expect(element.attr("aria-disabled")).toBe("false");

        scope.$apply("val = {}");
        expect(element.attr("aria-disabled")).toBe("true");
      });
    });

    describe("aria-disabled when disabled", function () {
      beforeEach(
        configAriaProvider({
          ariaDisabled: false
        })
      );
      beforeEach(injectScopeAndCompiler);

      it("should not attach aria-disabled", function () {
        compileElement('<div ng-disabled="val"></div>');

        scope.$apply("val = true");
        expect(element.attr("aria-disabled")).toBeUndefined();
      });
    });

    describe("aria-invalid", function () {
      beforeEach(injectScopeAndCompiler);

      it("should attach aria-invalid to input", function () {
        compileElement('<input ng-model="txtInput" ng-minlength="10">');
        scope.$apply("txtInput='LTten'");
        expect(element.attr("aria-invalid")).toBe("true");

        scope.$apply("txtInput='morethantencharacters'");
        expect(element.attr("aria-invalid")).toBe("false");
      });

      it("should attach aria-invalid to custom controls", function () {
        compileElement('<div ng-model="txtInput" role="textbox" ng-minlength="10"></div>');
        scope.$apply("txtInput='LTten'");
        expect(element.attr("aria-invalid")).toBe("true");

        scope.$apply("txtInput='morethantencharacters'");
        expect(element.attr("aria-invalid")).toBe("false");
      });

      it("should not attach itself if aria-invalid is already present", function () {
        compileElement('<input ng-model="txtInput" ng-minlength="10" aria-invalid="userSetValue">');
        scope.$apply("txtInput='LTten'");
        expect(element.attr("aria-invalid")).toBe("userSetValue");
      });

      it('should not attach if input is type="hidden"', function () {
        compileElement('<input type="hidden" ng-model="txtInput">');
        expect(element.attr("aria-invalid")).toBeUndefined();
      });

      it('should attach aria-invalid to custom control that is type="hidden"', function () {
        compileElement('<div ng-model="txtInput" type="hidden" role="textbox" ng-minlength="10"></div>');
        scope.$apply("txtInput='LTten'");
        expect(element.attr("aria-invalid")).toBe("true");

        scope.$apply("txtInput='morethantencharacters'");
        expect(element.attr("aria-invalid")).toBe("false");
      });
    });

    describe("aria-invalid when disabled", function () {
      beforeEach(
        configAriaProvider({
          ariaInvalid: false
        })
      );
      beforeEach(injectScopeAndCompiler);

      it("should not attach aria-invalid if the option is disabled", function () {
        scope.$apply("txtInput='LTten'");
        compileElement('<input ng-model="txtInput" ng-minlength="10">');
        expect(element.attr("aria-invalid")).toBeUndefined();
      });
    });

    describe("aria-readonly", function () {
      beforeEach(injectScopeAndCompiler);

      they(
        "should not attach itself to native $prop controls",
        {
          input: '<input ng-readonly="val">',
          textarea: '<textarea ng-readonly="val"></textarea>',
          select: '<select ng-readonly="val"></select>',
          button: '<button ng-readonly="val"></button>'
        },
        function (tmpl) {
          var element = $compile(tmpl)(scope);
          scope.$apply("val = true");

          expect(element.attr("readonly")).toBeDefined();
          expect(element.attr("aria-readonly")).toBeUndefined();
        }
      );

      it("should attach itself to custom controls", function () {
        compileElement('<div ng-readonly="val"></div>');
        expect(element.attr("aria-readonly")).toBe("false");

        scope.$apply("val = true");
        expect(element.attr("aria-readonly")).toBe("true");
      });

      it("should not attach itself if an aria-readonly attribute is already present", function () {
        compileElement('<div ng-readonly="val" aria-readonly="userSetValue"></div>');

        expect(element.attr("aria-readonly")).toBe("userSetValue");
      });

      it("should always set aria-readonly to a boolean value", function () {
        compileElement('<div ng-readonly="val"></div>');

        scope.$apply('val = "test angular"');
        expect(element.attr("aria-readonly")).toBe("true");

        scope.$apply("val = null");
        expect(element.attr("aria-readonly")).toBe("false");

        scope.$apply("val = {}");
        expect(element.attr("aria-readonly")).toBe("true");
      });
    });

    describe("aria-readonly when disabled", function () {
      beforeEach(
        configAriaProvider({
          ariaReadonly: false
        })
      );
      beforeEach(injectScopeAndCompiler);

      it("should not add the aria-readonly attribute", function () {
        compileElement("<input ng-model='val' readonly>");
        expect(element.attr("aria-readonly")).toBeUndefined();

        compileElement("<div ng-model='val' ng-readonly='true'></div>");
        expect(element.attr("aria-readonly")).toBeUndefined();
      });
    });

    describe("aria-required", function () {
      beforeEach(injectScopeAndCompiler);

      it("should not attach to input", function () {
        compileElement('<input ng-model="val" required>');
        expect(element.attr("aria-required")).toBeUndefined();
      });

      it("should attach to custom controls with ngModel and required", function () {
        compileElement('<div ng-model="val" role="checkbox" required></div>');
        expect(element.attr("aria-required")).toBe("true");
      });

      it("should set aria-required to false when ng-required is false", function () {
        compileElement("<div role='checkbox' ng-required='false' ng-model='val'></div>");
        expect(element.attr("aria-required")).toBe("false");
      });

      it("should attach to custom controls with ngRequired", function () {
        compileElement('<div role="checkbox" ng-model="val" ng-required="true"></div>');
        expect(element.attr("aria-required")).toBe("true");
      });

      it("should not attach itself if aria-required is already present", function () {
        compileElement("<div role='checkbox' ng-model='val' ng-required='true' aria-required='userSetValue'></div>");
        expect(element.attr("aria-required")).toBe("userSetValue");
      });
    });

    describe("aria-required when disabled", function () {
      beforeEach(
        configAriaProvider({
          ariaRequired: false
        })
      );
      beforeEach(injectScopeAndCompiler);

      it("should not add the aria-required attribute", function () {
        compileElement("<input ng-model='val' required>");
        expect(element.attr("aria-required")).toBeUndefined();

        compileElement("<div ng-model='val' ng-required='true'></div>");
        expect(element.attr("aria-required")).toBeUndefined();
      });
    });

    describe("aria-value", function () {
      beforeEach(injectScopeAndCompiler);

      it('should attach to input type="range"', function () {
        var element = [
          $compile('<input type="range" ng-model="val" min="0" max="100">')(scope),
          $compile('<div role="progressbar" min="0" max="100" ng-model="val">')(scope),
          $compile('<div role="slider" min="0" max="100" ng-model="val">')(scope)
        ];

        scope.$apply("val = 50");
        expectAriaAttrOnEachElement(element, "aria-valuenow", "50");
        expectAriaAttrOnEachElement(element, "aria-valuemin", "0");
        expectAriaAttrOnEachElement(element, "aria-valuemax", "100");

        scope.$apply("val = 90");
        expectAriaAttrOnEachElement(element, "aria-valuenow", "90");
      });

      it("should not attach if aria-value* is already present", function () {
        var element = [
          $compile('<input type="range" ng-model="val" min="0" max="100" aria-valuenow="userSetValue1" aria-valuemin="userSetValue2" aria-valuemax="userSetValue3">')(scope),
          $compile('<div role="progressbar" min="0" max="100" ng-model="val" aria-valuenow="userSetValue1" aria-valuemin="userSetValue2" aria-valuemax="userSetValue3">')(
            scope
          ),
          $compile('<div role="slider" min="0" max="100" ng-model="val" aria-valuenow="userSetValue1" aria-valuemin="userSetValue2" aria-valuemax="userSetValue3">')(scope)
        ];

        scope.$apply("val = 50");
        expectAriaAttrOnEachElement(element, "aria-valuenow", "userSetValue1");
        expectAriaAttrOnEachElement(element, "aria-valuemin", "userSetValue2");
        expectAriaAttrOnEachElement(element, "aria-valuemax", "userSetValue3");
      });

      it("should update `aria-valuemin/max` when `min/max` changes dynamically", function () {
        scope.$apply("min = 25; max = 75");
        compileElement('<input type="range" ng-model="val" min="{{min}}" max="{{max}}" />');

        expect(element.attr("aria-valuemin")).toBe("25");
        expect(element.attr("aria-valuemax")).toBe("75");

        scope.$apply("min = 0");
        expect(element.attr("aria-valuemin")).toBe("0");

        scope.$apply("max = 100");
        expect(element.attr("aria-valuemax")).toBe("100");
      });

      it("should update `aria-valuemin/max` when `ng-min/ng-max` changes dynamically", function () {
        scope.$apply("min = 25; max = 75");
        compileElement('<input type="range" ng-model="val" ng-min="min" ng-max="max" />');

        expect(element.attr("aria-valuemin")).toBe("25");
        expect(element.attr("aria-valuemax")).toBe("75");

        scope.$apply("min = 0");
        expect(element.attr("aria-valuemin")).toBe("0");

        scope.$apply("max = 100");
        expect(element.attr("aria-valuemax")).toBe("100");
      });
    });

    describe("announcing ngMessages", function () {
      beforeEach(injectScopeAndCompiler);

      it("should attach aria-live", function () {
        var element = [$compile('<div ng-messages="myForm.myName.$error">')(scope)];
        expectAriaAttrOnEachElement(element, "aria-live", "assertive");
      });
    });

    describe("aria-value when disabled", function () {
      beforeEach(
        configAriaProvider({
          ariaValue: false
        })
      );
      beforeEach(injectScopeAndCompiler);

      it("should not attach itself", function () {
        scope.$apply("val = 50");

        compileElement('<input type="range" ng-model="val" min="0" max="100">');
        expect(element.attr("aria-valuenow")).toBeUndefined();
        expect(element.attr("aria-valuemin")).toBeUndefined();
        expect(element.attr("aria-valuemax")).toBeUndefined();

        compileElement('<div role="progressbar" min="0" max="100" ng-model="val">');
        expect(element.attr("aria-valuenow")).toBeUndefined();
        expect(element.attr("aria-valuemin")).toBeUndefined();
        expect(element.attr("aria-valuemax")).toBeUndefined();
      });
    });

    describe("tabindex", function () {
      beforeEach(injectScopeAndCompiler);

      they(
        "should not attach to native control $prop",
        {
          button: "<button ng-click='something'></button>",
          a: "<a ng-href='#/something'>",
          "input[text]": "<input type='text' ng-model='val'>",
          "input[radio]": "<input type='radio' ng-model='val'>",
          "input[checkbox]": "<input type='checkbox' ng-model='val'>",
          textarea: "<textarea ng-model='val'></textarea>",
          select: "<select ng-model='val'></select>",
          details: "<details ng-model='val'></details>"
        },
        function (html) {
          compileElement(html);
          expect(element.attr("tabindex")).toBeUndefined();
        }
      );

      it("should not attach to random ng-model elements", function () {
        compileElement('<div ng-model="val"></div>');
        expect(element.attr("tabindex")).toBeUndefined();
      });

      it("should attach tabindex to custom inputs", function () {
        compileElement('<div role="checkbox" ng-model="val"></div>');
        expect(element.attr("tabindex")).toBe("0");

        compileElement('<div role="slider" ng-model="val"></div>');
        expect(element.attr("tabindex")).toBe("0");
      });

      it("should attach to ng-click and ng-dblclick", function () {
        compileElement('<div ng-click="someAction()"></div>');
        expect(element.attr("tabindex")).toBe("0");

        compileElement('<div ng-dblclick="someAction()"></div>');
        expect(element.attr("tabindex")).toBe("0");
      });

      it("should not attach tabindex if it is already on an element", function () {
        compileElement('<div role="button" tabindex="userSetValue"></div>');
        expect(element.attr("tabindex")).toBe("userSetValue");

        compileElement('<div role="checkbox" tabindex="userSetValue"></div>');
        expect(element.attr("tabindex")).toBe("userSetValue");

        compileElement('<div ng-click="someAction()" tabindex="userSetValue"></div>');
        expect(element.attr("tabindex")).toBe("userSetValue");

        compileElement('<div ng-dblclick="someAction()" tabindex="userSetValue"></div>');
        expect(element.attr("tabindex")).toBe("userSetValue");
      });
    });

    describe("accessible actions", function () {
      var clickEvents;

      beforeEach(injectScopeAndCompiler);
      beforeEach(function () {
        clickEvents = [];
        scope.onClick = jasmine.createSpy("onClick").and.callFake(function (evt) {
          var nodeName = evt ? evt.target.nodeName.toLowerCase() : "";
          var prevented = !!(evt && evt.isDefaultPrevented());
          clickEvents.push(nodeName + "(" + prevented + ")");
        });
      });

      it("should trigger a click from the keyboard (and prevent default action)", function () {
        compileElement("<section>" + '<div ng-click="onClick($event)"></div>' + '<ul><li ng-click="onClick($event)"></li></ul>' + "</section>");

        var divElement = element.find("div");
        var liElement = element.find("li");

        divElement.triggerHandler({ type: "keydown", keyCode: 13 });
        liElement.triggerHandler({ type: "keydown", keyCode: 13 });
        divElement.triggerHandler({ type: "keydown", keyCode: 32 });
        liElement.triggerHandler({ type: "keydown", keyCode: 32 });

        expect(clickEvents).toEqual(["div(true)", "li(true)", "div(true)", "li(true)"]);
      });

      it("should trigger a click in browsers that provide `event.which` instead of `event.keyCode`", function () {
        compileElement("<section>" + '<div ng-click="onClick($event)"></div>' + '<ul><li ng-click="onClick($event)"></li></ul>' + "</section>");

        var divElement = element.find("div");
        var liElement = element.find("li");

        divElement.triggerHandler({ type: "keydown", which: 13 });
        liElement.triggerHandler({ type: "keydown", which: 13 });
        divElement.triggerHandler({ type: "keydown", which: 32 });
        liElement.triggerHandler({ type: "keydown", which: 32 });

        expect(clickEvents).toEqual(["div(true)", "li(true)", "div(true)", "li(true)"]);
      });

      it("should not prevent default keyboard action if the target element has editable content", inject(function ($document) {
        // Note:
        // `contenteditable` is an enumarated (not a boolean) attribute (see
        // https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/contenteditable).
        // We need to check the following conditions:
        //   - No attribute.
        //   - Value: ""
        //   - Value: "true"
        //   - Value: "false"

        function eventFor(keyCode) {
          return { bubbles: true, cancelable: true, keyCode: keyCode };
        }

        compileElement(
          "<section>" +
            // No attribute.
            '<div id="no-attribute">' +
            '<div ng-click="onClick($event)"></div>' +
            '<ul ng-click="onClick($event)"><li></li></ul>' +
            "</div>" +
            // Value: ""
            '<div id="value-empty">' +
            '<div ng-click="onClick($event)" contenteditable=""></div>' +
            '<ul ng-click="onClick($event)"><li contenteditable=""></li></ul>' +
            "</div>" +
            // Value: "true"
            '<div id="value-true">' +
            '<div ng-click="onClick($event)" contenteditable="true"></div>' +
            '<ul ng-click="onClick($event)"><li contenteditable="true"></li></ul>' +
            "</div>" +
            // Value: "false"
            '<div id="value-false">' +
            '<div ng-click="onClick($event)" contenteditable="false"></div>' +
            '<ul ng-click="onClick($event)"><li contenteditable="false"></li></ul>' +
            "</div>" +
            "</section>"
        );

        // Support: Safari 11-12+
        // Attach to DOM, because otherwise Safari will not update the `isContentEditable` property
        // based on the `contenteditable` attribute.
        $document.find("body").append(element);

        var containers = element.children();
        var container;

        // Using `browserTrigger()`, because it supports event bubbling.

        // No attribute | Elements are not editable.
        container = containers.eq(0);
        browserTrigger(container.find("div"), "keydown", eventFor(13));
        browserTrigger(container.find("ul"), "keydown", eventFor(32));
        browserTrigger(container.find("li"), "keydown", eventFor(13));

        expect(clickEvents).toEqual(["div(true)", "ul(true)", "li(true)"]);

        // Value: "" | Elements are editable.
        clickEvents = [];
        container = containers.eq(1);
        browserTrigger(container.find("div"), "keydown", eventFor(32));
        browserTrigger(container.find("ul"), "keydown", eventFor(13));
        browserTrigger(container.find("li"), "keydown", eventFor(32));

        expect(clickEvents).toEqual(["div(false)", "ul(true)", "li(false)"]);

        // Value: "true" | Elements are editable.
        clickEvents = [];
        container = containers.eq(2);
        browserTrigger(container.find("div"), "keydown", eventFor(13));
        browserTrigger(container.find("ul"), "keydown", eventFor(32));
        browserTrigger(container.find("li"), "keydown", eventFor(13));

        expect(clickEvents).toEqual(["div(false)", "ul(true)", "li(false)"]);

        // Value: "false" | Elements are not editable.
        clickEvents = [];
        container = containers.eq(3);
        browserTrigger(container.find("div"), "keydown", eventFor(32));
        browserTrigger(container.find("ul"), "keydown", eventFor(13));
        browserTrigger(container.find("li"), "keydown", eventFor(32));

        expect(clickEvents).toEqual(["div(true)", "ul(true)", "li(true)"]);
      }));

      they("should not prevent default keyboard action if an interactive $type element" + "is nested inside ng-click", nodeBlackList, function (elementType) {
        function createHTML(type) {
          return "<" + type + "></" + type + ">";
        }

        compileElement("<section>" + '<div ng-click="onClick($event)">' + createHTML(elementType) + "</div>" + "</section>");

        var divElement = element.find("div");
        var interactiveElement = element.find(elementType);

        // Use browserTrigger because it supports event bubbling
        // 13 Enter
        browserTrigger(interactiveElement, "keydown", { cancelable: true, bubbles: true, keyCode: 13 });
        expect(clickEvents).toEqual([elementType.toLowerCase() + "(false)"]);

        clickEvents = [];

        // 32 Space
        browserTrigger(interactiveElement, "keydown", { cancelable: true, bubbles: true, keyCode: 32 });
        expect(clickEvents).toEqual([elementType.toLowerCase() + "(false)"]);
      });

      they("should not bind to key events if there is existing `ng-$prop`", ["keydown", "keypress", "keyup"], function (eventName) {
        scope.onKeyEvent = jasmine.createSpy("onKeyEvent");
        compileElement('<div ng-click="onClick()" ng-' + eventName + '="onKeyEvent()"></div>');

        element.triggerHandler({ type: eventName, keyCode: 13 });
        element.triggerHandler({ type: eventName, keyCode: 32 });

        expect(scope.onClick).not.toHaveBeenCalled();
        expect(scope.onKeyEvent).toHaveBeenCalledTimes(2);
      });

      it("should update bindings when keydown is handled", function () {
        scope.count = 0;
        compileElement('<div ng-click="count = count + 1">Count: {{ count }}</div>');

        expect(element.text()).toBe("Count: 0");

        element.triggerHandler({ type: "keydown", keyCode: 13 });
        expect(element.text()).toBe("Count: 1");

        element.triggerHandler({ type: "keydown", keyCode: 32 });
        expect(element.text()).toBe("Count: 2");
      });

      it("should pass `$event` to `ng-click` handler as local", function () {
        compileElement('<div ng-click="event = $event">{{ event.type }}{{ event.keyCode }}</div>');
        expect(element.text()).toBe("");

        element.triggerHandler({ type: "keydown", keyCode: 13 });
        expect(element.text()).toBe("keydown13");

        element.triggerHandler({ type: "keydown", keyCode: 32 });
        expect(element.text()).toBe("keydown32");
      });

      it("should not bind keydown to natively interactive elements", function () {
        compileElement('<button ng-click="onClick()">Click me</button>');

        element.triggerHandler({ type: "keydown", keyCode: 13 });
        element.triggerHandler({ type: "keydown", keyCode: 32 });

        expect(scope.onClick).not.toHaveBeenCalled();
      });
    });

    describe("actions when bindRoleForClick is set to false", function () {
      beforeEach(
        configAriaProvider({
          bindRoleForClick: false
        })
      );
      beforeEach(injectScopeAndCompiler);

      it("should not add a button role", function () {
        compileElement('<radio-group ng-click="something"></radio-group>');
        expect(element.attr("role")).toBeUndefined();
      });
    });

    describe("actions when bindKeydown is set to false", function () {
      beforeEach(
        configAriaProvider({
          bindKeydown: false
        })
      );
      beforeEach(injectScopeAndCompiler);

      it("should not trigger click", function () {
        scope.someAction = jasmine.createSpy("someAction");

        element = $compile('<div ng-click="someAction()" tabindex="0"></div>')(scope);

        element.triggerHandler({ type: "keydown", keyCode: 13 });
        element.triggerHandler({ type: "keydown", keyCode: 32 });
        element.triggerHandler({ type: "keypress", keyCode: 13 });
        element.triggerHandler({ type: "keypress", keyCode: 32 });
        element.triggerHandler({ type: "keyup", keyCode: 13 });
        element.triggerHandler({ type: "keyup", keyCode: 32 });

        expect(scope.someAction).not.toHaveBeenCalled();

        element.triggerHandler({ type: "click", keyCode: 32 });

        expect(scope.someAction).toHaveBeenCalledOnce();
      });
    });

    describe("tabindex when disabled", function () {
      beforeEach(
        configAriaProvider({
          tabindex: false
        })
      );
      beforeEach(injectScopeAndCompiler);

      it("should not add a tabindex attribute", function () {
        compileElement('<div role="button"></div>');
        expect(element.attr("tabindex")).toBeUndefined();

        compileElement('<div role="checkbox"></div>');
        expect(element.attr("tabindex")).toBeUndefined();

        compileElement('<div ng-click="someAction()"></div>');
        expect(element.attr("tabindex")).toBeUndefined();

        compileElement('<div ng-dblclick="someAction()"></div>');
        expect(element.attr("tabindex")).toBeUndefined();
      });
    });

    describe("ngModel", function () {
      it("should not break when manually compiling", function () {
        module(function ($compileProvider) {
          $compileProvider.directive("foo", function () {
            return {
              priority: 10,
              terminal: true,
              link: function (scope, elem) {
                $compile(elem, null, 10)(scope);
              }
            };
          });
        });

        injectScopeAndCompiler();
        compileElement('<div role="checkbox" ng-model="value" foo />');

        // Just check an arbitrary feature to make sure it worked
        expect(element.attr("tabindex")).toBe("0");
      });
    });

    // Helpers
    function compileElement(inputHtml) {
      element = $compile(inputHtml)(scope);
      scope.$digest();
    }

    function configAriaProvider(config) {
      return function () {
        module(function ($ariaProvider) {
          $ariaProvider.config(config);
        });
      };
    }

    function expectAriaAttrOnEachElement(elem, ariaAttr, expected) {
      angular.forEach(elem, function (val) {
        expect(angular.element(val).attr(ariaAttr)).toBe(expected);
      });
    }

    function injectScopeAndCompiler() {
      return inject(function (_$compile_, _$rootScope_) {
        $compile = _$compile_;
        scope = _$rootScope_;
      });
    }
  });
})(window, window.angular);
