import {getRandomInteger} from "./math";

export function shuffle(items) {
  for (let index = items.length - 1; index > 0; index--) {
    const randomIndex = getRandomInteger(0, index);
    [items[randomIndex], items[index]] = [items[index], items[randomIndex]];
  }
  return items;
}
