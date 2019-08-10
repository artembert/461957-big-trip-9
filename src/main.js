import {createTripInfoTemplate} from './components/trip-info';
import {createMenuTemplate} from './components/menu';
import {createFilterTemplate} from './components/filter';
// import {} from './components/';
// import {} from './components/';
// import {} from './components/';
// import {} from './components/';

const render = (markup, container, place = `beforeend`) => {
  container.insertAdjacentHTML(place, markup);
};


const renderPage = () => {
  const headerElement = document.getElementById(`trip-info`);
  const menuTitleElement = document.getElementById(`menu-title`);
  const filterTitleElement = document.getElementById(`filter-title`);

  render(createTripInfoTemplate(), headerElement, `afterbegin`);
  render(createMenuTemplate(), menuTitleElement, `afterend`);
  render(createFilterTemplate(), filterTitleElement, `afterend`);
};

renderPage();
