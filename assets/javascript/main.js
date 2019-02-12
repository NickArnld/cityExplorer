const zipKey = "CJjDASN6yTbqhEBYPoGi6tapGBm7wyq08Ilrn7OEiR1Ll0AnbONxYKXriUusT0uC";
const stateArr = ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"];
var currentCity = {
    name: "",
    state: "",
    zipCode: "",
    coordinates: [], 
};
var searchBar = $('#searchBar');
var stateSelect = $('#stateSelect');

window.onload = createDropDown;

$('#searchButton').click(()=>{searchHandler(searchBar.val(), stateSelect.val())});

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
    });
}

function zipHandler(zip){
    var queryUrl = `https://www.zipcodeapi.com/rest/${zipKey}/info.json/${zip}/degrees`;

    $.ajax({
        url: queryUrl,
        method: "GET" 
    }).then(function(response){        
        cityObj(response);        
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
    console.log("object", currentCity);    
}

jQuery.ajaxPrefilter(function(options) {
   if (options.crossDomain && jQuery.support.cors) {
       options.url = 'https://ca329482.herokuapp.com/' + options.url;
   }
});