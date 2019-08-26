import {types} from "./models/types";
import {getRandomInteger} from "./util/math";
import {cities} from "./models/places";
import {descriptions} from "./models/descriptions";
import {options} from "./models/options";

const MS_IN_DAY = 86400000;
const MS_IN_MINUTE = 60000;
const DAYS_IN_WEEK = 7;
const MIN_PRICE = 3;
const MAX_PRICE = 30;
const MAX_DESCRIPTION_LENGTH = 3;
const MAX_ADDITIONAL_OPTIONS_COUNT = 2;
const MIN_DURATION_HOURS = 0.5;
const MAX_DURATION_HOURS = 12;
const MINUTES_IN_HOUR = 60;
const MIN_TIME_INTERVAL = 20;

const dateNow = Date.now();

export const getEvent = () => {
  const event = {
    type: getType(types),
    description: getDescription(descriptions),
    dateStart: getDate(dateNow),
    duration: getDuration(),
    dateEnd: undefined,
    destination: getDestination(cities),
    price: getPrice(),
    availableOptions: getOptions(options),
    selectedOptions: getSelectedOptions(options, MAX_ADDITIONAL_OPTIONS_COUNT),
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

function getDate(currentDate) {
  return currentDate + 1 + getRandomInteger(-DAYS_IN_WEEK, DAYS_IN_WEEK) * MS_IN_DAY;
}

function getDuration() {
  return getRandomInteger(
      MIN_DURATION_HOURS * MINUTES_IN_HOUR / MIN_TIME_INTERVAL,
      MAX_DURATION_HOURS * MINUTES_IN_HOUR / MIN_TIME_INTERVAL
  ) * MIN_TIME_INTERVAL * MS_IN_MINUTE;
}

function getDescription(descriptionList) {
  return new Array(getRandomInteger(1, MAX_DESCRIPTION_LENGTH))
  .fill(undefined)
  .map(() => descriptionList[getRandomInteger(0, descriptionList.length)])
  .join(` `);
}

function getOptions(tagList) {
  return new Set(tagList);
}

function getSelectedOptions(tagList, maxLength) {
  return new Set(tagList
  .sort(() => Math.random() - 0.5)
  .slice(0, getRandomInteger(0, maxLength + 1)));
}
