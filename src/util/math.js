export function getBooleanGivenProbability(probability) {
  return Math.random() < probability;
}

export function getRandomInteger(min = 0, max) {
  return Math.floor(min + Math.random() * (max - min));
}
