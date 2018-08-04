import { apiKey } from "./config.js"

$(document).ready(function() {
    
$('#weatherSearch').click((event) => { 
    event.preventDefault();   
    let value = document.getElementById('weatherText').value
    fetch("http://api.openweathermap.org/data/2.5/weather?q=" + value + "&units=imperial&APPID=" + apiKey).then(function(response) {
        //const result = response;
        $("#weather").text(response.weather[0].description);
    });//.catch(function() {alert("weather data could not be retrieved, please check your query and try again")});
});



})