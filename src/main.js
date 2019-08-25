import {createTripInfoTemplate} from './components/info';
import {createMenuTemplate} from './components/menu';
import {createFilterTemplate} from './components/filter';
import {createDayListTemplate} from './components/day-list';
import {createEventEditTemplate} from './components/event-edit';
import {createEventTemplate} from './components/event';
import {getEvent} from "./data";
import {render} from "./util/dom";

const renderPage = () => {
  const headerElement = document.querySelector(`.trip-info`);
  const menuTitleElement = document.querySelector(`.menu-title`);
  const filterTitleElement = document.querySelector(`.filter-title`);
  const scheduleElement = document.querySelector(`.trip-events`);

  render(createTripInfoTemplate(), headerElement, `afterbegin`);
  render(createMenuTemplate(), menuTitleElement, `afterend`);
  render(createFilterTemplate(), filterTitleElement, `afterend`);
  render(createDayListTemplate(), scheduleElement);

  const eventsListElement = document.querySelector(`.trip-events__list`);
  render(createEventEditTemplate(), eventsListElement);
  for (let i = 0; i < 3; i++) {
    render(createEventTemplate(), eventsListElement);
  }
};

renderPage();
