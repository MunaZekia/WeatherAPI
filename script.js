const apikey= "5d8f706975b0652dc3b0077ecad2304a"
if (!localStorage.getItem("cities")){
    localStorage.setItem("cities",JSON.stringify([]))
}
cityButton()
function cityButton(){
    const list= document.getElementById("city-list")
    list.innerHTML=""
    const citiesArray=JSON.parse(localStorage.getItem("cities"))
    citiesArray.forEach(city=>{
        list.innerHTML+=`
    <div class="cityButton">
    
        <button onclick="retrieveWeather('${city}')">${city}</button>
    </div>
    `})
}
async function retrieveWeather(city) {
    const coordinates= await getCoordinates(city)
    getCurrentWeather(coordinates)
    fiveDayWeather(coordinates)
}
async function getCoordinates(city) {
    var lat 
    var lon
    let cityName=city||document.querySelector("#city").value
    document.querySelector("#city").value=""
    const coordinatesURL= `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${apikey}`
    await fetch(coordinatesURL)
        .then(res=>res.json())
        .then(res=>{
            storeCityName(res[0].name)
            lat=res[0].lat
            lon=res[0].lon
        })
        return [lat,lon]
}
function getCurrentWeather([lat,lon]){
    const currentURL= `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apikey}`
    fetch (currentURL)
        .then(res=>res.json())
        .then(res=>{
            var name= res.name
            var date= new Date().toLocaleDateString()
            var temp=res.main.temp
            var wind=res.wind.speed
            var humidity=res.main.humidity
            var icon= res.weather[0].icon
            document.getElementById("current").innerHTML=`
            <div id= "border">
                <h2>${name} ${date} <img src="http://openweathermap.org/img/wn/${icon}@2x.png"></h2>
                <p>Temp: ${temp} °F</p>
                <p>Wind: ${wind} MPH</p>
                <p>Humidity:${humidity} %</p>
            </div>
            <h3> 5-Day Forecast
            `
        })
    }
function fiveDayWeather([lat,lon]){
    var windSpeed
    var temperature
    var humidity
    var icon
    var dateText
    document.getElementById("five-days").innerHTML=""
    const apiURL=`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apikey}`
    fetch(apiURL)
        .then(res=>res.json())
        .then(res=>{
            for (var i=4; i<=36; i+=8){
                windSpeed= res.list[i].wind.speed
                temperature=res.list[i].main.temp
                humidity=res.list[i].main.humidity
                icon=res.list[i].weather[0].icon
                dateText=res.list[i]["dt_txt"]
                document.getElementById("five-days").innerHTML+=`
                <div class= "card">
                    <div class= "date">${new Date(dateText).toLocaleDateString()}
                    </div> 
                    <img class = "icon" src="http://openweathermap.org/img/wn/${icon}@2x.png">
                    <p class= "temp"> Temp:${temperature} °F</p>
                    <p class="wind">Wind:${windSpeed} MPH</p>
                    <p class="humidity">Humidity:${humidity} %</p>
                </div>
                    `
            }
        })
}

function storeCityName(cityName){
    console.log(cityName)
    var cityArray=JSON.parse(localStorage.getItem("cities"))
    if(!cityArray.includes(cityName)){
        cityArray.push(cityName)
    }
    localStorage.setItem("cities",JSON.stringify(cityArray))
    cityButton()
}
