export const getTripDayItem = (card, day) => {
  return `
    <li class="trip-days__item  day">
    <div class="day__info">
      <span class="day__counter">${day}</span>
      <time class="day__date" datetime="${card.startDate}">
      ${new Date(card.startDate).toLocaleString(`default`, {
    month: `short`
  })}
      ${new Date(card.startDate).getDate()}
      </time>
    </div>
    <ul class="trip-events__list">
    </ul>
  </li>`;
};
