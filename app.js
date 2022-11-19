const app = angular.module("homeDashboard", ["ngSanitize", "ngRoute", "ngResource", "ngIdle", "NgModel", "angularModalService", "ui.bootstrap", "ngAnimate"]);
app.config([
  "$routeProvider",
  "$controllerProvider",
  "KeepaliveProvider",
  "IdleProvider",
  "$compileProvider",
  "$sceProvider",
  function ($routeProvider, $controllerProvider, KeepaliveProvider, IdleProvider, $compileProvider, $sceProvider) {
    $routeProvider.when("/home", {
      templateUrl: "components/home.html",
      option: "default"
    });

    $routeProvider.when("/frame", {
      templateUrl: "components/frame.html",
      option: "default"
    });

    $routeProvider.otherwise({ redirectTo: "/home" });

    /* ngidle settings */
    IdleProvider.idle(360);
    IdleProvider.timeout(0);
    KeepaliveProvider.interval(10);

    /* custom defaults */
    window.oncontextmenu = function (event) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    };

    window.addEventListener(
      "dragover",
      function (e) {
        e = e || event;
        e.preventDefault();
      },
      false
    );
    window.addEventListener(
      "drop",
      function (e) {
        e = e || event;
        e.preventDefault();
      },
      false
    );

    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|data):/);
  }
]);

app.run(function ($rootScope, $location, Idle) {
  /* start idle check */
  Idle.watch();
});
