'use strict';

var app= angular.module('homeDashboard', ['ngSanitize','ngRoute','ngResource','ngIdle','NgModel','angularModalService','ui.bootstrap','ngAnimate']);
app.config(['$routeProvider','$controllerProvider','KeepaliveProvider', 'IdleProvider','$compileProvider','$sceProvider', function($routeProvider,$controllerProvider,KeepaliveProvider, IdleProvider, $compileProvider, $sceProvider) {
	 //$sceProvider.enabled(false);
	
	
	/* routes */
	/*
	app.settingsController = $controllerProvider.register;
	app.dashboardController = $controllerProvider.register;
	app.chatController = $controllerProvider.register;	
	$routeProvider.when('/login', {templateUrl: 'login.tpl', controller: 'loginCtrl'});
	$routeProvider.when('/dashboard', {templateUrl: 'partials/dashboard.html'});
	$routeProvider.when('/settings', {templateUrl: 'partials/settings.html'});
	$routeProvider.when('/servercheck', {templateUrl: 'partials/servercheck.html'});
	$routeProvider.otherwise({redirectTo: '/login'});
	*/
	
	/*
	app.sankeyCoursesController = $controllerProvider.register;
	$routeProvider.when('/sankeyCourses', {templateUrl: 'components/sankey/sankeyCourses.html'});

	app.sankeyMajorsController = $controllerProvider.register;
	$routeProvider.when('/sankeyMajors', {templateUrl: 'components/sankey/sankeyMajors.html'});
	*/

	/*
	app.chartsController = $controllerProvider.register;
	$routeProvider.when('/charts', {
		templateUrl: 'components/charts/charts.html'
		, option: 'charts'
	});

	$routeProvider.when('/demo', {
		templateUrl: 'components/charts/charts.html'
		, option: 'demo'
	});	
	*/
	
	//app.dashController = $controllerProvider.register;
	$routeProvider.when('/home', {
		templateUrl: 'components/home.html'
		//,controller: 'dashCtrl'
		, option: 'default'
	});	
	
	
	$routeProvider.otherwise({redirectTo: '/home'});

	
	
	/* ngidle settings */
	IdleProvider.idle(360);
	IdleProvider.timeout(0);
	KeepaliveProvider.interval(10);

	/* custom defaults */
	window.oncontextmenu = function(event) {
		event.preventDefault();
		event.stopPropagation();
		return false;
	};

	window.addEventListener("dragover",function(e){
		e = e || event;
		e.preventDefault();
	},false);
	window.addEventListener("drop",function(e){
		e = e || event;
		e.preventDefault();
	},false);

	$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|data):/);
	
	
}]);

app.run(function($rootScope, $location, /*userService, cron, */ Idle){
	/* routes that require login */
	/*
	var routespermission=['/dashboard','/settings'];
	$rootScope.$on('$routeChangeStart', function(){
		if( routespermission.indexOf($location.path()) !=-1)
		{
			var connected=userService.islogged();
			connected.then(function(msg){
				if(msg.data==="failedAuth" || !msg.data) $location.path('/login');
			});
		}
		$rootScope.testrun = 0;
		$rootScope.debug = 0;		
		if($location.search()['command']){
			switch($location.search()['command']){
				case 'test':
					console.log('Test Mode Enabled');
					$rootScope.testrun = 1;
					break;
				case 'debug':
				case 'verbose':
					console.log('Debug Mode Enabled');
					$rootScope.debug = 1;				
					break;
			}
		}
	});
	if($location.path()!="/login"){
		cron.start();
	}
	*/
	/* start idle check */
	Idle.watch();
	
});