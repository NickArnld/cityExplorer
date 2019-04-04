const zipKey = "CJjDASN6yTbqhEBYPoGi6tapGBm7wyq08Ilrn7OEiR1Ll0AnbONxYKXriUusT0uC";
const stateArr = ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"];
var currentCity = {
    name: "Minneapolis",
    state: "",
    zipCode: "55401",
    coordinates: [], 
};
var searchBar = $('#searchBar');
var stateSelect = $('#stateSelect');

window.onload = createDropDown;

//add if statements

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
    $('#navb').addClass("hide");
    $('#content').empty();
    $('.cards').empty();
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
                <table class="table is-bordered is-striped" id="currentweather">
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
                    <table  class="table is-bordered is-striped" id="fivedayforecast">
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
    $('#navb').removeClass("hide");
    $('#content').empty();
    console.log("Load Food Tab");
    foodSearchBar(cityObj);
}

function foodSearchBar(cityObj){
    var sfood="hamburgers";
    var ratings=3;
    var cost="$$$$";


    $(".price").on("click", function(){
        cost=$(this).attr("data-content");
        var latitude=cityObj.coordinates[0];
        var longitude=cityObj.coordinates[1];
        var locate =`latitude=${latitude}&longitude=${longitude}`;
        const queryURL="https://api.yelp.com/v3/businesses/search?term="+ sfood +"&"+locate+"";

        $.ajax({
            url:queryURL,
        headers: {"Authorization": "Bearer vDe83QZUJVEgLPbqTMjeIQGWDB7NhgrxRsWNyC4GGUYEzUmwxFGyecJ61y-U0SAW6QTEpWhOBqZN9yBMpXnueUDldvGqnskcz3ydHuVB9V3wglA_ro_VMhAa-bNdXHYx"},
            method:"GET"
        }).then( function(response){
            $("#content").empty()
            console.log(response)
            var cmount=0;
            var viewa=5;
            for(let i=0;i<20;i++){
                let resp=response.businesses[i]
                if(resp.rating>ratings&&cmount<viewa&&resp.price<=cost){
                let name=resp.name;
                let ratingg=resp.rating;
                ratingg=ratingg.toString();
                let rating=`assets/images/regular/${ratingg}.png`;
                let prices=resp.price;
                let link= resp.image_url;
                let urll=resp.url;
                let address=resp.location.display_address[0]+" "+resp.location.display_address[1];
                let content=$("<div>").html(`<div class='card'>
                <div class="card-image">
                <figure class="image is-4by3">
                <img src='${link}' >
                </figure>
                </div>
                <div class="card-content">
                    <div class="media-content">
                    <p class="title is-4">${name} &nbsp <h4>${prices}</h4></p>
                    <img src="${rating}" class="subtitle is-6">
                    </div>
                </div>
            
                <div class="content">
                    <h4>${address}</h4>
                    <br>
                <a href="${urll}">Visit the yelp page!</a> <img src="assets/images/yelp/Yelp_trademark_RGB.png" style="float:right; width:50px;">
                </div>
                </div>
                </div>`)
                content.addClass("cards")
                $("#content").append(content)
                cmount++
                } 
                else{
                    console.log("wasnt good enough or too much")
                }
            }
        })
    })

    $(".cont").on("click", function(){
        sfood=$(this).attr("data-content")
        var latitude=cityObj.coordinates[0];
        var longitude=cityObj.coordinates[1];
        var locate =`latitude=44.986656&longitude=-93.258133`;
        const queryURL="https://api.yelp.com/v3/businesses/search?term="+ sfood +"&"+locate+"";

        $.ajax({
            url:queryURL,
        headers: {"Authorization": "Bearer vDe83QZUJVEgLPbqTMjeIQGWDB7NhgrxRsWNyC4GGUYEzUmwxFGyecJ61y-U0SAW6QTEpWhOBqZN9yBMpXnueUDldvGqnskcz3ydHuVB9V3wglA_ro_VMhAa-bNdXHYx"},
            method:"GET"
        }).then( function(response){
            $("#content").empty()
            console.log(response)
            var cmount=0;
            var viewa=5;
            for(let i=0;i<20;i++){
                let resp=response.businesses[i]
                if(resp.rating>ratings&&cmount<viewa&&resp.price<=cost){
                let name=resp.name;
                let ratingg=resp.rating;
                ratingg=ratingg.toString();
                let rating=`assets/images/yelp/${ratingg}.png`;
                let prices=resp.price;
                let link= resp.image_url;
                let urll=resp.url;
                let address=resp.location.display_address[0]+" "+resp.location.display_address[1];
                let content=$("<div>").html(`<div class='card' style="height:450px">
                <div class="card-image" style="height:40%">
                <figure class="image is-4by3">
                <img src='${link}' >
                </figure>
                </div>
                <div class="card-content"style="height:30%;">
                    <div class="media-content">
                    <p class="title is-4" style="">${name} &nbsp <h4>${prices}</h4></p>
                    <img src="${rating}" class="subtitle is-6">
                    </div>
                </div>
            
                <div class="content" style="height:30%; padding-top:3%; padding-bottom:5%">
                    <h4>${address}</h4>
                    
                <a href="${urll}">Visit the yelp page!</a> <img src="assets/images/yelp/Yelp_trademark_RGB.png" style="float:right; width:50px;">
                <br>
                </div>
                </div>
                </div>`)
                content.addClass("cards")
                $("#content").append(content)
                cmount++
                } 
                else{
                    console.log("wasnt good enough or too much")
                }
            }
        })

    })

$("#fsb").on("click",function(){
        sfood=$("#searchf").val().trim();
        var latitude=cityObj.coordinates[0];
        var longitude=city.coordinates[1];
        var locate =`latitude=${latitude}&longitude=${longitude}`;
        const queryURL="https://api.yelp.com/v3/businesses/search?term="+ sfood +"&"+locate+"";

        $.ajax({
            url:queryURL,
        headers: {"Authorization": "Bearer vDe83QZUJVEgLPbqTMjeIQGWDB7NhgrxRsWNyC4GGUYEzUmwxFGyecJ61y-U0SAW6QTEpWhOBqZN9yBMpXnueUDldvGqnskcz3ydHuVB9V3wglA_ro_VMhAa-bNdXHYx"},
            method:"GET"
        }).then( function(response){
            $(".cards").empty()
            console.log(response)
            var cmount=0;
            var viewa=5;
            for(let i=0;i<20;i++){
                let resp=response.businesses[i]
                if(resp.rating>ratings&&cmount<viewa&&resp.price<=cost){
                let name=resp.name;
                let ratingg=resp.rating;
                ratingg=ratingg.toString();
                let rating=`assets/images/regular/${ratingg}.png`;
                let prices=resp.price;
                let link= resp.image_url;
                let urll=resp.url;
                let address=resp.location.display_address[0]+" "+resp.location.display_address[1];
                let content=$("<div>").html(`<div class='card'>
                <div class="card-image">
                <figure class="image is-4by3">
                <img src='${link}' >
                </figure>
                </div>
                <div class="card-content">
                    <div class="media-content">
                    <p class="title is-4">${name} &nbsp <h4>${prices}</h4></p>
                    <img src="${rating}" class="subtitle is-6">
                    </div>
                </div>
            
                <div class="content">
                    <h4>${address}</h4>
                    <br>
                <a href="${urll}">Visit the yelp page!</a> <img src="assets/images/yelp/Yelp_trademark_RGB.png" style="float:right; width:50px;">
                </div>
                </div>
            </div>`)
                content.addClass("cards")
                $("#content").append(content)
                cmount++
                } 
                else{
                    console.log("wasnt good enough or too much")
                }
            }
        })
    })

$("#foodTab").on("click",function(){
    var latitude=cityObj.coordinates[0];
    var longitude=city.coordinates[1];
    var locate =`latitude=${latitude}&longitude=${longitude}`;
    const queryURL="https://api.yelp.com/v3/businesses/search?term="+ sfood +"&"+locate+"";

    $.ajax({
        url:queryURL,
    headers: {"Authorization": "Bearer vDe83QZUJVEgLPbqTMjeIQGWDB7NhgrxRsWNyC4GGUYEzUmwxFGyecJ61y-U0SAW6QTEpWhOBqZN9yBMpXnueUDldvGqnskcz3ydHuVB9V3wglA_ro_VMhAa-bNdXHYx"},
        method:"GET"
    }).then( function(response){
        $("#content").empty()
        console.log(response)
        var cmount=0;
        var viewa=5;
        for(let i=0;i<20;i++){
            let resp=response.businesses[i]
            if(resp.rating>ratings&&cmount<viewa&&resp.price<=cost){
            let name=resp.name;
            let ratingg=resp.rating;
            ratingg=ratingg.toString();
            let rating=`assets/images/regular/${ratingg}.png`;
            let prices=resp.price;
            let link= resp.image_url;
            let urll=resp.url;
            let address=resp.location.display_address[0]+" "+resp.location.display_address[1];
            let content=$("<div>").html(`<div class='card'>
            <div class="card-image">
            <figure class="image is-4by3">
            <img src='${link}' >
            </figure>
            </div>
            <div class="card-content">
                <div class="media-content">
                <p class="title is-4">${name} &nbsp <h4>${prices}</h4></p>
                <img src="${rating}" class="subtitle is-6">
                </div>
            </div>
        
            <div class="content">
                <h4>${address}</h4>
                <br>
            <a href="${urll}">Visit the yelp page!</a> <img src="assets/images/yelp/Yelp_trademark_RGB.png" style="float:right; width:50px;">
            </div>
            </div>
        </div>`)
            content.addClass("cards")
            $("#content").append(content)
            cmount++
            } 
            else{
                console.log("wasnt good enough or too much")
            }
        }
    })
})
}

//Event Functions
function loadEvent(cityObj){
    $('#content').empty();
    $('#navb').addClass("hide");
    console.log("Load Events Tab");
    eventAPICall(cityObj);
}

function eventAPICall(cityObj){
    
    var where = cityObj.name;

    var queryURL = "http://api.eventful.com/json/events/search?app_key=Pts8nj75srVCqq6J&location="+where+"&date=This+Week&page_size=5&sort_order=popularity";
    
    $.ajax({
        url: queryURL,
        dataType: "json",
        method: "GET"
    }).then(function(response) {
    
        response.events.event.forEach((event) => {
        
        (event.image === null ? "" : event.image.medium.url)

        console.log();

        var date = moment(event.start_time).format("dddd, MMMM Do YYYY, h:mm a");

        const html = `
            <div class = event box>
                <div class = eventtitle>
                    <h2> ${event.title} </h2>
                </div>
                <div class = eventimg>
                    <img src= ${event.image.medium.url}>
                </div>
                <div class = eventinfo>
                    <div class = starttime>
                        <p> ${date} </p>
                    </div>
                    <div class = eventvenue>
                        <h3> ${event.venue_name} </h3>
                        <p> ${event.venue_address} </p>
                    </div>
                    <div class = eventlogo>
                        <img src = "http://api.eventful.com/images/powered/eventful_139x44.gif"
                        alt="Local Events, Concerts, Tickets">
                        <p><a href="${event.url}">Event</a> by Eventful</p>
                    </div>
                </div>
            </div>
        `
        $("#content").append(html);
        })
    });
}

jQuery.ajaxPrefilter(function(options) {
   if (options.crossDomain && jQuery.support.cors) {
       options.url = 'https://ca329482.herokuapp.com/' + options.url;
   }
});