'use strict';

app.controller('dashCtrl', ['$rootScope','$scope','$timeout','$interval','$http','Idle','$location','ModalService','spinnerService','$route', function ($rootScope, $scope, $timeout, $interval, $http, Idle, $location, ModalService, spinnerService, $route){
	spinnerService.clear();
	
	$scope.data = {};
	$scope.data.weather = {};
	$scope.data.weather.version = 2020.1;
	$scope.data.weather.alerts = {};
	$scope.data.weather.lastUpdate = 0;
	$scope.data.weather.lastUpdated = {};
	$scope.data.weather.lastUpdated.current = 0;
	$scope.data.weather.lastUpdated.daily = 0;
	$scope.data.weather.lastUpdated.hourly = 0;
	$scope.data.weather.current = {};
	$scope.data.weather.daily = [];
	$scope.data.weather.hourly = [];
	$scope.data.background = {};
	$scope.data.background.currentImage = "";
	$scope.data.background.nextImage = "";
	$scope.data.background.images = {};

	$scope.data.background.odd = "";
	$scope.data.background.even = "";
	$scope.data.background.count = 0;
	$scope.data.background.countValue = "Even";
	
	$scope.data.houseTemperature = {};
	$scope.data.params = [];
	$scope.functions = {};
	
	$scope.data.time = {};
	$scope.idle=false;
	
	var currentDay = "";
	
	angular.forEach($location.search(), function(value,key){
		$scope.data.params[key]=value;
	});


	$scope.functions.updateFrameSize = function(limit = false) {
		$scope.frameHeight = window.innerHeight;  //$(document).height();
		$scope.frameWidth = window.innerWidth; //$(document).width();
		var m = ($scope.frameWidth/125).toFixed(0);
		var f = ($scope.frameWidth/100).toFixed(0);
		if(!limit){
			$scope.mainWeatherTiles = (m < 5)? 5 : m;
			$scope.frameWeatherTiles = (f < 5)? 5 : f;
		} else {
			$scope.mainWeatherTiles = m;
			$scope.frameWeatherTiles = f;			
		}
	}
	$scope.functions.updateFrameSize();
	angular.element(window).bind('resize', function(){
		$scope.functions.updateFrameSize();
	});

	$scope.$on('IdleStart', function() {
		// the user appears to have gone idle
		if(!$scope.data.params['kiosk']){
			$scope.idle=true;
			console.log("idle");
		} else {
			console.log("idle in kiosk");
		}
		// reset to default states
		$scope.showHouseTemp=false;
		$scope.showHourly=false;
		$scope.showMaps=false;
		$scope.showAlert=false;
		$scope.functions.showMap("close");
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
		if(currentDay == "") {
			currentDay = $scope.data.time.day
		} else {
			if(currentDay != $scope.data.time.day) {
				$scope.functions.updateWeatherFromObject();
				currentDay = $scope.data.time.day
			}
		}
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
						//if($scope.data.background.images[0]['media']['m']){
						//	$scope.data.background.currentImage = $scope.data.background.images[0]['media']['m'].replace("_m", "_b");					
						//}
						
					$scope.data.background.count++	
					if($scope.data.background.count % 2 == 0){
						$scope.data.background.countValue = "Even";
					} else {
						$scope.data.background.countValue = "Odd";
					}


					if($scope.data.background.count==1){
						$scope.data.background.odd = $scope.data.background.images[0]['media']['m'].replace("_m", "_b");
						$scope.data.background.even = $scope.data.background.images[1]['media']['m'].replace("_m", "_b");
						$scope.data.background.images.shift();
						$scope.data.background.images.shift();
					} else {
						setTimeout(function() {

							if($scope.data.background.countValue == "Even"){
								$scope.data.background.odd = $scope.data.background.images[0]['media']['m'].replace("_m", "_b");
								$scope.data.background.images.shift();
							} else {
								$scope.data.background.even = $scope.data.background.images[0]['media']['m'].replace("_m", "_b");
								$scope.data.background.images.shift();
							}
						}, 5000)
					}
					
					/*
					if($scope.data.background.currentImage != ""){
						if($scope.data.background.images[0]['media']['m']){
							$scope.data.background.currentImage = $scope.data.background.nextImage
							$scope.data.background.nextImage = $scope.data.background.images[0]['media']['m'].replace("_m", "_b");
						}
					} else {
						if($scope.data.background.images[0]['media']['m'] && $scope.data.background.images[1]['media']['m']){
							$scope.data.background.currentImage = $scope.data.background.images[0]['media']['m'].replace("_m", "_b");
							$scope.data.background.nextImage = $scope.data.background.images[1]['media']['m'].replace("_m", "_b");
							$scope.data.background.images.shift();
						}						
					}
					*/
					
					
					setTimeout(function() {
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
						$scope.data.background.count = 0
						//console.log(backgroundImages);
						$scope.functions.updatePhoto();
					});
			}
	
		}
		$scope.functions.updatePhoto();
	
	
	
	
	
	
	
	
	
	
	$scope.functions.getDay = function(date1, index = 1){
		var date = new Date(date1+"T00:00");
		var curDay = new Date().getDay();
		if(index == 0 && curDay == date.getDay()){
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
	
	$scope.functions.updateWeatherFromObject = function(){
		if($scope.functions.getDay($scope.data.weather.daily[0].datetime,0)!="TODAY"){
			while($scope.functions.getDay($scope.data.weather.daily[0].datetime,0)!="TODAY"){
				$scope.data.weather.daily.shift();
			}
		}
		$scope.data.weather.lastUpdate = Date.now();
		$.post('./data/saveToJSON.php',
			JSON.stringify($scope.data.weather)
		);
	}
	
	$scope.functions.getHouseTemperature = function(){
		$.getJSON('./data/houseTemperature.json', function(ht) {
			var temp = {};
			angular.forEach(ht, function(value,key){
				key = key.replace('ave', '');
				switch(key){
					case "Outside":
						temp[1] = {"temp":value, "name":key};
						break;
					case "Upstairs":
						temp[2] = {"temp":value, "name":key};
						break;
					case "Downstairs":
						temp[3] = {"temp":value, "name":key};
						break;
					case "Garage":
						temp[4] = {"temp":value, "name":key};
						break;
					case "In vs Out":
						temp[5] = {"temp":value, "name":key};
						break;						
					case "$now":
						temp["$now"] = value;
						break;
				}
			});
			$scope.data.houseTemperature = temp;
		}).fail(function() {
			$scope.data.houseTemperature = {};
		});	
	}

	var getDailyReset = 0;
	// reset when day changes
	
	
	$interval(updateWeather, dashboardSettings.checkWeatherCurrentInterval);
	updateWeather();
	function updateWeather(){
		console.log("updating weather");

		$.get('./data/weather.json', function(data) {
				if(data.version && $scope.data.weather.version==data.version){
					$scope.data.weather = data;
				} else {
					console.log("JSON data version outdated, refreshing from sources");
				}
			
			}).fail(function() {
				$scope.data.weather.lastUpdate = 0;
				$scope.data.weather.lastUpdated.current = 0;
				$scope.data.weather.lastUpdated.daily = 0;
				$scope.data.weather.lastUpdated.hourly = 0;
				
			}).always(function() {
		
				var dateNow = Date.now();
		
				var difDate = dateNow - $scope.data.weather.lastUpdated.current;
				
				$scope.data.weather.lastChecked = dateNow;
				
				if(difDate<dashboardSettings.checkWeatherCurrentMinimumElapsedTime){
					// difDate closer than refresh rate, use JSON data
					return;
				} else {
					// JSON too old, refresh data and save new data
					console.log("current data too old, refreshing JSON");

					$.getJSON("https://api.weatherbit.io/v2.0/current?city="+dashboardSettings.city+","+dashboardSettings.state+"&units=I&key="+dashboardSettings.weatherBitKey, function(wb) {
						$scope.data.weather.current = wb.data[0];
						$scope.data.weather.lastUpdated.current = dateNow;

						var aqiIndex = "Good";
						var aqi = $scope.data.weather.current.aqi;
						switch(true){
							case (aqi < 50): aqiIndex = "Good"; break;
							case (aqi < 100): aqiIndex = "Moderate"; break;
							case (aqi < 150): aqiIndex = "Unhealthy for Sensative Groups"; break;
							case (aqi < 200): aqiIndex = "Unhealthy"; break;
							case (aqi < 300): aqiIndex = "Very Unhealthy"; break;
							case (aqi < 500): aqiIndex = "Hazardous"; break;
							default: aqiIndex = "Good"; break;
						}
						$scope.data.weather.current.aqiIndex = aqiIndex;


					}).fail(function() {
						$scope.data.weather.current = {};
						$scope.data.weather.lastUpdated.current = 0;
					}).always(function(){


						var difDate = dateNow - $scope.data.weather.lastUpdated.daily;
						
						if(difDate<dashboardSettings.checkWeatherDailyMinimumElapsedTime){
							// difDate closer than refresh rate, use JSON data
							$scope.functions.updateWeatherFromObject();
							return;
						} else {
							// JSON too old, refresh data and save new data
							console.log("daily data too old, refreshing JSON");
								$.getJSON("https://api.weatherbit.io/v2.0/forecast/daily?city="+dashboardSettings.city+","+dashboardSettings.state+"&key="+dashboardSettings.weatherBitKey+"&units=I", function(wb) {
									$scope.data.weather.daily = wb.data;
									$scope.data.weather.lastUpdated.daily = dateNow;
									$scope.functions.updateWeatherFromObject();
								}).fail(function() {
									$scope.data.weather.lastUpdated.daily = 0;
									$scope.data.weather.daily = [];
								});							
							
						}

					/*
						//
						// hourly forcast no longer available for free from weatherbit
						//
						//$.getJSON("https://api.weatherbit.io/v2.0/forecast/hourly?city="+dashboardSettings.city+","+dashboardSettings.state+"&key="+dashboardSettings.weatherBitKey+"&hours=48&units=I", function(wb) {
						//	$scope.data.weather.hourly = wb.data;
						//}).fail(function() {
							$scope.data.weather.hourly = [];
						//}).always(function(){
							if(getDailyReset<1){
								$.getJSON("https://api.weatherbit.io/v2.0/forecast/daily?city="+dashboardSettings.city+","+dashboardSettings.state+"&key="+dashboardSettings.weatherBitKey+"&units=I", function(wb) {
									$scope.data.weather.daily = wb.data;
									$scope.functions.updateWeatherFromObject();
								}).fail(function() {
									$scope.data.weather.daily = [];
								});
							} else {
								$scope.functions.updateWeatherFromObject();
							}
							getDailyReset++;
							if(getDailyReset>20){
								getDailyReset = 0;
							}
						//
						// hourly weather comment out	
						//});
					*/
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
		}).fail(function() {
			$scope.data.weather.alerts = {};
		});
		
		
		
		// get local house data
		$scope.functions.getHouseTemperature();
	}

	
	$interval(getHouseTemp, 180000);
	function getHouseTemp(){
		$scope.functions.getHouseTemperature();
	}
	
	
	
	
	$scope.functions.isObjectEmpty = function(obj){
	   return Object.keys(obj).length === 0;
	}	
	

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
		
	$scope.functions.showMap = function(type){
		if(type=="traffic" && $scope.currentMap != "traffic"){
			$scope.currentMap = "traffic";
			var map = new google.maps.Map(document.getElementById('map'), {
				zoom: 11,
				center: {'lat': parseFloat(dashboardSettings.mapLat), 'lng': parseFloat(dashboardSettings.mapLong)}
			});

			var trafficLayer = new google.maps.TrafficLayer();
			trafficLayer.setMap(map);
			
			
			
		} else if(type=="weather" && $scope.currentMap != "weather") {
			$scope.currentMap = "weather";
			document.getElementById('weatherMap').innerHTML = '<iframe src="https://www.rainviewer.com/map.html?loc='+dashboardSettings.mapLat+','+dashboardSettings.mapLong+',8&amp;oFa=0&amp;oC=0&amp;oU=0&amp;oCUB=1&amp;oCS=1&amp;oF=0&amp;oAP=0&amp;rmt=4" style="border:0px #ffffff none;" name="myiFrame" scrolling="no" marginheight="0px" marginwidth="0px" height="100%" width="100%" allowfullscreen=""></iframe>';
		} else if(type=="close"){
			$scope.currentMap = "";
			if(document.getElementById('map') !== null){
				document.getElementById('map').innerHTML = "";
			}
			if(document.getElementById('weatherMap') !== null){
				document.getElementById('weatherMap').innerHTML = "";
			}
		}
	}

	if($scope.data.params['background'] == 'transparent'){
		var css = 'body, html {background: rgba(0,0,0,0);} .windowContainer {background: rgba(0,0,0,0);} .dashboard {font-size: 8pt !important}'
		var head = document.head || document.getElementsByTagName('head')[0];
		var style = document.createElement('style');
		head.appendChild(style);
		style.type = 'text/css';
		if (style.styleSheet){
				// This is required for IE8 and below.
				style.styleSheet.cssText = css;
			} else {
				style.appendChild(document.createTextNode(css));
		}		
	}

	if(!$scope.data.params['kiosk']){
		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = "https://maps.googleapis.com/maps/api/js?key="+dashboardSettings.googleMapsApi;
		document.body.appendChild(script);		
	}
}]);