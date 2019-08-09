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
  const tripControlsElement = document.getElementById(`trip-controls`);

  render(createTripInfoTemplate(), headerElement, `afterbegin`);
  render(createMenuTemplate(), tripControlsElement, `afterbegin`);
  render(createFilterTemplate(), tripControlsElement);
};

renderPage();
