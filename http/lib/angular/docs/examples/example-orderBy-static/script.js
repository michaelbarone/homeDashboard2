(function (angular) {
  "use strict";
  angular.module("orderByExample1", []).controller("ExampleController", [
    "$scope",
    function ($scope) {
      $scope.friends = [
        { name: "John", phone: "555-1212", age: 10 },
        { name: "Mary", phone: "555-9876", age: 19 },
        { name: "Mike", phone: "555-4321", age: 21 },
        { name: "Adam", phone: "555-5678", age: 35 },
        { name: "Julie", phone: "555-8765", age: 29 }
      ];
    }
  ]);
})(window.angular);
