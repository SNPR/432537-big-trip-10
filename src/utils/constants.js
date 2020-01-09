export const SortType = {
  DATE_DOWN: `date-down`,
  TIME_DOWN: `time-down`,
  PRICE_DOWN: `price-down`
};

export const MenuItem = {
  TABLE: `Table`,
  STATS: `Stats`
};

export const menuItems = [
  {
    name: MenuItem.TABLE,
    active: true
  },
  {
    name: MenuItem.STATS,
    active: false
  }
];

export const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`,
  ADDING: `adding`
};

export const FilterType = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`
};

export const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

export const EventTypeToPlaceholderText = {
  "taxi": `to`,
  "bus": `to`,
  "train": `to`,
  "ship": `to`,
  "transport": `to`,
  "drive": `to`,
  "flight": `to`,
  "check-in": `at`,
  "sightseeing": `at`,
  "restaurant": `at`
};

export const AUTHORIZATION = `Basic {_P)[i-390sadasdadEW`;
export const END_POINT = `https://htmlacademy-es-10.appspot.com/big-trip`;

export const DefaultData = {
  deleteButtonText: `Delete`,
  saveButtonText: `Save`
};

export const SHAKE_ANIMATION_TIMEOUT = 600;

export const BACKUP_PREFIX = `big_trip-localstorage`;
export const BACKUP_VER = `v1`;
export const BACKUP_NAME = `${BACKUP_PREFIX}-${BACKUP_VER}`;

export const DEBOUNCE_TIMEOUT = 500;
