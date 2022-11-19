app.controller("modalCtrl", [
  "$scope",
  "$http",
  "close",
  "$location",
  "inform",
  "spinnerService",
  "$timeout",
  function ($scope, $http, close, $location, inform, spinnerService, $timeout) {
    spinnerService.clear();
    $scope.closeModal = function (event = null) {
      if ($scope.modalOpen) {
        //$scope.modalContent=[];
        $scope.modalOpen = 0;
        if (event == null) {
          const e = "Closed";
        } else {
          const e = event;
        }
        close(e, 250);
      }
    };
  }
]);
