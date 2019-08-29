export function shuffle(array) {
  let index = array.length;
  let randItem;

  while (index) {
    index -= 1;
    randItem = Math.floor(Math.random() * index);
    [array[randItem], array[index]] = [array[index], array[randItem]];
  }

  return array;
}
