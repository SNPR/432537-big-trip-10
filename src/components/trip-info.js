export const getTripInfo = (cards) => {
  return `
    <div class="trip-info__main">
      <h1 class="trip-info__title">${cards[0].city}
      ${cards.length > 2 ? `&mdash; ... &mdash;` : `&mdash;`}
      ${cards[cards.length - 1].city}
      </h1>
      <p class="trip-info__dates">Mar 18&nbsp;&mdash;&nbsp;21</p>
    </div>
  `;
};
