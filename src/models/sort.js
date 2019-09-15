export const SortType = {
  EVENT: `event`,
  TIME: `time`,
  PRICE: `price`,
};

export const sortFns = {
  event: (a, b) => a.date.start - b.date.start,
  time: (a, b) => a.date.start - b.date.start,
  price: (a, b) => a.price - b.price,
};
