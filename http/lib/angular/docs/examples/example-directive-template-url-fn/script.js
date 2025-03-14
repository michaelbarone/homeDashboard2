(function (angular) {
  "use strict";
  angular
    .module("docsTemplateUrlDirective", [])
    .controller("Controller", [
      "$scope",
      function ($scope) {
        $scope.customer = {
          name: "Naomi",
          address: "1600 Amphitheatre"
        };
      }
    ])
    .directive("myCustomer", function () {
      return {
        templateUrl: function (elem, attr) {
          return "customer-" + attr.type + ".html";
        }
      };
    });
})(window.angular);
