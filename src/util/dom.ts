import { Position } from "../models/position";

export function render(markup, container, place?): void {
  if (place === Position.AFTERBEGIN) {
    container.prepend(markup);
  } else if (place === Position.BEFOREEND || !place) {
    container.append(markup);
  }
}

export function createElement(template): HTMLElement {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild as HTMLElement;
}

export function unrender(element): void {
  if (element) {
    element.remove();
  }
}
