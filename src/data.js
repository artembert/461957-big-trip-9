import {types} from "./models/types";
import {getRandomInteger} from "./util/math";
import {cities} from "./models/places";
import {descriptions} from "./models/descriptions";
import {options} from "./models/options";
import setMinutes from 'date-fns/setMinutes';
import {DAYS_IN_WEEK, MINUTES_IN_HOUR, MS_IN_DAY, MS_IN_HOUR} from "./models/time";

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

export const getEvent = () => {
  const event = {
    type: getType(types),
    description: getDescription(descriptions),
    date: getDate(dateNow),
    destination: getDestination(cities),
    price: getPrice(),
    options: getOptions(options, MAX_ADDITIONAL_OPTIONS_COUNT),
    pictures: getPictures(),
  };
  console.log(event);
  return event;
};

function getType(typeList) {
  return typeList[getRandomInteger(0, typeList.length)];
}

function getDestination(cityList) {
  return cityList[getRandomInteger(0, cityList.length)];
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
  const shuffledOptions = optionList.sort(() => Math.random() - HALF_PROBABILITY);
  const selectedOptions = shuffledOptions.slice(0, selectedOptionsCount).map(({name, price}) =>
    ({name, price, isSelected: true}));
  const unselectedOptions = shuffledOptions.slice(selectedOptionsCount).map(({name, price}) =>
    ({name, price, isSelected: false}));
  return new Set([...selectedOptions, ...unselectedOptions]);
}

function getDate(currentDate) {
  const start = currentDate + 1 + getRandomInteger(0, DAYS_IN_WEEK) * MS_IN_DAY * (Math.random() - HALF_PROBABILITY);
  const duration = getRandomInteger(
    MIN_DURATION_HOURS * (MINUTES_IN_HOUR / MIN_TIME_INTERVAL),
    MAX_DURATION_HOURS * (MINUTES_IN_HOUR / MIN_TIME_INTERVAL)
  ) / (MINUTES_IN_HOUR / MIN_TIME_INTERVAL) * MS_IN_HOUR;
  const end = start + duration;
  return {start, duration, end};
}

function getPictures() {
  return new Array(getRandomInteger(MIN_PICTURES_COUNT, MAX_PICTURES_COUNT)).fill(undefined).map(() => `http://picsum.photos/300/150?r=${Math.random()}`);
}
