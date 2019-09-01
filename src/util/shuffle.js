import {getRandomInteger} from "./math";

export function shuffle(items) {
  let index = items.length;
  let randItem;

  while (index) {
    index -= 1;
    randItem = getRandomInteger(0, index);
    [items[randItem], items[index]] = [items[index], items[randItem]];
  }

  return items;
}
