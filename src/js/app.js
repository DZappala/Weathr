// imports api keys from super secret config file [hehehe]
import {
    apiKey,
    ipstackKey,
    timezonedbKey,
    googleMapsKey
} from "./config.js";

$(document).ready(function () {


    // Autocomplete search Query from googleMaps API
    var input = document.getElementById('weatherText')
    var options = {
        types: ['geocode']
    };

    var autocomplete = new google.maps.places.Autocomplete(input, options);


    // Prevents pagereload when the enterkey is pressed in the search field
    $('#weatherText').keypress(function(event) {
        if (event.keyCode == '13') {
            event.preventDefault();
        }
     });

    // Handles content on pageload
    // Fetches the lat and lon data based on user IP address
    fetch("http://api.ipstack.com/check?access_key=" + ipstackKey).then(function (response) {
        console.log("response")
        return response.json();
    }).then(function (response) {
        let currentLat = response.latitude;
        let currentLon = response.longitude;

        // Uses current lat and lon to determine current weather
        fetch("https://api.openweathermap.org/data/2.5/weather?lat=" + currentLat + "&lon=" + currentLon + "&type=like&units=imperial&APPID=" + apiKey).then(function (response) {
            console.log("response", response);
            return response.json();
        }).then(function (response) {
            console.log("response", response);
            var now = new Date();
            var hour = now.getHours();

            // Removes the image if there already is one ## WARNING REMOVES ALL IMG ELEMENTS FROM PAGE ### ( we need to fix this *sigh* )
            $('img').remove();

            // Inserts various weather data into Divs basedon ID 
            $("#location").text(response.name);
            $("#weather").text(response.weather[0].main);
            $("#temperature").text("Temperature " + response.main.temp + ' ℉');
            $("#maxTemp").text("High " + response.main.temp_max + ' ℉');
            $("#minTemp").text("Low " + response.main.temp_min + ' ℉');
            $("#windSpeed").text("Wind Speed: " + response.wind.speed + " mph");
            $("#humidity").text("Humidity " + response.main.humidity + "%");
            if ((response.rain || response.snow) === undefined) {
                $("#percipitation").css("display: none");
            } else if (response.rain) {
                $("#percipitation").text("Rain " + response.rain + " in");
            } else {
                $("#percipitation").text("Snow " + response.snow + " in");
            };

            // Logic decides what picture to show next to the Temperature Description (isthisAI.jpg)
            if (response.weather[0].id < 299) {
                $("#weatherImg").prepend('<img src="/img/004-thunderstorm.svg" />')
            } else if (response.weather[0].id >= 300 && response.weather[0].id < 399) {
                $("#weatherImg").prepend('<img src="/img/011-rainy-1.svg" />')
            } else if (response.weather[0].id >= 500 && response.weather[0].id < 504) {
                $("#weatherImg").prepend('<img src="/img/023-forecast.svg" />')
            } else if (response.weather[0].id >= 511 && response.weather[0].id < 532) {
                $("#weatherImg").prepend('<img src="/img/013-rain.svg" />')
            } else if (response.weather[0].id >= 600 && response.weather[0].id < 699 && !611 && !612) {
                $("#weatherImg").prepend('<img src="/img/009-snow.svg" />')
            } else if (response.weather[0].id === 611 || response.weather[0].id === 612) {
                $("#weatherImg").prepend('<img src="/img/010-sleet.svg" />')
            } else if (response.weather[0].id >= 700 && response.weather[0].id < 799) {
                $("#weatherImg").prepend('<img src="/img/024-foggy.svg" />')
            } else if (response.weather[0].id === 800 && (hour < 7 || hour > 19)) {
                $("#weatherImg").prepend('<img src="/img/015-moon.svg" />')
            } else if (response.weather[0].id === 800 && (hour > 7 && hour < 19)) {
                $("#weatherImg").prepend('<img src="/img/032-sun.svg" />')
            } else if (response.weather[0].id === 801 && (hour < 7 || hour > 19)) {
                $("#weatherImg").prepend('<img src="/img/031-cloud.svg" />')
            } else if (response.weather[0].id === 801 && (hour > 7 && hour < 19)) {
                $("#weatherImg").prepend('<img src="/img/014-overcast.svg" />')
            } else if (response.weather[0].id >= 802) {
                $("#weatherImg").prepend('<img src="/img/014-overcast.svg" />')
            };
        });
    })


    // Handles content after each serch query
    // TODO requests are processing twice at a time!

    google.maps.event.addListener(autocomplete, 'place_changed', function () {
        var place = autocomplete.getPlace();
        var inputLat = place.geometry.location.lat();
        var inputLon = place.geometry.location.lng();

        // fetch data from OpenWeatherMap API 
        fetch("https://api.openweathermap.org/data/2.5/weather?lat=" + inputLat + "&lon=" + inputLon + "&type=like&units=imperial&APPID=" + apiKey).then(function (response) {
            console.log("response", response);
            return response.json();
        }).then(function (response) {
            console.log("response", response);
            let resultLat = response.coord.lat;
            let resultLon = response.coord.lon;

            // fetch timezone data of previous query from TimeZoneDB API
            let hour = fetch("http://api.timezonedb.com/v2/get-time-zone?key=" + timezonedbKey + "&format=json&by=position&lat=" + resultLat + "&lng=" + resultLon).then(function (response) {
                console.log("resposne", response);
                return response.json();
            }).then(function (response) {
                let timeSeconds = new Date((response.timestamp * 1000) + response.gmtOffset);
                let hour = timeSeconds.getUTCHours();
                return hour;
            });

            // Logs the current hour of the queried timezone for later determining if it's after sunset or not
            console.log(hour);

            // Removes the image if there already is one ## WARNING REMOVES ALL IMG ELEMENTS FROM PAGE ### ( we need to fix this *sigh* )
            $('img').remove();

            // Inserts various weather data into Divs basedon ID 
            $("#location").text(response.name);
            $("#weather").text(response.weather[0].main);
            $("#temperature").text("Temperature " + response.main.temp + ' ℉');
            $("#maxTemp").text("High " + response.main.temp_max + ' ℉');
            $("#minTemp").text("Low " + response.main.temp_min + ' ℉');
            $("#windSpeed").text("Wind Speed: " + response.wind.speed + " mph");
            $("#humidity").text("Humidity " + response.main.humidity + "%");

            // Logic determining if it's raining or not
            if ((response.rain || response.snow) === undefined) {
                $("#percipitation").css("display: none"); // TODO is supposed to remove the element from the page but .remove() did not work so like idk, maybe lets try again
            } else if (response.rain) {
                $("#percipitation").text("Rain " + response.rain + " in");
            } else {
                $("#percipitation").text("Snow " + response.snow + " in");
            };

            // Logic decides what picture to show next to the Temperature Description (isthisAI.jpg)
            if (response.weather[0].id < 299) {
                $("#weatherImg").prepend('<img src="/img/004-thunderstorm.svg" />')
            } else if (response.weather[0].id >= 300 && response.weather[0].id < 399) {
                $("#weatherImg").prepend('<img src="/img/011-rainy-1.svg" />')
            } else if (response.weather[0].id >= 500 && response.weather[0].id < 504) {
                $("#weatherImg").prepend('<img src="/img/023-forecast.svg" />')
            } else if (response.weather[0].id >= 511 && response.weather[0].id < 532) {
                $("#weatherImg").prepend('<img src="/img/013-rain.svg" />')
            } else if (response.weather[0].id >= 600 && response.weather[0].id < 699 && !611 && !612) {
                $("#weatherImg").prepend('<img src="/img/009-snow.svg" />')
            } else if (response.weather[0].id === 611 || response.weather[0].id === 612) {
                $("#weatherImg").prepend('<img src="/img/010-sleet.svg" />')
            } else if (response.weather[0].id >= 700 && response.weather[0].id < 799) {
                $("#weatherImg").prepend('<img src="/img/024-foggy.svg" />')
            } else if (response.weather[0].id === 800 && (hour < 7 || hour > 19)) {
                $("#weatherImg").prepend('<img src="/img/015-moon.svg" />')
            } else if (response.weather[0].id === 800 && (hour >= 7 && hour <= 19)) {
                $("#weatherImg").prepend('<img src="/img/032-sun.svg" />') // TODO sun.svg not displaying 
            } else if (response.weather[0].id === 801 && (hour < 7 || hour > 19)) {
                $("#weatherImg").prepend('<img src="/img/031-cloud.svg" />')
            } else if (response.weather[0].id === 801 && (hour >= 7 && hour <= 19)) {
                $("#weatherImg").prepend('<img src="/img/014-overcast.svg" />')
            } else if (response.weather[0].id >= 802) {
                $("#weatherImg").prepend('<img src="/img/014-overcast.svg" />')
            };
        });
    });
});