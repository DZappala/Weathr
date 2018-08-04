import { apiKey } from "./config.js";

$(document).ready(function () {

    $('#weatherSearch').click((event) => {
        event.preventDefault();
        let value = document.getElementById('weatherText').value
        fetch("https://api.openweathermap.org/data/2.5/weather?q=" + value + "&type=like&units=imperial&APPID=" + apiKey).then(function (response) {
            console.log("response", response);
            return response.json();
        }).then(function (response) {
            console.log("response", response);
            $("#location").text(response.name);
            $("#weather").text(response.weather[0].main);
            $("#temperature").text("Temperature " + response.main.temp + '&deg;');
            $("#maxTemp").text("High " + response.main.temp_max + '&deg;');
            $("#minTemp").text("Low " + response.main.temp_min + '&deg;');
            $("#windSpeed").text("Wind Speed: " + response.wind.speed + " mph");
            $("#humidity").text("Humidity " + response.main.humidity + "%");
            if((response.rain || response.snow) === undefined) {
                $("#percipitation").css("display: none");
            } else if (response.rain) {
                $("#percipitation").text("Rain " + response.rain + " in");
            } else {
                $("#percipitation").text("Snow " + response.snow + " in");
            };

        }); //.catch(function() {alert("weather data could not be retrieved, please check your query and try again")});
    });



});