let weather = {
    apiKey: "30ea757d9d69636c874e460800611b40",
    fetchWeather: function (city) {
      fetch(
        "https://api.openweathermap.org/data/2.5/weather?q="+city+"&units=metric&appid="+this.apiKey
      )
        .then((response) => {
          if (!response.ok) {
            alert("No weather found.");
            throw new Error("No weather found.");
          }
          return response.json();
        })
        .then((data) => this.displayWeather(data));
    },
    displayWeather: function (data) {
      const { name } = data;
      const { icon, description } = data.weather[0];
      const { temp, humidity } = data.main;
      const { speed } = data.wind;
      const {dt}=data;
      const date = new Date(dt * 1000);
      const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const dayOfWeek = daysOfWeek[date.getDay()];
      const dateString = `${date.toLocaleDateString()}, ${dayOfWeek}`;
      document.querySelector(".city").innerText = "Weather in " + name;
      document.querySelector(".icon").src ="https://openweathermap.org/img/wn/" + icon + ".png";
      document.querySelector(".description").innerText = description;
      document.querySelector(".temp").innerText = temp + "°C";
      document.querySelector(".humidity").innerText ="Humidity: " + humidity + "%";
      document.querySelector(".wind").innerText ="Wind speed: " + speed + " km/h";
      document.querySelector(".dt").innerText ="Date and Day: " + dateString + " UTC";
      document.querySelector(".weather").classList.remove("loading");
      document.body.style.backgroundImage ="url('https://images.unsplash.com/photo-1592210454359-9043f067919b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80')";
    
      // Save the weather data to localStorage
      localStorage.setItem("weatherData", JSON.stringify(data));
      localStorage.setItem("lastUpdated", Date.now());
    },
    search: function () {
      this.fetchWeather(document.querySelector(".search-bar").value);
    },
  };
  
  // Define a function to check the freshness of the data stored in localStorage
  function checkFreshness() {
    const storedData = localStorage.getItem("weatherData");
    const lastUpdated = localStorage.getItem("lastUpdated");
    
    // If there is no stored data, or if the data is more than 30 minutes old, return false
    if (!storedData || (Date.now() - lastUpdated > 1800000)) {
      return false;
    }
    
    // Otherwise, return true
    return true;
  }
  
  // When the page loads, check if there is fresh data in localStorage
  if (checkFreshness()) {
    const storedData = JSON.parse(localStorage.getItem("weatherData"));
    weather.displayWeather(storedData);
  } else {
    weather.fetchWeather("Jaleswar");
  }


  document.querySelector(".search button").addEventListener("click", function () {
    weather.search();
  });
  
  document.querySelector(".search-bar").addEventListener("keyup", function (event) {
      if (event.key == "Enter") {
        weather.search();
      }
    });

    let rainfallConditionSpan = document.getElementById("rainfall-condition");

    // Define a function to check the rainfall amount and set the condition accordingly
    function checkRainfall(humidity) {
      let rainfallCondition;
      if (humidity <= 0) {
        rainfallCondition = "rainfall N/A.";
      } else if (humidity > 0 && humidity <= 50) {
        rainfallCondition = "Light rainfall.";
      } else if (humidity> 51 && humidity <= 90) {
        rainfallCondition = "Moderate rainfall.";
      } else {
        rainfallCondition = "Heavy rainfall.";
      }
      
      // Output the rainfall condition to the span element
      rainfallConditionSpan.innerHTML = rainfallCondition;
    }
    
    // Call the checkRainfall function with a rainfall amount (in millimeters)
    checkRainfall(30);

  // weather.fetchWeather("Jaleswar");