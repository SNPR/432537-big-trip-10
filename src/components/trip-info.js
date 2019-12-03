const getDuration = (startDateUTCTimestamp, endDateUTCTimestamp) => {
  const startDate = new Date(startDateUTCTimestamp);

  const monthName = startDate.toLocaleString(`default`, {
    month: `short`
  });
  const startDay = startDate.getDate();
  const endDay = new Date(endDateUTCTimestamp).getDay();

  return `${monthName} ${startDay}&nbsp;&mdash;&nbsp;${endDay}`;
};

export const getTripInfo = (cards) => {
  return `
    <div class="trip-info__main">
      <h1 class="trip-info__title">${cards[0].city}
      ${cards.length > 2 ? `&mdash; ... &mdash;` : `&mdash;`}
      ${cards[cards.length - 1].city}
      </h1>
      <p class="trip-info__dates">
      ${getDuration(cards[0].startDate, cards[cards.length - 1].endDate)}
      </p>
    </div>
  `;
};
