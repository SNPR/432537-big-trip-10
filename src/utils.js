export const renderElement = (container, element, position = `beforeend`) => {
  container.insertAdjacentHTML(position, element);
};

export const createElement = (template) => {
  const element = document.createElement(`div`);
  element.innerHTML = template;

  return element.firstChild;
};
