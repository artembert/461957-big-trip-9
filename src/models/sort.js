export const SortType = {
  EVENT: `event`,
  TIME: `time`,
  PRICE: `price`,
};

export const sortFns = {
  event: (a, b) => a.date.start - b.date.start,
  time: (a, b) => b.date.duration - a.date.duration,
  price: (a, b) => b.price - a.price,
};
