import moment from "moment";

const addZero = (value) => (value < 10 ? `0${value}` : value);

export const parseTime = (UTCTimestamp) => moment(UTCTimestamp).format(`HH:mm`);

export const getTripDuration = (startDateUTCTimestamp, endDateUTCTimestamp) => {
  const monthName = moment(startDateUTCTimestamp).format(`MMM`);
  const startDay = moment(startDateUTCTimestamp).format(`DD`);
  const endDay = moment(endDateUTCTimestamp).format(`DD`);

  return `${monthName} ${startDay}&nbsp;&mdash;&nbsp;${endDay}`;
};

export const getEventDuration = (
    startDateUTCTimestamp,
    endDateUTCTimestamp
) => {
  const duration = moment
    .duration()
    .subtract(startDateUTCTimestamp - endDateUTCTimestamp);

  const days = duration.days();
  const hours = duration.hours();
  const minuntes = duration.minutes();

  return `
    ${(days > 0 && addZero(days) + `D`) || ``}
    ${((days > 0 || hours > 0) && addZero(hours) + `H`) || ``}
    ${addZero(minuntes)}M
  `;
};
