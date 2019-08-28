export const createMenuTemplate = (menu) => {
  return `<nav class="trip-controls__trip-tabs  trip-tabs">
            ${menu.map((item) => `
              <a class="trip-tabs__btn  ${isLinkActive(item)}" href="${item.href}">${item.title}</a>
              `).join(``)}
            </nav>`;
};

function isLinkActive(link) {
  return link.isActive ? `trip-tabs__btn--active` : ``;
}
