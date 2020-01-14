export default class Store {
  constructor() {
    this._destinations = null;
    this._offers = null;
  }

  static getDestinations() {
    return Store._destinations;
  }

  static setDestinations(destinations) {
    Store._destinations = destinations;
  }

  static getOffers() {
    return Store._offers;
  }

  static getOffersByType(type) {
    return Store._offers.find((offer) => offer.type === type).offers;
  }

  static setOffers(offers) {
    Store._offers = offers;
  }
}
