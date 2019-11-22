export const renderElement = (container, element, position = `beforeend`) => {
  container.insertAdjacentHTML(position, element);
};
