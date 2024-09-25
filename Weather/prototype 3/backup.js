if (localStorage.dateTime != null
    && parseInt(localStorage.dateTime) + 10000 > Date.now())
    {
        let freshness = Math.round((Date.now() - localStorage.dateTime)/1000) + " second(s)";
        document.getElementById("city").innerHTML=localStorage.location;
        document.getElementById("icon").src= "https://openweathermap.org/img/wn/"+localStorage.icon+".png";
        document.getElementById("description").innerHTML=localStorage.description;
        document.getElementById("temperature").innerHTML=localStorage.temperature + "C";
        document.getElementById("humidity").innerHTML=localStorage.humidity + "%";
        document.getElementById("pressure").innerHTML=localStorage.pressure + "mb";
        document.getElementById("wind").innerHTML=localStorage.wind + "km/h";
        document.getElementById("dateTime").innerHTML=localStorage.time;
        //document.getElementById("time").innerHTML=localStorage.time;
        //document.getElementById("lastupdated").innerHTML="updating in"+ freshness;
    }

else{
fetch("http://localhost/myprototype3/myapi.php").then(function(response) {
    return response.json()})
.then(function(data) {
    console.log(data)
    // checking whether the API is fetching the data or not, and give the response in console. fetch is a promise.
document.getElementById("city").textContent =  data.city + ", Nepal";  // the city name data is paste to html class called city.
document.getElementById("icon").src= "https://openweathermap.org/img/wn/"+data.icon+".png"; // icon is fetch and paste to html.
document.getElementById("description").textContent=data.description;
document.getElementById("temperature").textContent ="Temperature: " + data.temperature + " C"; // the temperature data is paste to html class called temp.
document.getElementById("humidity").textContent = "Humidity: " + data.humidity + "%";
document.getElementById('pressure').textContent="Pressure: " + data.pressure + "mb";
document.getElementById("wind").textContent = "Wind speed: " + data.wind + " km/h";
document.getElementById("dateTime").innerHTML=" Time: " + data.date;


localStorage.location=data.city + ",Nepal";             
localStorage.icon=data.icon;
localStorage.description=data.description;
localStorage.temperature="Temperature: " + data.temperature ;
localStorage.humidity="Humidity: " + data.humidity ;
localStorage.pressure="Pressure: " + data.pressure ;
localStorage.wind="Wind speed: " + data.wind ;
localStorage.dateTime=Date.now();
localStorage.time=data.date;

})
.catch ((err)=>{
    console.log(err);
})

}
