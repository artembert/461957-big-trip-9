import {getRandomInteger} from "./math";

export function shuffle(array) {
  let index = array.length;
  let randItem;

  while (index) {
    index -= 1;
    randItem = getRandomInteger(0, index);
    [array[randItem], array[index]] = [array[index], array[randItem]];
  }

  return array;
}
