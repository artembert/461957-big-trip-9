export const render = (markup, container, place = `beforeend`) => {
  container.insertAdjacentHTML(place, markup);
};
