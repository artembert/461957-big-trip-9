import { EventTypeName } from "./event-type-name";

export type OfferType = EventTypeName;

export interface OfferItem {
  title: string;
  price: number;
}

export interface AssignedOfferItem extends OfferItem {
  accepted: boolean;
}

export interface UniqueOfferItem extends OfferItem {
  id: string;
}

export interface Offer {
  type: OfferType;
  offers: OfferItem[];
}

export interface AssignedOffer {
  type: OfferType;
  offers: AssignedOfferItem[];
}
