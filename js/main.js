import {
  searchForm,
  searchInput,
  tabsButtons,
  nowTemp,
  nowCity,
  favoriteButton,
  detailsHeading,
  detailsTemp,
  detailsFeels,
  detailsWeather,
  detailsSunrise,
  detailsSunset,
  favoriteList,
} from './view.js';

import { tabs } from './tabs.js';
import { serverUrl, apiKey } from './api.js';
import { getIcon, getTimes } from './helpers.js';

tabsButtons.forEach((tabsBtn) => {
  tabsBtn.addEventListener('click', tabs);
});

searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  cityName = searchInput.value;
  searchInput.value = '';
  weatherRender();
});

const saveCurrentCity = (city) => {
  localStorage.setItem('current-city', city);
};

let cityName = '';

const getCurrentCity = () => {
  cityName = 'Moscow';

  let currentCity = localStorage.getItem('current-city');

  if (currentCity) {
    cityName = currentCity;
  }
};

getCurrentCity();

const weatherRender = () => {
  const url = `${serverUrl}?q=${cityName}&lang=en&units=metric&appid=${apiKey}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const {
        main: { temp, feels_like: feelsLike },
        sys: { sunrise, sunset },
        weather,
        name,
      } = data;

      nowTemp.textContent = temp.toFixed(0);
      getIcon(weather[0].icon, weather[0].description);
      nowCity.textContent = name;
      detailsHeading.textContent = name;
      detailsTemp.textContent = temp.toFixed(0);
      detailsFeels.textContent = feelsLike.toFixed(0);
      detailsWeather.textContent = weather[0].main;
      detailsSunrise.textContent = getTimes(sunrise);
      detailsSunset.textContent = getTimes(sunset);
      saveCurrentCity(name);
    })
    .catch((error) => alert('Ошибка'));
};

weatherRender();

let favoriteItems = [];

const addFavoriteCity = () => {
  let cityIndex = favoriteItems.findIndex(
    (city) => city === nowCity.textContent
  );

  if (cityIndex >= 0) {
    deleteFavoriteItem(nowCity.textContent);
    return;
  }

  favoriteItems.push(nowCity.textContent);
  saveFavoriteCities(favoriteItems);
  renderFavoriteList();
};

favoriteButton.addEventListener('click', () => {
  addFavoriteCity();
});

const renderFavoriteList = () => {
  favoriteList.innerHTML = '';

  favoriteItems = getFavoriteCities();

  favoriteItems.forEach((city) => {
    createFavoriteItem(city);
  });
};

const createFavoriteItem = (city) => {
  let favoriteItem = document.createElement('div');
  favoriteItem.className = 'favorite__item';
  favoriteList.prepend(favoriteItem);

  let favoriteName = document.createElement('span');
  favoriteName.className = 'favorite__name';
  favoriteName.textContent = city;
  favoriteItem.prepend(favoriteName);

  let favoriteDelete = document.createElement('button');
  favoriteDelete.className = 'favorite__delete btn-reset';
  favoriteItem.append(favoriteDelete);
};

const deleteFavoriteItem = (city) => {
  let cityIndex = favoriteItems.findIndex((item) => item === city);
  favoriteItems.splice(cityIndex, 1);
  saveFavoriteCities(favoriteItems);
  renderFavoriteList();
};

favoriteList.addEventListener('click', (event) => {
  if (event.target.classList.contains('favorite__delete')) {
    let favoriteItem = event.target.parentNode;
    let favoriteName = favoriteItem.querySelector('.favorite__name');
    deleteFavoriteItem(favoriteName.textContent);
  }
});

favoriteList.addEventListener('click', (event) => {
  if (event.target.classList.contains('favorite__name')) {
    let favoriteName = event.target;
    cityName = favoriteName.textContent;
    weatherRender();
  }
});

const saveFavoriteCities = (arrayCity) => {
  let stringCity = JSON.stringify(arrayCity);
  localStorage.setItem('favorite-cities', stringCity);
};

const getFavoriteCities = () => {
  let favoriteCities = localStorage.getItem('favorite-cities');
  let arrayFavoriteCities = JSON.parse(favoriteCities);
  return arrayFavoriteCities || favoriteItems;
};

renderFavoriteList();
