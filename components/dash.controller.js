'use strict';

app.controller('dashCtrl', ['$rootScope','$scope','$timeout','$interval','$http','Idle','$location','ModalService','spinnerService','$route', function ($rootScope, $scope, $timeout, $interval, $http, Idle, $location, ModalService, spinnerService, $route){
	spinnerService.clear();
	
	$scope.data = {};
	$scope.data.weather = {};
	$scope.data.weather.alerts = {};
	$scope.data.background = {};
	$scope.data.background.currentImage = "";
	$scope.data.background.images = {};
	$scope.functions = {};
	
	$scope.data.time = {};
	$scope.idle=false;
	
	
	
	
	
	
	
	$scope.$on('IdleStart', function() {
		// the user appears to have gone idle
		$scope.idle=true;
		console.log("idle");
		// reset to default states
		$scope.showHourly=false;
		$scope.showMaps=false;
		$scope.showAlert=false;
	});	
	
	$scope.$on('IdleEnd', function() {
		// the user has come back from AFK and is doing stuff. if you are warning them, you can use this to hide the dialog
		$scope.idle=false;
		console.log("not idle");
	});	
	
	
	
	
	
	
	$interval(updateTime, 1e3);
	function updateTime(){
		$scope.data.time.raw = moment().tz(dashboardSettings.timezone);
		$scope.data.time.hour = $scope.data.time.raw.format("h");
		$scope.data.time.minute = $scope.data.time.raw.format("mm");
		$scope.data.time.second = $scope.data.time.raw.format("ss");
		$scope.data.time.ampm = $scope.data.time.raw.format("A");
		$scope.data.time.day = $scope.data.time.raw.format("dddd");
		$scope.data.time.date = $scope.data.time.raw.format("D");
		$scope.data.time.month = $scope.data.time.raw.format("MMMM");
		$scope.data.time.year = $scope.data.time.raw.format("YYYY");
	}
	


	/*
		$.getJSON("https://api.flickr.com/services/feeds/groups_pool.gne?jsoncallback=?",
			{
				// 78249294@N00 - "title": "Beautiful Scenery & Landscapes Pool"
				id: "78249294@N00",
				format: "json"
			},
		
			function(data) {
				console.log(data);
				$scope.data.background.images = data.items;
				//console.log(backgroundImages);
				//t.updatePhoto(backgroundImages);
			});	
	
		$scope.data.background.active = 0;
	*/

	
	

		$scope.functions.updatePhoto = function() {
			if($scope.data.background.images[0]){
				if($scope.idle){
					setTimeout(function() {
						$scope.functions.updatePhoto();
					}, 5000)
				} else {
					if($scope.data.background.images[0]['media']['m']){
						$scope.data.background.currentImage = $scope.data.background.images[0]['media']['m'].replace("_m", "_b");					
					}
					setTimeout(function() {
						$scope.data.background.images.shift();
						$scope.functions.updatePhoto();
					}, 60000)
				}
			} else {
				
				$.getJSON("https://api.flickr.com/services/feeds/groups_pool.gne?jsoncallback=?",
					{
						// 78249294@N00 - "title": "Beautiful Scenery & Landscapes Pool"
						id: "78249294@N00",
						format: "json"
					},function(data) {
						$scope.data.background.images = data.items;
						//console.log(backgroundImages);
						$scope.functions.updatePhoto();
					});
			}
	
		}
		$scope.functions.updatePhoto();
	
	
	
	
	
	
	
	
	
	
	$scope.functions.getDay = function(date1){
		var date = new Date(date1+"T00:00");
		var curDay = new Date().getDay();
		if(curDay == date.getDay()){
			//console.log("TODAY");
			return "TODAY";
		} else {
			//console.log($scope.weekday[date.getDay()]);
			return $scope.weekday[date.getDay()];		
		}
	}
	
	
	

	function correctHours(i){
		if(i > 12){
				i = i - 12;
		}else if( i < 1){
				i = 12;
		}
		return i;
	};
	function correctMinute(i){
		if(i < 10){
				i = "0"+i;
		}
		return i;
	};	
	function amORpm(i){
		if(i<12){
			return "am";
		} else {
			return "pm";
		}
	};


	
	
	$scope.functions.getSunrise = function(time, date){
		if(!date){ return };
		var sunrise = new Date(date.split(':')[0] + 'T'+ time+':00.000Z');
		if(sunrise.getMinutes()<10){
			sunrise = sunrise.getHours() + ':0' + sunrise.getMinutes();
		} else {
			sunrise = sunrise.getHours() + ':' + sunrise.getMinutes();
		}		
		return sunrise;
	}
	
	$scope.functions.getSunset = function(time, date){
		if(!date){ return };
		var sunset = new Date(date.split(':')[0] + 'T'+ time+':00.000Z');
		if(sunset.getMinutes()<10){
			sunset = ((sunset.getHours() + 24) % 12 || 12) + ':0' + sunset.getMinutes();
		}else{
			sunset = ((sunset.getHours() + 24) % 12 || 12) + ':' + sunset.getMinutes();
		}
		return sunset;
	}	
	
	$scope.functions.getTime = function(time){
		var time = new Date(time);
		var currentTime = 
			(time.getMonth() + 1) + "/" +
			time.getDate() + " | " +
			correctHours(time.getHours()) + ":" +
			correctMinute(time.getMinutes()) + " " +
			amORpm(time.getHours());		
			
		return currentTime;
	}
	
	
	


	var getDailyReset = 0;
	// reset when day changes
	
	
	$interval(updateWeather, 9e5);
	updateWeather();
	function updateWeather(){
		console.log("updating weather");

		
		
		$.get('./data/weather.json', function(data) {
				$scope.data.weather = data;
				//console.log("data from json:")
				//console.log(data);
				
			}).fail(function() {
				$scope.data.weather.lastUpdate = 0;
				
			}).always(function() {	
		
				var difDate = Date.now() - $scope.data.weather.lastUpdate;
				
				$scope.data.weather.lastChecked = Date.now();
				
				if(difDate<1200000){
					// difDate closer than refresh rate, use JSON data
					return;
				} else {
					// JSON too old, refresh data and save new data
					console.log("date too long, refreshing JSON");
					
					$scope.data.weather.lastUpdate = Date.now();
					$.getJSON("https://api.weatherbit.io/v2.0/current?city="+dashboardSettings.city+","+dashboardSettings.state+"&units=I&key="+dashboardSettings.weatherBitKey, function(wb) {
						$scope.data.weather.current = wb.data[0];
					}).done(function(){
						
						$.getJSON("https://api.weatherbit.io/v2.0/forecast/hourly?city="+dashboardSettings.city+","+dashboardSettings.state+"&key="+dashboardSettings.weatherBitKey+"&hours=12&units=I", function(wb) {
							$scope.data.weather.hourly = wb.data;
						
						
						}).done(function(){
							
							if(getDailyReset<1){
								$.getJSON("https://api.weatherbit.io/v2.0/forecast/daily?city="+dashboardSettings.city+","+dashboardSettings.state+"&key="+dashboardSettings.weatherBitKey+"&units=I", function(wb) {
									$scope.data.weather.daily = wb.data;
								}).done(function(){
									$.post('./data/saveToJSON.php',
										JSON.stringify($scope.data.weather)
									);
									//updateWeatherFromObject();
								});
							} else {
								$.post('./data/saveToJSON.php',
									JSON.stringify($scope.data.weather)
								);
								//updateWeatherFromObject();
							}
							getDailyReset++;
							if(getDailyReset>20){
								getDailyReset = 0;
							}
						
						});
					});
				}
			});
	
	
	
		// get any weather alerts
		$.getJSON("https://api.weather.gov/alerts/active/zone/"+dashboardSettings.weatherGovZone, function(wgov) {
			
			if(wgov.features.length>0){
				$scope.data.weather.alerts = wgov.features[0].properties;
			}else{
				$scope.data.weather.alerts = {};
			}
		});
	}

	
	
	
	
	
	
	
	
	
	
		
		
		
		
		$scope.data.weather.lastUpdate = Date.now();
		$scope.data.weather.current = {};
		$scope.data.weather.daily = {};
		$scope.data.weather.hourly = {};
		/*
		var weekday = new Array(7);
			weekday[0] =  "Sunday";
			weekday[1] = "Monday";
			weekday[2] = "Tuesday";
			weekday[3] = "Wednesday";
			weekday[4] = "Thursday";
			weekday[5] = "Friday";
			weekday[6] = "Saturday";
		*/
		$scope.weekday = new Array(7);
		$scope.weekday[0] = "Sun";
		$scope.weekday[1] = "Mon";
		$scope.weekday[2] = "Tue";
		$scope.weekday[3] = "Wed";
		$scope.weekday[4] = "Thu";
		$scope.weekday[5] = "Fri";
		$scope.weekday[6] = "Sat";

			
		$scope.functions.weatherCode = function(input){
			var theWeatherCode = 3200;
			switch(parseInt(input,10)){
				case 200:
				case 201:
				case 230:
				case 231:
				case 232:
					theWeatherCode = 4;
					break;
				case 202:
					theWeatherCode = 45;
					break;
				case 233:
					theWeatherCode = 3;
					break;
				case 300:
				case 301:
				case 500:
					theWeatherCode = 9;
					break;
				case 302:
				case 501:
				case 502:
				case 900:
					theWeatherCode = 11;
					break;
				case 511:
					theWeatherCode = 10;
					break;
				case 520:
				case 521:
				case 522:
					theWeatherCode = 12;
					break;
				case 600:
				case 601:
					theWeatherCode = 16;
					break;
				case 602:
				case 622:
					theWeatherCode = 43;
					break;
				case 610:
					theWeatherCode = 14;
					break;
				case 611:
				case 612:
					theWeatherCode = 18;
					break;
				case 621:
					theWeatherCode = 46;
					break;
				case 623:
					theWeatherCode = 13;
					break;
				case 700:
				case 721:
					theWeatherCode = 21;
					break;
				case 711:
					theWeatherCode = 22;
					break;
				case 731:
					theWeatherCode = 19;
					break;
				case 741:
				case 751:
					theWeatherCode = 20;
					break;
				case 800:
					theWeatherCode = 32;
					break;
				case 801:
				case 802:
				case 803:
					theWeatherCode = 30;
					break;
				case 804:
					theWeatherCode = 26;
					break;
				case 900:
					theWeatherCode = 11;
					break;
			}
			return theWeatherCode;
		}
}]);