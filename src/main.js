import AppController from "./controllers/app";

window.addEventListener(`load`, () => {
  navigator.serviceWorker
    .register(`/sw.js`)
    .then(() => {})
    .catch(() => {});
});

new AppController().init();
