import {Position} from "../models/position";

export function render(markup, container, place) {
  if (place === Position.AFTERBEGIN) {
    container.prepend(markup);
  } else if (place === Position.BEFOREEND || !place) {
    container.append(markup);
  }
}

/**
 * @param {string} template
 * @return {Element}
 */
export function createElement(template) {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  // @ts-ignore
  return newElement.firstChild;
}

export function unrender(element) {
  if (element) {
    element.remove();
  }
}
