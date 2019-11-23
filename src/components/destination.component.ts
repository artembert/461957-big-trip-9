import AbstractComponent from "./abstract-component";
import { Destination } from "../types/destination";
import { DestinationPicture } from "../types/destination-picture";

export default class DestinationComponent extends AbstractComponent {
  private _destination: Destination;

  constructor(description: Destination) {
    super();
    this._destination = description;
  }

  public getTemplate(): string {
    return `
    <section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${this._destination.description}</p>
      ${getPictures(this._destination.pictures)}
    </section>`;
  }
}

function getPictures(pictures: DestinationPicture[]): string {
  if (pictures && !pictures.length) {
    return ``;
  }
  return `<div class="event__photos-container">
        <div class="event__photos-tape">
          ${pictures
            .map(picture => `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`.trim())
            .join(``)}
        </div>
      </div>`;
}
