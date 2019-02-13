
$(document).ready(function(){

    var zip = "55420" //this will pull from object  currentCity.zipCode
    const apiKey ='APPID=7c23f04d70a1191aa2f4e9bdcadb84b2';
   
    // create an ajax function call to the weather API here
    function callWeatherAPI(zip){
        var queryUrl = "https://api.openweathermap.org/data/2.5/weather?zip="+zip+"&units=imperial&APPID=7c23f04d70a1191aa2f4e9bdcadb84b2"; 
        $.ajax({
            url: queryUrl,
            method:"GET"
        }).then(function(response){
            // work with data from the api response
            var weatherInfo = response.weather[0].description;
            // write the weather city name on the dome
        var weatherHeader= "Current weather Conditions for "+response.name;

        var weatherData = 
            "<tr>"  +
                "<td>" + response.main.humidity + "</td>" +
                "<td>" + response.main.temp_min + "</td>" +
                "<td>" + response.main.temp + "</td>" +
                "<td>" + response.main.temp_max + "</td>" +
            "</tr>";
        var weatherDiv=`
            <div class="row">
                <div class="col-sm-12">
                    <div class="card mt-1">
                        <div class="card-header">
                            <h3 id="weather">${weatherHeader}</h3>
                        </div>
                        <div class="card-body">
                            <table id="currentweather">
                                <tr>
                                    <th>Humidity</th>
                                    <th>Min Temp</th>
                                    <th>Current Temp</th>
                                    <th>Max Temp</th>
                                    ${weatherData}
                                </tr>   
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        `;console.log(weatherDiv);
            $("#weather").append(
                weatherDiv
              )
        });
    }
    
    // create an ajax function call to the weather API here
    function callforcastAPI(zip) {
        queryUrl = "https://api.openweathermap.org/data/2.5/forecast?zip="+zip+"&cnt=38&units=imperial&APPID=7c23f04d70a1191aa2f4e9bdcadb84b2";
        $.ajax({
            url: queryUrl,
            method: "GET"
        }).then(function (response) {
            console.log("forecast below");
            console.log(response);
            var forecastdata  = response;
            var forecastInfo = response.list; 
            console.log(forecastInfo);
            // write to the dom the forecast header
            var forecastHeader ="5 day forecast for "+forecastdata.city.name;
            
            //variable to hold the table rows of the 5 day forecast
            var forecastDatahtml= "";
            //loop the forecast array t
            for (let i in forecastInfo){
                let currenttime = moment(forecastInfo[i].dt_txt).format("ddd, MM-DD-YYYY, hA");
               
                    forecastDatahtml += "<tr>"  +
                        "<td>"  + currenttime  + "</td>"  +
                        "<td>"  + forecastInfo[i].main.humidity  + "</td>"  +
                        "<td>"  + forecastInfo[i].main.temp_min   + "</td>"  +
                        "<td>"  + forecastInfo[i].main.temp_max + "</td>"  + 
                        "<td>"  + forecastInfo[i].weather[0].description  + "</td>"  +
                    "</tr>";
            }
            var forecastDiv =`
                <div class="row">
                    <div class="col-sm-12">
                        <div class="card mt-1">
                            <div class="card-header">
                                <h3 id="forecast">${forecastHeader}</h3>
                            </div>
                            <div class="card-body">
                                <table id="fivedayforecast">
                                    <tr>
                                        <th>Day/Time</th>
                                        <th>Humidity</th>
                                        <th>Min Temp (F)</th>
                                        <th>Max Temp (F)</th>
                                        <th>weather</th>
                                    </tr>   
                                    ${forecastDatahtml}
                                </table>
                            </div>
                        </div>
                    </div>
                </div>            
                `;
                $("#forecast").append(forecastDiv);  
        });
    } 
    // call the weather and forecast api here
    callWeatherAPI(zip);
    callforcastAPI(zip);
});