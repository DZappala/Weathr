import {
    apiKey,
    ipstackKey,
    timezonedbKey
} from "./config.js";

$(document).ready(function () {

    fetch("http://api.ipstack.com/check?access_key=" + ipstackKey).then(function (response) {
        console.log("response")
        return response.json();
    }).then(function (response) {
        let currentLat = response.latitude;
        let currentLon = response.longitude;
        fetch("https://api.openweathermap.org/data/2.5/weather?lat=" + currentLat + "&lon=" + currentLon + "&type=like&units=imperial&APPID=" + apiKey).then(function (response) {
            console.log("response", response);
            return response.json();
        }).then(function (response) {
            console.log("response", response);
            var now = new Date();
            var hour = now.getHours();
            $("#location").text(response.name);
            $("#weather").text(response.weather[0].main);
            $("#temperature").text("Temperature " + response.main.temp + '&deg;');
            $("#maxTemp").text("High " + response.main.temp_max + '&deg;');
            $("#minTemp").text("Low " + response.main.temp_min + '&deg;');
            $("#windSpeed").text("Wind Speed: " + response.wind.speed + " mph");
            $("#humidity").text("Humidity " + response.main.humidity + "%");
            if ((response.rain || response.snow) === undefined) {
                $("#percipitation").css("display: none");
            } else if (response.rain) {
                $("#percipitation").text("Rain " + response.rain + " in");
            } else {
                $("#percipitation").text("Snow " + response.snow + " in");
            };
            // TODO images stack after every API call
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

    $('#weatherSearch').click((event) => {
        event.preventDefault();
        let value = document.getElementById('weatherText').value // TODO autocorrect wrong search queries
        // TODO handle country requests? (maybe two different search boxes (city, country) )
        fetch("https://api.openweathermap.org/data/2.5/weather?q=" + value + "&type=like&units=imperial&APPID=" + apiKey).then(function (response) {
            console.log("response", response);
            return response.json();
        }).then(function (response) {
            console.log("response", response);
            let resultLat = response.coord.lat;
            let resultLon = response.coord.lon;
            let hour = fetch("http://api.timezonedb.com/v2/get-time-zone?key=" + timezonedbKey + "&format=json&by=position&lat=" + resultLat + "&lng=" + resultLon).then(function (response) {
                console.log("resposne", response);
                return response.json();
            }).then(function (response) {
                let timeSeconds = new Date((response.timestamp * 1000) + response.gmtOffset);
                let hour = timeSeconds.getUTCHours();
                return hour;
            });
            console.log(hour);
            $("#location").text(response.name);
            $("#weather").text(response.weather[0].main);
            $("#temperature").text("Temperature " + response.main.temp + '&deg;');
            $("#maxTemp").text("High " + response.main.temp_max + '&deg;');
            $("#minTemp").text("Low " + response.main.temp_min + '&deg;');
            $("#windSpeed").text("Wind Speed: " + response.wind.speed + " mph");
            $("#humidity").text("Humidity " + response.main.humidity + "%");
            if ((response.rain || response.snow) === undefined) {
                $("#percipitation").css("display: none");
            } else if (response.rain) {
                $("#percipitation").text("Rain " + response.rain + " in");
            } else {
                $("#percipitation").text("Snow " + response.snow + " in");
            };
            // TODO images stack after every API call
            // TODO time in hours is local and not at the location that is searched
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
    });



});