 //food
const stars=["assets/images/regular/3.5.png","assets/images/regular/4.png","assets/images/regular/4.5.png","assets/images/regular/5.png"]
var sfood="resturants";
var ratings=3;
var cost="$$$$";

$(".price").on("click", function(){
    cost=$(this).attr("data-content");
    var latitude=currentCity.coordinates[0];
    var longitude=currentCity.coordinates[1];
    var locate =`latitude=${latitude}&longitude=${longitude}`;
    const queryURL="https://api.yelp.com/v3/businesses/search?term="+ sfood +"&"+locate+"";

    $.ajax({
        url:queryURL,
    headers: {"Authorization": "Bearer vDe83QZUJVEgLPbqTMjeIQGWDB7NhgrxRsWNyC4GGUYEzUmwxFGyecJ61y-U0SAW6QTEpWhOBqZN9yBMpXnueUDldvGqnskcz3ydHuVB9V3wglA_ro_VMhAa-bNdXHYx"},
        method:"GET"
    }).then( function(response){
        $(".main").removeClass("hauto")
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
            <a href="${urll}">Visit the yelp page!</a> <img src="assets/images/Yelp_trademark_RGB.png" style="float:right; width:50px;">
            </div>
            </div>
        </div>`)
            $(".main").addClass("hauto")
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
    var latitude=currentCity.coordinates[0];
    var longitude=currentCity.coordinates[1];
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
            <a href="${urll}">Visit the yelp page!</a> <img src="assets/images/Yelp_trademark_RGB.png" style="float:right; width:50px;">
            </div>
            </div>
        </div>`)
            $(".main").addClass("hauto")
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
    var latitude=currentCity.coordinates[0];
    var longitude=currentCity.coordinates[1];
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
            <a href="${urll}">Visit the yelp page!</a> <img src="assets/images/Yelp_trademark_RGB.png" style="float:right; width:50px;">
            </div>
            </div>
        </div>`)
            $(".main").addClass("hauto")
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
