// For work with API
const apiKey = "5b3eb5d921a2a89f826394f97c8cdb78";
const url = "https://api.openweathermap.org/data/2.5";

// Grab the elements
let city =
  document.querySelector(".weather-app__main-info__city").innerText.length === 0
    ? "Kyiv"
    : document.querySelector(".weather-app__main-info__city").innerText;
// * For the main info
const body = document.querySelector("body");
const weatherImg = document.querySelector(".weather-app__main-info__img img");
const weatherTemp = document.querySelector(
  ".weather-app__main-info__temp .temp-num"
);
const weatherDescription = document.querySelector(
  ".weather-app__main-info__description"
);
// * For the secondary info
const windFlow = document.querySelector(".wind-flow__num");
const feelsLike = document.querySelector(".feels-like__num");
const humidity = document.querySelector(".humidity__num");
// * For the forecasts
const forecastCard = document.querySelectorAll(".forecast");

// Getting todays weather
async function getTodaysWeatherInfo(url, apiKey, city) {
  try {
    const response = await fetch(
      `${url}/weather?q=${city}&APPID=${apiKey}&units=metric`
    );
    const data = await response.json();
    return data;
  } catch (err) {
    alert(err);
  }
}

getTodaysWeatherInfo(url, apiKey, city).then((data) => {
  weatherTemp.innerText = Math.round(data.main.temp);
  city = document.querySelector(".weather-app__main-info__city").innerText =
    data.name;
  weatherDescription.innerText = data.weather[0].description;
  weatherImg.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  windFlow.innerText = data.wind.speed;
  feelsLike.innerText = Math.round(data.main.feels_like);
  humidity.innerText = data.main.humidity;
});

// Getting 5-day forecast
async function getFiveDaysWeatherInfo(url, apiKey, city) {
  const response = await fetch(
    `${url}/forecast?q=${city}&APPID=${apiKey}&units=metric`
  );
  const data = await response.json();
  return data;
}

getFiveDaysWeatherInfo(url, apiKey, city)
  .then((data) => data.list) // take weather list
  .then((weatherArr) =>
    weatherArr.filter((time) => time.dt_txt.substr(-8, 2) === "12")
  ) //filter weather list by ne day
  .then((time) => {
    console.log(time);
    forecastCard.forEach((card,index) => {
      card.children[0].innerText = time[index].weather[0].main;
      card.children[1].children[0].src = `https://openweathermap.org/img/wn/${time[index].weather[0].icon}.png`;
      card.children[2].innerText = time[index].dt_txt.substr(5, 5);
    });
  });

// Change UI
const date = new Date();
const hours = date.getHours();

setInterval(
  (function () {
    if (hours > 20 && hours < 7) {
      body.dataset.time = "night";
    } else {
      body.dataset.time = "day";
    }
  })(),
  3600000
);

