import {
  searchForm,
  searchInput,
  tabsButtons,
  nowTemp,
  nowCity,
  icon,
  favoriteButton,
  detailsHeading,
  detailsTemp,
  detailsFeels,
  detailsWeather,
  detailsSunrise,
  detailsSunset,
  favoriteList,
  favoriteError,
} from './view.js';

import { tabs } from './tabs.js';

tabsButtons.forEach((tabsBtn) => {
  tabsBtn.addEventListener('click', tabs);
});

const serverUrl = 'http://api.openweathermap.org/data/2.5/weather';
const apiKey = 'f660a2fb1e4bad108d6160b7f58c555f';

const getIcon = (nowIcon, description) => {
  icon.setAttribute(
    'src',
    `http://openweathermap.org/img/wn/${nowIcon}@2x.png`
  );
  icon.setAttribute('alt', `${description}`);
};

const getTimes = (timestamp) => {
  let time = new Date(timestamp * 1000);
  let hours = time.getHours();
  let minutes = time.getMinutes();
  if (minutes < 10) {
    return `${hours}:` + 0 + `${minutes}`;
  } else if (hours < 10) {
    return 0 + `${hours}:` + `${minutes}`;
  } else {
    return `${hours}:` + `${minutes}`;
  }
};

searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  cityName = searchInput.value;
  searchInput.value = '';
  weatherRender();
});

let cityName = 'Moscow';

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
    })
    .catch((error) => alert('Ошибка'));
};

weatherRender();

let favoriteItems = [];

const addFavoriteCity = () => {
  let cityIndex = favoriteItems.findIndex(
    (item) => item.city === nowCity.textContent
  );

  if (cityIndex >= 0) {
    favoriteError.classList.add('favorite__error--active');
    setTimeout(() => {
      favoriteError.classList.remove('favorite__error--active');
    }, 2000);
    return;
  }

  favoriteItems.push({
    city: nowCity.textContent,
  });
  renderFavoriteList();
};

favoriteButton.addEventListener('click', () => {
  // TODO: favoriteButton.classList.toggle('favorite-icon--red');
  addFavoriteCity();
});

const renderFavoriteList = () => {
  favoriteList.innerHTML = '';
  favoriteItems.forEach((item) => {
    createFavoriteItem(item.city);
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
  let cityIndex = favoriteItems.findIndex((item) => item.city === city);
  favoriteItems.splice(cityIndex, 1);
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
