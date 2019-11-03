import { Destination } from "./destination";
import { AssignedOfferItem } from "./offer";
import { EventTypeName } from "./event-type-name";
import { EventDate } from "./event-date";

export interface TripEventEditConfig {
  type: EventTypeName;
  destination: Destination;
  price: number;
  options: AssignedOfferItem[];
  date: EventDate;
  isNew: boolean;
}
