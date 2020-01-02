export default class Point {
  constructor(data) {
    this.type = data[`type`];
    this.city = data[`destination`][`name`];
    this.startDate = new Date(data[`date_from`]).getTime();
    this.endDate = new Date(data[`date_to`]).getTime();
    this.offers = data[`offers`];
    this.photos = data[`destination`][`pictures`];
    this.description = data[`destination`][`description`];
    this.price = data[`base_price`];
    this.isFavorite = data[`is_favorite`];
    this.id = data[`id`];
  }

  toRAW() {
    return {
      base_price: this.price,
      date_from: new Date(this.startDate).toISOString(),
      date_to: new Date(this.endDate).toISOString(),
      destination: {
        description: this.description,
        name: this.city,
        pictures: this.pictures
      },
      id: this.id,
      is_favorite: this.isFavorite,
      offers: this.offers,
      type: this.type
    };
  }

  static parsePoint(data) {
    return new Point(data);
  }

  static parsePoints(data) {
    return data.map(Point.parsePoint);
  }

  static clone(data) {
    return new Point(data.toRAW());
  }
}