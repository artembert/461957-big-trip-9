import AbstractComponent from "./abstract-component";

export default class Menu extends AbstractComponent {
  constructor(menuItems) {
    super();
    this._menuItems = menuItems;
  }

  getTemplate() {
    return `<nav class="trip-controls__trip-tabs  trip-tabs">
${this._menuItems.map((item) => `
  <input type="radio"
    name="menu"
    id="menu-item-${item.href}"
    value="${item.href}"
    ${isLinkActive(item) ? `checked` : ``}
    class="trip-tabs__toggle visually-hidden"/>
  <label for="menu-item-${item.href}"
    class="trip-tabs__btn ${isLinkActive(item)}">
    ${item.title}
  </label>
  `).join(``)}
</nav>`;
  }
}

function isLinkActive(link) {
  return link.isActive ? `trip-tabs__btn--active` : ``;
}
