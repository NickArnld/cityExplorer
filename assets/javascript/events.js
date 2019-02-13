$(document).ready(function(){

    $(".searchButton").on("click", function(){
        console.log("Clicked")
      
        var where = $("#searchBar").val();

        var queryURL = "http://api.eventful.com/json/events/search?app_key=Pts8nj75srVCqq6J&location="+where+"&date=This+Week&page_size=5&sort_order=popularity";
    
        $.ajax({
            url: queryURL,
            dataType: "json",
            method: "GET"
          }).then(function(response) {
        
           response.events.event.forEach((event) => {
          
            (event.image === null ? "" : event.image.medium.url)

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
            $(".anchor").append(html);
          })
        });
    });
});

