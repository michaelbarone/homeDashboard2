'use strict';

app.factory('spinnerService', function($rootScope){
	var index=0;
	var spinnerTimout='';
	function reset(){
		$rootScope.spinner=[];
		$rootScope.spinner.spinnerArray=[];
		$rootScope.spinner.spinnerCount=[];
		$rootScope.spinner.spinnerText="";
	}
	reset();
	
	function resetTimeout(){
		clearTimeout(spinnerTimout);
		spinnerTimout = setTimeout(function(){
			clearTimeout(spinnerTimout);
			if($rootScope.spinner.spinnerArray.length>0){
				reset();
				console.log("Spinner: clear all timeout");
				$rootScope.$digest();
			}
		}, 45000);
	}
	return{
		addText:function(text=''){
			$rootScope.spinner.spinnerText=text;
		},
		updateCount:function(current,total){
			if(current=="" || total==""){
				$rootScope.spinner.spinnerCount=[];
			} else {
				$rootScope.spinner.spinnerCount.current=current;
				$rootScope.spinner.spinnerCount.total=total;
			}
		},
		add:function(func=null,limit=0){
			resetTimeout();
			if(limit>0){
				index = $rootScope.spinner.spinnerArray.indexOf(func);
				if(index>-1){
					/* already added */
					return;
				}
			}
			console.log("Spinner: added "+func);
			$rootScope.spinner.spinnerArray.push(func);
		},
		remove:function(func=null){
			if($rootScope.spinner.spinnerArray.length>0){
				index = $rootScope.spinner.spinnerArray.indexOf(func);
				if(index>-1){
					$rootScope.spinner.spinnerArray.splice(index, 1);
					$rootScope.spinner.spinnerCount=[];
					console.log("Spinner: removed "+func);
				}
				resetTimeout();
			} else {
				clearTimeout(spinnerTimout);
			}
		},
		clear:function(){
			console.log("Spinner: clear all");
			reset();
		}
	};
});