
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const spotlightContainer = document.querySelector(".spotlight");
  if (spotlightContainer) {
    fetch("./data/members.json")
      .then((response) => response.json())
      .then((data) => {
        // Filter members with gold or silver membership levels
        const eligibleMembers = data.data.filter(
          (member) =>
            member.Membership.includes("gold") ||
            member.Membership.includes("silver")
        );

        // Randomly select 2-3 members
        const selectedMembers = [];
        const numberOfMembers = Math.min(
          eligibleMembers.length,
          Math.floor(Math.random() * 2) + 2
        );
        while (selectedMembers.length < numberOfMembers) {
          const randomIndex = Math.floor(
            Math.random() * eligibleMembers.length
          );
          selectedMembers.push(eligibleMembers.splice(randomIndex, 1)[0]);
        }

        // Render the members
        selectedMembers.forEach((member) => {
          const memberDiv = document.createElement("div");
          memberDiv.classList.add("member-card");
          memberDiv.innerHTML = `
              <img src="${member.logo}" alt="${member.Name} logo" width="100px" height="100px">
              <p>${member.Name}</p>
          `;
          spotlightContainer.appendChild(memberDiv);
        });
      })
      .catch((error) => console.error("Error loading members:", error));
  }

  // Get all "Learn More" buttons
  const openButtons = document.querySelectorAll(".modal-open");
  const closeButtons = document.querySelectorAll(".modal-close");
  const modals = document.querySelectorAll(".modal");

  // Function to open a modal
  openButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const modalId = button.getAttribute("data-modal");
      const modal = document.getElementById(modalId);
      if (modal) modal.style.display = "flex";
    });
  });

  // Function to close a modal
  closeButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const modal = e.target.closest(".modal");
      if (modal) modal.style.display = "none";
    });
  });

  // Close modal when clicking outside content
  modals.forEach((modal) => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.style.display = "none";
      }
    });
  });
});

const nav = document.querySelector(".header-nav");
const menuBtn = document.querySelector(".menu-btn");

//  getting current date
const date = new Date();
// getting the current month
let currentMonth = date.getMonth();
// getting the current year
let currentYear = date.getFullYear();

class Switch {
  constructor(switchMode) {
    this.switchBtn = switchMode;
    this.switchBtn.addEventListener("click", () => this.toggleStatus());
    this.switchBtn.addEventListener("keydown", (event) =>
      this.handleKeydown(event)
    );
  }

  handleKeydown(event) {
    // Only do something when space or return is pressed
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      this.toggleStatus();
    }
  }

  // Switch state of a switch
  toggleStatus() {
    const currentState = this.switchBtn.getAttribute("aria-checked") === "true";
    const switchDot = this.switchBtn.querySelector(".switch span");
    const newState = String(!currentState);

    this.switchBtn.setAttribute("aria-checked", newState);
    switchDot.classList.toggle("moveRight");
  }
}

// // Initialize switches
window.addEventListener("load", function () {
  // Initialize the Switch component on all matching DOM nodes
  Array.from(document.querySelectorAll("[role^=switch]")).forEach((element) => {
    new Switch(element);
  });
  displayChamberMembers();
});

// Displaying Chamber members and there membership status
function displayChamberMembers() {
  const memberCardBox = document.querySelector(".member-card-section");
  const gridBtn = document.getElementById("grid-view");
  const listBtn = document.getElementById("list-view");

  const renderMembers = function (members) {
    members.forEach((member) => {
      const html = `
        <div class="member-card">
            <figure>
              <div>
                <img src="${member.logo}" alt="${
        member.Name
      } logo" width="1000" height="623" loading="lazy">
              </div>
              <figcaption>${member.Name}</figcaption>
            </figure>
            <div class="member-info-box">
                <p>${member.Industry}</p>
                <p>${member.Address}</p>
                <p>${member.Phone}</p>
                <a href="${member.Website}">${member.Website.slice(8)}</a>
                <img src="${
                  member.Membership
                }" alt="" width="45" height="64">
            </div>
        </div>
      `;
      memberCardBox.insertAdjacentHTML("afterbegin", html);
    });
  };

  const getMembersData = async function () {
    const membersUrl = "./data/members.json";
    const response = await fetch(membersUrl);
    const data = await response.json();
    renderMembers(data.data);
  };
  getMembersData();

  // ///////////////////////////////////////////////////////
  const saveView = function (view) {
    localStorage.setItem("localView", JSON.stringify(view));
  };

  const changeView = function () {
    const btn = this;

    if (memberCardBox.classList.contains("list")) {
      memberCardBox.classList.remove("list");
    } else {
      memberCardBox.classList.remove("grid");
    }
    memberCardBox.classList.add(btn.id.slice(0, 4));
    saveView(btn.id.slice(0, 4));
  };

  const theView = function () {
    const isView = JSON.parse(localStorage.getItem("localView"));
    if (isView && isView != 0) {
      memberCardBox.classList.add(isView);
    }
  };
  theView();

  gridBtn.addEventListener("click", changeView.bind(gridBtn));
  listBtn.addEventListener("click", changeView.bind(listBtn));
}

// //////////////////////////////////////////////
function toggleNav() {
  const toggleMenu = function () {
    nav.classList.toggle("show-nav");
  };

  menuBtn.addEventListener("click", toggleMenu);
}
toggleNav();

// ///////////////////////////////////////////////
// The active page functionality - highlight the current  active
// page
function activePage() {
  function setActiveLink() {
    const navLinks = document.querySelectorAll(".nav-links");
    const currentURL = window.location.href;

    navLinks.forEach((link) => {
      if (currentURL === link.href) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }
  setActiveLink();
}
activePage();
/////////////////// HOME PAGE SECTION ////////////////////
//////////////////////////////////////////////////////////
// The weather forecast functionality. Displaying the weather
// forecast to the user
function weatherForecast() {
  const lat = 14.5995; // Latitude for Caloocan City
  const long = 120.9772; // Longitude for Caloocan City
  const apiKey = "f4619f75c2d45cc1bfe1a55992e82aaa";

  const currentTemp = document.querySelector("#current-temp");
  const weatherIcon = document.querySelector("#weather-icon");
  const captionDesc = document.querySelector("#description");
  const windSpeed = document.querySelector("#windspeed");
  const windDirection = document.querySelector("#wind-direction");

  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKey}&units=metric`; // Changed to metric for Celsius

  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=${apiKey}`;

  const apiFetch = async function () {
    try {
      const response1 = await fetch(weatherUrl);
      if (response1.ok) {
        const weatherData = await response1.json();
        displayResults(weatherData);
      } else {
        throw Error(await response1.text());
      }
    } catch (error) {
      console.log(error);
    }
  };

  function displayResults(data) {
    currentTemp.innerHTML = `${data.main.temp}&deg;C`; // Display temperature in Celsius
    const iconsrc = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;
    let desc = data.weather[0].description;
    weatherIcon.setAttribute("src", iconsrc);
    weatherIcon.setAttribute("alt", "weather-icon");
    captionDesc.textContent = `${desc}`;
    windSpeed.textContent = `${data.wind.speed} m/s`; // Wind speed in meters per second
    windDirection.innerHTML = `${data.wind.deg}&deg;`; // Wind direction in degrees
  }
  
  apiFetch();
}

weatherForecast();


/////////////
/////////////
const myKey = "90158c8799bb28ca5c3054efdcbe85fd";
const myLat = "14.5995";  // Latitude for Caloocan City
const myLon = "120.9842";  // Longitude for Caloocan City

const time = new Date();
const day = time.getDay();
const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];

document.addEventListener("DOMContentLoaded", () => {
    const urlWeather = `https://api.openweathermap.org/data/2.5/weather?lat=${myLat}&lon=${myLon}&appid=${myKey}`;

    async function apiFetch() {
        try {
            const response = await fetch(urlWeather);
            if (response.ok) {
                const data = await response.json();
                displayResults(data);
            } else {
                throw new Error(await response.text());
            }
        } catch (error) {
            console.error(error);
        }
    }

    const displayResults = (data) => {
        const eventMainBox = document.querySelector("#weather-main");
        eventMainBox.innerHTML = "";

        const iconsrc = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
        let desc = data.weather[0].description;

        // Convert temperature from Kelvin to Celsius
        const tempCelsius = (data.main.temp - 273.15).toFixed(0);

        eventMainBox.innerHTML = `
                <div class="current-weather">
                    <h2>The current Weather in: <span id="city-name">${data.name}</span></h2>
                    <h4>${weekdays[day]}</h4>
                    <div class="weather-content"></div>
                    <p>Temperature <span id="current-temp">${tempCelsius}&deg;C</span></p>
                    <figure>
                        <img id="weather-icon" src="${iconsrc}" alt="${desc}">
                        <figcaption>${desc}</figcaption>
                    </figure>
                </div>
            `;
    };

    apiFetch();
});

document.addEventListener("DOMContentLoaded", () => {
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${myLat}&lon=${myLon}&appid=${myKey}`;

    async function apiForecastFetch() {
        try {
            const response = await fetch(forecastUrl);
            if (response.ok) {
                const forecastData = await response.json();
                displayResultsForecast(forecastData);
            } else {
                throw new Error(await response.text());
            }
        } catch (error) {
            console.log(error);
        }
    }

    const displayResultsForecast = (forecastData) => {
        const weatherForecast = document.querySelector("#weather-forecast");
        weatherForecast.innerHTML = "";

        const forecast = document.createElement("article");
        forecast.className = "forecast";
        forecast.innerHTML = `
                <h3>3-Days Weather Forecast</h3>
                <div class="main-day-box">
                    <div class="day-box">
                        <h4 id="day-01">${weekdays[(day + 1) % 7]}</h4>
                        <figure>
                            <img id="weather-icon-1" src="" alt="">
                            <figcaption id="figcaption-1"></figcaption>
                        </figure>
                        <p>Temperature: <span id="temp-1"></span></p>
                    </div>
                    <div class="day-box">
                        <h4 id="day-02">${weekdays[(day + 2) % 7]}</h4>
                        <figure>
                            <img id="weather-icon-2" src="" alt="">
                            <figcaption id="figcaption-2"></figcaption>
                        </figure>
                        <p>Temperature: <span id="temp-2"></span></p>
                    </div>
                    <div class="day-box">
                        <h4 id="day-03">${weekdays[(day + 3) % 7]}</h4>
                        <figure>
                            <img id="weather-icon-3" src="" alt="">
                            <figcaption id="figcaption-3"></figcaption>
                        </figure>
                        <p>Temperature: <span id="temp-3"></span></p>
                    </div>
                </div>
            `;
        weatherForecast.appendChild(forecast);

        const dailyForecasts = forecastData.list.slice(0, 3);
        dailyForecasts.forEach((dailyData, index) => {
            // Convert temperature from Kelvin to Celsius
            const tempCelsius = (dailyData.main.temp - 273.15).toFixed(0);
            document.getElementById(
                `weather-icon-${index + 1}`
            ).src = `https://openweathermap.org/img/wn/${dailyData.weather[0].icon}@2x.png`;
            document.getElementById(`figcaption-${index + 1}`).textContent =
                dailyData.weather[0].description;

            document.getElementById(
                `temp-${index + 1}`
            ).textContent = `${tempCelsius}°C`;
        });
    };

    apiForecastFetch();
});

// ////////////////////////////////////////////////////////////
function displayDate() {
  const theYear = document.querySelector("#year");
  const lastModify = document.querySelector(".last-modify");

  const getDate = function () {
    const date = new Date();
    const option = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    };

    const dateNYear = {
      time: date.toTimeString(),
      year: date.getFullYear(),
      date: new Intl.DateTimeFormat("en-SA", option).format(date),
    };
    return dateNYear;
  };
  theYear.textContent = `${getDate().year}`;
  lastModify.textContent = `${getDate().date} - ${getDate().time}`;
}
displayDate();

////////////////////// DISCOVER PAGE SECTION /////////////////////
/////////////////////////////////////////////////////////////
function feedbackMessage() {
  const messageBox = document.querySelector(".message-box");

  const welcomeMsg = `<h1>Welcome! Let us know if you have any questions.</h1>`;
  const welcomeBack = `<h1>Back so soon! Awesome!</h1>`;
  const sinceLastVist = `<h1>You last visited [n] days ago</h1>`;

  // number of milliseconds in a day
  const millisecToDay = 1000 * 60 * 60 * 24;

  // checking if previous visit timestamp exist in local storage
  let lastVisit = Number(JSON.parse(localStorage.getItem("visitTimeStamp")));
  // getting today's date in milliseconds
  const currentTime = Date.now();

  if (lastVisit) {
    // calculating the days past since the last visit

    const daysPast = Math.abs(
      Math.trunc((currentTime - lastVisit) / millisecToDay)
    );
    // give user feedback based on the days past
    if (daysPast === 0) {
      messageBox.innerHTML = welcomeBack;
    } else {
      messageBox.innerHTML = sinceLastVist.replace("[n]", daysPast);
    }
  } else {
    messageBox.innerHTML = welcomeMsg;
  }

  localStorage.setItem("visitTimeStamp", JSON.stringify(currentTime));
}
feedbackMessage();

// /////////////////////////////////////////////////////////
// // function for rendering the days in the calendar
function displayCalender() {
  const daysContainer = document.querySelector(".days");
  const nextMonthBtn = document.querySelector(".next-btn");
  const prevMonthBtn = document.querySelector(".prev-btn");
  const month = document.querySelector(".the-date");
  const todayBtn = document.querySelector(".today");

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const renderCalender = function () {
    // getting the previous, current and next month days
    date.setDate(1);
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const lastDayIndex = lastDay.getDay();
    const lastDayDate = lastDay.getDate();
    const prevLastDay = new Date(currentYear, currentMonth, 0);
    const prevLastDayDate = prevLastDay.getDate();
    const nextDays = 7 - lastDayIndex - 1;

    // updating the current year and month in header
    month.innerHTML = `${months[currentMonth]} ${currentYear}`;
    // updating the days
    let days = "";

    // updating previous days
    for (let x = firstDay.getDay(); x > 0; x--) {
      days += `<div class="day prev">${prevLastDayDate - x + 1}</div>`;
    }

    // current month days
    for (let i = 1; i <= lastDayDate; i++) {
      // check if its today then add today class
      if (
        i === new Date().getDate() &&
        currentMonth === new Date().getMonth() &&
        currentYear === new Date().getFullYear()
      ) {
        // if date month year matches add today
        days += `<div class="day today">${i}</div>`;
      } else {
        // else dont add today
        days += `<div class="day">${i}</div>`;
      }
    }

    // next month days
    for (let j = 1; j <= nextDays; j++) {
      days += `<div class="day next">${j}</div>`;
    }

    hideTodayBtn();
    daysContainer.innerHTML = days;
  };
  renderCalender();

  nextMonthBtn.addEventListener("click", () => {
    // increase the current month by one
    currentMonth++;
    if (currentMonth > 11) {
      // if current month is greater 11, set it zero and increase year by one
      currentMonth = 0;
      currentYear++;
    }
    // render calendar
    renderCalender();
  });

  prevMonthBtn.addEventListener("click", () => {
    // decrease by one
    currentMonth--;
    // checking if it's less than 0 set it to 11 and decrease year
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
    // render calendar
    renderCalender();
  });

  // go to today
  todayBtn.addEventListener("click", () => {
    // set the month and year to current
    currentMonth = date.getMonth();
    currentYear = date.getFullYear();
    // render calendar
    renderCalender();
  });

  // hiding today button if it's already the current date
  function hideTodayBtn() {
    if (
      currentMonth === new Date().getMonth() &&
      currentYear === new Date().getFullYear()
    ) {
      todayBtn.style.display = "none";
    } else {
      todayBtn.style.display = "flex";
    }
  }
}
displayCalender();

///////////////////////////////////////////////////////////
// Spotlight box section - for homepage
// Function to display spotlight members
async function displaySpotlightMembers() {
  const membersUrl = "../data/members.json";
  const response = await fetch(membersUrl);
  const data1 = await response.json();
  // Filter data to include only gold or silver members
  const goldSilverMembers = data1.data.filter(
    (member) =>
      member.Membership === "images/gold.png" ||
      member.Membership === "images/silver.png"
  );
  console.log(goldSilverMembers);

  // Shuffle the data array to randomize the order
  shuffleArray(goldSilverMembers);

  // Select the first two members
  const spotlightMembers = data1.slice(0, 2);

  // Get the spotlight elements in the HTML
  const spotlight1 = document.querySelector(".spotlight-1");
  const spotlight2 = document.querySelector(".spotlight-2");

  // Function to render spotlight member HTML
  function renderSpotlightMember(member) {
    return `
    <img width="300" height="300" src="${member.logo}" alt="${member.Name}.logo">
    <a href="${member.Website}" target="_blank">${member.Name}</a>
  `;
  }
  spotlight1.innerHTML = renderSpotlightMember(spotlightMembers[0]);
  console.log(renderSpotlightMember(spotlightMembers[0]));
  spotlight2.innerHTML = renderSpotlightMember(spotlightMembers[1]);

  // Function to shuffle an array randomly
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
}
displaySpotlightMembers();

//////////////////////////////////////////////////////////
// Meetup banner
function meetupBanner() {
  const date = new Date();

  if (date.getDay() >= 1 && date.getDay() <= 3) {
    const banner = document.getElementById("banner");
    banner.style.display = "flex";

    const closeBanner = document.getElementById("closeBanner");
    closeBanner.addEventListener("click", function () {
      banner.style.display = "none";
      console.log(banner);
    });
  }
}
meetupBanner();
