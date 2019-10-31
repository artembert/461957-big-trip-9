import { Offer } from "../types/offer";

export const options: Offer[] = [
  {
    type: `taxi`,
    offers: [
      {
        title: `Upgrade to a business class`,
        price: 70,
      },
      {
        title: `Choose the radio station`,
        price: 60,
      },
      {
        title: `Choose temperature`,
        price: 160,
      },
      {
        title: `Drive quickly, I'm in a hurry`,
        price: 80,
      },
      {
        title: `Drive slowly`,
        price: 90,
      },
    ],
  },
  {
    type: `bus`,
    offers: [
      {
        title: `Infotainment system`,
        price: 180,
      },
      {
        title: `Order meal`,
        price: 120,
      },
      {
        title: `Choose seats`,
        price: 190,
      },
    ],
  },
  {
    type: `train`,
    offers: [
      {
        title: `Book a taxi at the arrival point`,
        price: 110,
      },
      {
        title: `Order a breakfast`,
        price: 90,
      },
      {
        title: `Wake up at a certain time`,
        price: 70,
      },
    ],
  },
  {
    type: `flight`,
    offers: [
      {
        title: `Choose meal`,
        price: 100,
      },
      {
        title: `Choose seats`,
        price: 180,
      },
      {
        title: `Upgrade to comfort class`,
        price: 30,
      },
      {
        title: `Upgrade to business class`,
        price: 80,
      },
      {
        title: `Add luggage`,
        price: 180,
      },
      {
        title: `Business lounge`,
        price: 30,
      },
    ],
  },
  {
    type: `check-in`,
    offers: [
      {
        title: `Choose the time of check-in`,
        price: 140,
      },
      {
        title: `Choose the time of check-out`,
        price: 90,
      },
      {
        title: `Add breakfast`,
        price: 180,
      },
      {
        title: `Laundry`,
        price: 100,
      },
      {
        title: `Order a meal from the restaurant`,
        price: 30,
      },
    ],
  },
  {
    type: `sightseeing`,
    offers: [],
  },
  {
    type: `ship`,
    offers: [
      {
        title: `Choose meal`,
        price: 80,
      },
      {
        title: `Choose seats`,
        price: 160,
      },
      {
        title: `Upgrade to comfort class`,
        price: 90,
      },
      {
        title: `Upgrade to business class`,
        price: 40,
      },
      {
        title: `Add luggage`,
        price: 30,
      },
      {
        title: `Business lounge`,
        price: 60,
      },
    ],
  },
  {
    type: `transport`,
    offers: [],
  },
  {
    type: `drive`,
    offers: [
      {
        title: `Choose comfort class`,
        price: 40,
      },
      {
        title: `Choose business class`,
        price: 180,
      },
    ],
  },
  {
    type: `restaurant`,
    offers: [
      {
        title: `Choose live music`,
        price: 150,
      },
      {
        title: `Choose VIP area`,
        price: 70,
      },
    ],
  },
];
