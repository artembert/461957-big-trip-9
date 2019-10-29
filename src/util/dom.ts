import { Position } from "../models/position";
import { PlacementPosition } from "../types/position";

export function render(markup: HTMLElement, container: Element, place?: PlacementPosition): void {
  if (place === Position.AFTERBEGIN) {
    container.prepend(markup);
  } else if (place === Position.BEFOREEND || !place) {
    container.append(markup);
  }
}

export function createElement(template: string): HTMLElement {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild as HTMLElement;
}

export function unrender(element: HTMLElement): void {
  if (element) {
    element.remove();
  }
}
