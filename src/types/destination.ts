import { DestinationPicture } from "./destination-picture";

export type Destination = {
  name: string;
  description?: string;
  pictures?: DestinationPicture[];
};
