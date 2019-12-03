const CARDS_AMOUNT = 4;

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

const addZero = (number) => {
  if (number === 0) {
    return `01`;
  }
  return number < 10 ? `0${number}` : number;
};

const getRandomDate = () => {
  const date = new Date(
      getRandomNumber(2016, 2021),
      getRandomNumber(0, 12),
      getRandomNumber(0, 28)
  );

  return `${addZero(date.getDate())}/${addZero(date.getMonth())}/${String(
      date.getFullYear()
  ).slice(2)}`;
};

const getRandomTime = () =>
  `${addZero(getRandomNumber(0, 13))}:${addZero(getRandomNumber(0, 60))}`;

const generateCard = () => {
  return {
    type: getRandomArrayItem(types),
    city: getRandomArrayItem(cities),
    startDate: `${getRandomDate()} ${getRandomTime()}`,
    endDate: `${getRandomDate()} ${getRandomTime()}`,
    offers,
    photos: Array(5)
      .fill(``)
      .map(getRandomPhoto),
    description: getRandomDescriprion(sentences),
    price: getRandomNumber(100, 100)
  };
};

const generateCards = (amount) =>
  Array(amount)
    .fill(``)
    .map((_) => generateCard());

const card = generateCard();
const cards = generateCards(CARDS_AMOUNT);
export {card, cards};
