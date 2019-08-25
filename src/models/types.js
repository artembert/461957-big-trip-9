export const moveTypes = [
  {name: `bus`, icon: `bus`, isPlace: false},
  {name: `restaurant`, icon: `restaurant`, isPlace: false},
  {name: `train`, icon: `train`, isPlace: false},
  {name: `ship`, icon: `ship`, isPlace: false},
  {name: `transport`, icon: `transport`, isPlace: false},
  {name: `drive`, icon: `drive`, isPlace: false},
  {name: `trip`, icon: `trip`, isPlace: false},
];

export const placeTypes = [
  {name: `check`, icon: `check-in`, isPlace: true},
  {name: `sightseeing`, icon: `sightseeing`, isPlace: true},
  {name: `restaurant`, icon: `restaurant`, isPlace: true},
];

export const types = moveTypes.concat(placeTypes);
