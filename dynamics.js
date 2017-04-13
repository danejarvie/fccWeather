
$(document).ready(function(){
  
	var tempC;
	
	var geoSuccess = function(position) {
		var cur_lat = position.coords.latitude;
		var cur_lon = position.coords.longitude;
		document.getElementById('startLat').innerHTML = cur_lat.toFixed(4); //-37.2090994
		document.getElementById('startLon').innerHTML = cur_lon.toFixed(4); //174.8492235
		
		var owmURL;
		if (location.protocol === "https") {
			owmURL = "http://api.openweathermap.org/data/2.5/weather?lat="+cur_lat+"&lon="+cur_lon+"&units=metric&APPID=3d7c393f09816ab0aeebaa686e7d9fe7";
		} else {
			owmURL = "http://api.openweathermap.org/data/2.5/weather?lat="+cur_lat+"&lon="+cur_lon+"&units=metric&APPID=3d7c393f09816ab0aeebaa686e7d9fe7";
		}
		
		$.ajax({
			url: "https://crossorigin.me/http://api.openweathermap.org/data/2.5/weather?lat="+cur_lat+"&lon="+cur_lon+"&units=metric&APPID=3d7c393f09816ab0aeebaa686e7d9fe7",
			type: "GET",
			dataType: "json",
			success: function(data) {
				console.log(data);
				appBuilder(data);
			},
			error: function(e) {
				$("#weather-temp").html("Something went wrong.");
			}
		});
	};
	var geoFailure = function(err){
		console.warn(`ERROR(${err.code}): ${err.message}`);
		$.ajax({
			url: "http://api.openweathermap.org/data/2.5/weather?lat=-37.2090994&lon=174.8492235&units=metric&APPID=3d7c393f09816ab0aeebaa686e7d9fe7",
			type: "GET",
			dataType: "json",
			success: function(data) {
				appBuilder(data);
			},
			error: function(e) {
				$("#weather-name").html("Something went wrong.");
			}
		});//Hard: Display an alternative page where users can select their city.
		//Easy: Display an error but bring up weather page for Auckland, NZ.
	};
	

	if(navigator && navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(geoSuccess, geoFailure);
	} else {
    geoFailure();
	}
	
	
	function appBuilder(data){
		var wLocaleName = data.name;
		var wCountryName = data.sys.country;
		var wIcon = data.weather[0].icon;
		var wDesc = data.weather[0].description;
		
		var nowtime = new Date(Date.now()).toLocaleTimeString();
		
		tempC = data.main.temp;
		$("#weather-locale").html(wLocaleName);
		$("#weather-temp").html(data.main.temp);
		$("#weather-country").html(wCountryName+", "+nowtime);
		$("#weather-desc").html(wDesc);
		$("#weather-icon").html("<img src='/fccWeather/images/weezle_"+wIcon+".png' />");
		
	}
	
	var isCelsius = true;
	$("#temp-unit").on("click", function(){
		if(isCelsius) {
			tempC = tempC*9/5 + 32;
			$("#weather-temp").html(Math.round(tempC));
			$("#temp-unit").html("F<span class='mini'>/c</span>");
			isCelsius = false;
		} else {
			tempC = (tempC-32)*5/9;
			$("#weather-temp").html(Math.round(tempC));
			$("#temp-unit").html("C<span class='mini'>/f</span>");
			isCelsius = true;
		}
	});
	
	
});