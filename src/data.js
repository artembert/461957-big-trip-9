import {types} from "./models/types";
import {getRandomInteger} from "./util/math";
import {cities} from "./models/places";
import {descriptions} from "./models/descriptions";
import {options} from "./models/options";

const MIN_PRICE = 3;
const MAX_PRICE = 30;
const MAX_DESCRIPTION_LENGTH = 3;
const MAX_ADDITIONAL_OPTIONS_COUNT = 2;

export const getEvent = () => {
  const event = {
    type: getType(types),
    description: getDescription(descriptions),
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
