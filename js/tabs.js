import { tabsContents } from './view.js';

export const tabs = (event) => {
  let tabsBtnActive = document.querySelector('.tabs__btn--active');

  tabsBtnActive.classList.remove('tabs__btn--active');
  let btn = event.target;
  btn.classList.add('tabs__btn--active');

  let tabNames = btn.dataset.tabName;
  tabsContents.forEach((content) => {
    if (content.classList.contains(tabNames)) {
      let contentActive = document.querySelector('.tabs-content__item--active');
      contentActive.classList.remove('tabs-content__item--active');
      content.classList.add('tabs-content__item--active');
    }
  });
};
