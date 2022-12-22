import { icon } from './view.js';

const getIcon = (nowIcon, description) => {
  icon.setAttribute(
    'src',
    `https://openweathermap.org/img/wn/${nowIcon}@2x.png`
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

export { getIcon, getTimes };
