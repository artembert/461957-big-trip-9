import {types} from "./models/types";
import {getRandomInteger} from "./util/math";
import {cities} from "./models/cities";

const MIN_PRICE = 3;
const MAX_PRICE = 30;

export const getEvent = () => {
  const event = {
    type: getType(types),
    destination: getDestination(cities),
    price: getPrice(),

  };
  console.log(event);
  return event;
};

function getType(typeList) {
  const typeArray = Object.keys(typeList);
  return typeArray[getRandomInteger(0, typeArray.length)];
}

function getDestination(cityList) {
  return cityList[getRandomInteger(0, cityList.length)];
}

function getPrice() {
  return getRandomInteger(MIN_PRICE, MAX_PRICE);
}
