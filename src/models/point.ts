import { EventDate } from "../types/event-date";
import { Destination } from "../types/destination";
import { EventTypeName } from "../types/event-type-name";
import { AssignedOfferItem } from "../types/offer";

export interface Point {
  id: string;
  date: EventDate;
  destination: Destination;
  type: EventTypeName;
  price: number;
  options: AssignedOfferItem[];
  isFavourite: boolean;
}
