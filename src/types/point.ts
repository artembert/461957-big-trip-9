import { EventDate } from "./event-date";
import { Destination } from "./destination";
import { EventTypeName } from "./event-type-name";
import { AssignedOfferItem } from "./offer";

export interface Point {
  id: string;
  date: EventDate;
  destination: Destination;
  type: EventTypeName;
  price: number;
  options: AssignedOfferItem[];
  isFavourite: boolean;
  isNew?: boolean;
}
