import AbstractComponent from "./abstract-component";

export default class Destination extends AbstractComponent {
  constructor({description, pictures}) {
    super();
    this._description = description;
    this._pictures = pictures;
  }

  getTemplate() {
    return `
    <section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${this._description}</p>

      <div class="event__photos-container">
        <div class="event__photos-tape">
        ${getPictures(this._pictures)}
        </div>
      </div>
    </section>`;
  }
}


function getPictures(pictures) {
  if (!pictures.length) {
    return ``;
  }
  return pictures.map((picture) =>
    `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`.trim())
  .join();
}
