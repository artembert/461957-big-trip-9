import {Position} from "../models/position";

export const render = (markup, container, place = `beforeend`) => {
  container.insertAdjacentHTML(place, markup);
};

export function renderNew(markup, container, place) {
  if (place === Position.AFTERBEGIN) {
    container.prepend(markup);
  } else if (place === Position.BEFOREEND || !place) {
    container.append(markup);
  }
}

export function createElement(template) {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
}

export function unrender(element) {
  if (element) {
    element.remove();
  }
}
