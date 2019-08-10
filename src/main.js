import {createTripInfoTemplate} from './components/info';
import {createMenuTemplate} from './components/menu';
import {createFilterTemplate} from './components/filter';
import {createDayListTemplate} from './components/day-list';
import {createEventEditTemplate} from './components/event-edit';
import {createEventTemplate} from './components/event';

const render = (markup, container, place = `beforeend`) => {
  container.insertAdjacentHTML(place, markup);
};

const getByIdFn = (selector) => document.getElementById(selector);

const findElement = (selector, searchFunction = getByIdFn) => {
  const element = searchFunction(selector);
  if (!element) {
    throw new Error(`Element \`${selector}\` did not found`);
  }
  return element;
};

const renderPage = () => {
  const headerElement = findElement(`trip-info`);
  const menuTitleElement = findElement(`menu-title`);
  const filterTitleElement = findElement(`filter-title`);
  const scheduleElement = findElement(`trip-events`);

  render(createTripInfoTemplate(), headerElement, `afterbegin`);
  render(createMenuTemplate(), menuTitleElement, `afterend`);
  render(createFilterTemplate(), filterTitleElement, `afterend`);
  render(createDayListTemplate(), scheduleElement);

  const eventsListElement = findElement(`events-list`);
  render(createEventEditTemplate(), eventsListElement);
  for (let i = 0; i < 3; i++) {
    render(createEventTemplate(), eventsListElement);
  }
};

renderPage();
