import {types} from "./models/types";

export const getEvent = () => {
  return {
    type: getType(),
  };
};

function getType() {
  const typeList = Object.keys(types);
  return typeList[Math.floor(Math.random() * typeList.length)];
}
