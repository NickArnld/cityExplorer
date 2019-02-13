const zipKey = "CJjDASN6yTbqhEBYPoGi6tapGBm7wyq08Ilrn7OEiR1Ll0AnbONxYKXriUusT0uC";
const stateArr = ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"];
var currentCity = {
    name: "",
    state: "",
    zipCode: "55987",
    coordinates: [], 
};
var searchBar = $('#searchBar');
var stateSelect = $('#stateSelect');

window.onload = createDropDown;

$('#searchButton').click(()=>{searchHandler(searchBar.val(), stateSelect.val())});

$('#weatherTab').click(()=>{loadWeather(currentCity)});

$('#foodTab').click(()=>{loadFood(currentCity)});

$('#eventsTab').click(()=>{loadEvent(currentCity)});

//Main Search Functions
function createDropDown(){
    for(x in stateArr){
        stateSelect.append(`<option value='${stateArr[x]}'>${stateArr[x]}</option>`)
    }
}

function searchHandler(search, state){
    searchBar.val("");
    var possibleNumber = parseInt(search);

    if(isNaN(possibleNumber)){
        if(typeof search === "string"){
            cityOnly(search, state)
        } else {
            console.log("search error");
        }
    } else {
        zipHandler(possibleNumber);
    } 
}

function cityOnly(city, state){
    var queryUrl = `https://www.zipcodeapi.com/rest/${zipKey}/city-zips.json/${city}/${state}`;
  
    $.ajax({
        url: queryUrl,
        method: "GET" 
    }).then(function(response){
        var firstZipCode = response.zip_codes[0];
        zipHandler(firstZipCode);
        $('#errorMsg').empty();
    }).fail(function(error){
        console.log(error.statusText);
        searchError();
    });
}

function zipHandler(zip){
    var queryUrl = `https://www.zipcodeapi.com/rest/${zipKey}/info.json/${zip}/degrees`;

    $.ajax({
        url: queryUrl,
        method: "GET" 
    }).then(function(response){        
        cityObj(response);
        $('#errorMsg').empty();        
    }).fail(function(error){
        console.log(error.statusText);
        searchError();
    });
}

function cityObj(resObj){
    currentCity.name = resObj.city;
    currentCity.state = resObj.state;
    currentCity.zipCode = resObj.zip_code;
    currentCity.coordinates = [];
    currentCity.coordinates.push(resObj.lat);
    currentCity.coordinates.push(resObj.lng);
    // console.log("Response", resObj);
    // console.log("object", currentCity);
    loadWeather(currentCity);    
}

function searchError(){
    //Needs formating
    var targetDiv = $('#errorMsg');
    targetDiv.empty();
    targetDiv.append("<h1>Sorry, we couldn't find that City</h1>" );
}

//Weather Functions
function loadWeather(cityObj){
    console.log("Load Weather Tab for", cityObj.name);
    $('#content').empty();
    callWeatherAPI(cityObj.zipCode);
    callforcastAPI(cityObj.zipCode);
}

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
    `;
    console.log('weatherDiv');
    $("#content").append(weatherDiv);
    });
}

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
        console.log("forecastinfo",forecastInfo);
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
        `;

        console.log('forecastDiv');
        $("#content").append(forecastDiv);  
    });
}

//Food Functions
function loadFood(cityObj){
    console.log("Load Food Tab");
    $('.main').html(`Food Here for ${cityObj.name}, ${cityObj.state}`);
}

//Event Functions
function loadEvent(cityObj){
    console.log("Load Events Tab");
    $('.main').html(`Events Here for ${cityObj.name}, ${cityObj.state}`);
}

jQuery.ajaxPrefilter(function(options) {
   if (options.crossDomain && jQuery.support.cors) {
       options.url = 'https://ca329482.herokuapp.com/' + options.url;
   }
});