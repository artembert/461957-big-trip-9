import {getRandomInteger} from "./math";

export function shuffle(items) {
  for (let index = items.length - 1; index > 0; index--) {
    const randItem = getRandomInteger(0, index);
    [items[randItem], items[index]] = [items[index], items[randItem]];
  }
  return items;
}
