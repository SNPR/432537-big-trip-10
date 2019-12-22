const CARDS_AMOUNT = 20;
const OFFERS_AMOUNT = 3;

const offers = [
  {
    name: `Add luggage`,
    type: `luggage`,
    price: 15,
    checked: true
  },
  {
    name: `Switch to comfort class`,
    type: `comfort`,
    price: 55,
    checked: false
  },
  {
    name: `Add meal`,
    type: `meal`,
    price: 10,
    checked: false
  },
  {
    name: `Choose seats`,
    type: `seats`,
    price: 15,
    checked: true
  },
  {
    name: `Travel by train`,
    type: `train`,
    price: 35,
    checked: false
  }
];

const shuffleArray = (arr) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const sentences = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  `Cras aliquet varius magna, non porta ligula feugiat eget.`,
  `Fusce tristique felis at fermentum pharetra.`,
  `Aliquam id orci ut lectus varius viverra.`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
  `Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat.`,
  `Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`
];

const cities = [`Amsterdam`, `Geneva`, `Chamonix`, `Saint Petersburg`];

const getRandomPhoto = () => `http://picsum.photos/300/150?r=${Math.random()}`;

const getRandomDescriprion = () =>
  shuffleArray(sentences)
    .slice(0, getRandomNumber(1, 4))
    .join(` `);

const types = [
  `taxi`,
  `bus`,
  `train`,
  `ship`,
  `transport`,
  `drive`,
  `flight`,
  `check-in`,
  `sightseeing`,
  `restaurant`,
  `trip`
];

const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

const getRandomArrayItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

const getRandomDate = () => {
  return (
    Date.now() +
    1 +
    Math.floor(Math.random() * 7) * 24 * getRandomNumber(0, 60) * 60 * 1000
  );
};

const generateCard = () => {
  const startDate = getRandomDate();
  const endDate = getRandomDate();
  return {
    type: getRandomArrayItem(types),
    city: getRandomArrayItem(cities),
    startDate: Math.min(startDate, endDate),
    endDate: Math.max(startDate, endDate),
    offers: shuffleArray(offers).slice(0, OFFERS_AMOUNT),
    photos: Array(5)
      .fill(``)
      .map(getRandomPhoto),
    description: getRandomDescriprion(sentences),
    price: getRandomNumber(10, 100),
    isFavorite: false,
    id: String(Date.now() + Math.random())
  };
};

const generateCards = (amount) => {
  return Array(amount)
    .fill(``)
    .map((_) => generateCard())
    .sort(
        (currentCard, nextCard) => currentCard.startDate - nextCard.startDate
    );
};

export const EmptyPoint = {
  type: `taxi`,
  city: ``,
  startDate: Date.now(),
  endDate: Date.now(),
  offers: [],
  photos: [],
  description: ``,
  price: 0,
  isFavorite: false,
  id: String(Date.now() + Math.random())
};

export const cards = generateCards(CARDS_AMOUNT);
