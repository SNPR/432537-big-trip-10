export const getTripDayItem = (card) => {
  return `
    <li class="trip-days__item  day">
    <div class="day__info">
      <span class="day__counter">1</span>
      <time class="day__date" datetime="${card.startDate}">
      ${new Date(card.startDate).toLocaleString(`default`, {month: `short`})}
      </time>
    </div>
    <ul class="trip-events__list">
    </ul>
  </li>`;
};
