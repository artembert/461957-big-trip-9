import {types} from "./models/types";
import {getRandomInteger} from "./util/math";
import {cities} from "./models/places";
import {descriptions} from "./models/descriptions";
import {options} from "./models/options";
import setMinutes from 'date-fns/setMinutes';
import {DAYS_IN_WEEK, MINUTES_IN_HOUR, MS_IN_DAY, MS_IN_HOUR} from "./models/time";
import {shuffle} from "./util/shuffle";

const MIN_PRICE = 3;
const MAX_PRICE = 30;
const MAX_DESCRIPTION_LENGTH = 3;
const MAX_ADDITIONAL_OPTIONS_COUNT = 2;
const MIN_DURATION_HOURS = 0.5;
const MAX_DURATION_HOURS = 30;
const MIN_TIME_INTERVAL = 20;
const HALF_PROBABILITY = 0.5;
const MIN_PICTURES_COUNT = 3;
const MAX_PICTURES_COUNT = 8;

const dateNow = setMinutes(Date.now(), MIN_TIME_INTERVAL).getTime();

function getEvent() {

  // вынес в переменную, чтобы иметь к ней доступ в функции getDestination()
  const type = getType(types);
  return {
    type,
    description: getDescription(descriptions),
    date: getDate(dateNow),

    // если делать чистую функцию, то нужно "cities" и в getEvent() передавать, тогда у меня потянется большое количество параметров в функциях
    destination: getDestination(type, cities),
    price: getPrice(),
    options: getOptions(options, MAX_ADDITIONAL_OPTIONS_COUNT),
    pictures: getPictures(),
    id: getId(),
  };
}

export function getFilters() {
  return [
    {title: `Everything`, type: `everything`, isActive: true},
    {title: `Feature`, type: `feature`, isActive: false},
    {title: `Past`, type: `past`, isActive: false},
  ];
}

export function getMenu() {
  return [
    {title: `Table`, href: `#`, isActive: true},
    {title: `Stats`, href: `#`, isActive: false},
  ];
}

export function getInfo(eventList) {
  const sortEventList = eventList
  .filter((event) => !event.type.isPlace)
  .sort((event1, event2) => event1.date.start - event2.date.start);
  const firstEvent = sortEventList[0];
  const lastEvent = sortEventList[sortEventList.length - 1];
  const points = getPoints(eventList);
  return {
    points: {
      start: points[0],
      middle: getMiddlePoint(points),
      end: points[points.length - 1],
      count: points.length,
    },
    dateStart: getDateStart(firstEvent),
    dateEnd: getDateEnd(lastEvent),
    cost: getCost(eventList),
  };
}

export function getEventList(count) {
  return new Array(count).fill(undefined).map(() => getEvent());
}

function getType(typeList) {
  return typeList[getRandomInteger(0, typeList.length)];
}

function getDestination(type, cityList) {
  return type.isPlace ? undefined : cityList[getRandomInteger(0, cityList.length)];
}

function getPrice() {
  return getRandomInteger(MIN_PRICE, MAX_PRICE);
}

function getDescription(descriptionList) {
  return new Array(getRandomInteger(1, MAX_DESCRIPTION_LENGTH))
  .fill(undefined)
  .map(() => descriptionList[getRandomInteger(0, descriptionList.length)])
  .join(` `);
}

function getOptions(optionList, maxLength) {
  const selectedOptionsCount = getRandomInteger(0, maxLength + 1);
  const shuffledOptions = shuffle(optionList);
  const selectedOptions = shuffledOptions.slice(0, selectedOptionsCount).map(({name, price, code}) =>
    ({name, price, code, isSelected: true}));
  const unselectedOptions = shuffledOptions.slice(selectedOptionsCount).map(({name, price, code}) =>
    ({name, price, code, isSelected: false}));
  return new Set([...selectedOptions, ...unselectedOptions]);
}

function getDate(currentDate) {
  const start = Math.round(currentDate + 1 + getRandomInteger(0, DAYS_IN_WEEK) * MS_IN_DAY * (Math.random() - HALF_PROBABILITY));
  const duration = getRandomInteger(MIN_DURATION_HOURS * (MINUTES_IN_HOUR / MIN_TIME_INTERVAL), MAX_DURATION_HOURS * (MINUTES_IN_HOUR / MIN_TIME_INTERVAL)) / (MINUTES_IN_HOUR / MIN_TIME_INTERVAL) * MS_IN_HOUR;
  const end = start + duration;
  return {start, duration, end};
}

function getPictures() {
  return new Array(getRandomInteger(MIN_PICTURES_COUNT, MAX_PICTURES_COUNT)).fill(undefined).map(() => `http://picsum.photos/300/150?r=${Math.random()}`);
}

function getPoints(events) {
  return Array.from(new Set(events
    .map((event) => event.destination)
    .filter((event) => !!event)));
}

function getMiddlePoint(points) {
  return points.length > 3 ? undefined : points[1];
}

function getDateStart(event) {
  return event.date.start;
}

function getDateEnd(event) {
  return event.date.end;
}

function getCost(events) {
  return events.reduce((sum, event) => {
    const optionsCost = Array.from(event.options).filter((option) => option.isSelected)
    .reduce((accum, option) => {
      return accum + Number(option.price);
    }, 0);
    return sum + Number(event.price) + optionsCost;
  }, 0);
}

function getId() {
  return `f${(~~(Math.random() * 1e8)).toString(16)}`;
}
