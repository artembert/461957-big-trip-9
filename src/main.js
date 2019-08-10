import {createTripInfoTemplate} from './components/info';
import {createMenuTemplate} from './components/menu';
import {createFilterTemplate} from './components/filter';
import {createDayListTemplate} from './components/day-list';
import {createEventEditTemplate} from './components/event-edit';
import {createEventTemplate} from './components/event';

const render = (markup, container, place = `beforeend`) => {
  container.insertAdjacentHTML(place, markup);
};

const renderPage = () => {
  const headerElement = document.getElementById(`trip-info`);
  const menuTitleElement = document.getElementById(`menu-title`);
  const filterTitleElement = document.getElementById(`filter-title`);
  const scheduleElement = document.getElementById(`trip-events`);

  render(createTripInfoTemplate(), headerElement, `afterbegin`);
  render(createMenuTemplate(), menuTitleElement, `afterend`);
  render(createFilterTemplate(), filterTitleElement, `afterend`);
  render(createDayListTemplate(), scheduleElement);

  const eventsListElement = document.getElementById(`events-list`);
  render(createEventEditTemplate(), eventsListElement);
  for (let i = 0; i < 3; i++) {
    render(createEventTemplate(), eventsListElement);
  }
};

renderPage();
