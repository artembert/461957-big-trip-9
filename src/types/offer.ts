export type OfferType = "taxi" | "bus" | "train" | "ship" | "transport" | "drive" | "flight" | "check-in" | "sightseeing" | "restaurant";

export interface OfferItem {
  title: string,
  price: number,
}

export interface AssignedOfferItem extends OfferItem {
  accepted: boolean,
}

export interface Offer {
  type: OfferType,
  offers: OfferItem[],
}

export interface AssignedOffer {
  type: OfferType,
  offers: AssignedOfferItem[],
}

